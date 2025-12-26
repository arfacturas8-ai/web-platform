/**
 * Re-export useToast from toast component for convenience
 */
export { useToast } from "@/components/ui/toast"
export type { ToastProps } from "@/components/ui/toast"

/**
 * Helper function for creating toast notifications
 */
export function toast(props: { title?: string; description?: string; variant?: "default" | "destructive" }) {
  // This is a stub - the actual implementation uses the ToastProvider context
  // Components should use the useToast hook instead
  console.warn("toast() called outside of ToastProvider context. Use useToast() hook instead.")
}
