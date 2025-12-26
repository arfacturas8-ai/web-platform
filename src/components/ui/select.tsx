import * as React from "react"
import { cn } from "@/lib/utils"

// Context to pass value and onValueChange from Select wrapper to SelectTrigger
const SelectContext = React.createContext<{
  value?: string | number | readonly string[]
  defaultValue?: string | number | readonly string[]
  onValueChange?: (value: string) => void
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  onBlur?: React.FocusEventHandler<HTMLSelectElement>
  name?: string
  disabled?: boolean
}>({})

// Check if children contain SelectTrigger component
const hasSelectTrigger = (children: React.ReactNode): boolean => {
  let found = false
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const displayName = (child.type as any)?.displayName
      if (displayName === 'SelectTrigger') {
        found = true
      }
    }
  })
  return found
}

// Select can work as either:
// 1. A wrapper (when containing SelectTrigger)
// 2. A direct select element (when containing option elements)
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  children: React.ReactNode
  value?: string | number | readonly string[]
  defaultValue?: string | number | readonly string[]
  onValueChange?: (value: string) => void
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, value, defaultValue, onValueChange, onChange, onBlur, name, disabled, ...props }, ref) => {
    const isWrapper = hasSelectTrigger(children)

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) {
        onValueChange(e.target.value)
      }
      if (onChange) {
        onChange(e)
      }
    }

    if (isWrapper) {
      // Act as a context provider wrapper
      return (
        <SelectContext.Provider value={{ value, defaultValue, onValueChange, onChange, onBlur, name, disabled }}>
          {children}
        </SelectContext.Provider>
      )
    }

    // Act as a direct select element
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onBlur={onBlur}
        name={name}
        disabled={disabled}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

// SelectTrigger is the actual <select> element when used with wrapper pattern
interface SelectTriggerProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onBlur'> {
  className?: string
}

const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (context.onValueChange) {
        context.onValueChange(e.target.value)
      }
      if (context.onChange) {
        context.onChange(e)
      }
    }

    return (
      <select
        className={cn(
          "flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={context.value}
        defaultValue={context.defaultValue}
        onChange={handleChange}
        onBlur={context.onBlur}
        name={context.name}
        disabled={context.disabled}
        {...props}
      >
        {children}
      </select>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

// SelectContent just renders children (options are inside the select)
const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
)
SelectContent.displayName = "SelectContent"

// SelectItem renders an <option>
const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ children, ...props }, ref) => (
  <option ref={ref} {...props}>
    {children}
  </option>
))
SelectItem.displayName = "SelectItem"

// SelectValue is not needed for native select but kept for API compatibility
const SelectValue: React.FC<{ children?: React.ReactNode; placeholder?: string }> = () => null
SelectValue.displayName = "SelectValue"

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
