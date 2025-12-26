import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ReservationStepperProps {
  currentStep: number;
  steps: Step[];
}

export const ReservationStepper = ({ currentStep, steps }: ReservationStepperProps) => {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              'relative',
              index !== steps.length - 1 ? 'flex-1 pr-8 sm:pr-20' : ''
            )}
          >
            {index !== steps.length - 1 && (
              <div
                className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5"
                aria-hidden="true"
              >
                <div
                  className={cn(
                    'h-full w-full',
                    step.id < currentStep ? 'bg-primary' : 'bg-muted'
                  )}
                />
              </div>
            )}

            <div className="group relative flex items-start">
              <span className="flex h-9 items-center">
                <span
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2',
                    step.id < currentStep &&
                      'border-primary bg-primary',
                    step.id === currentStep &&
                      'border-primary bg-background',
                    step.id > currentStep &&
                      'border-muted bg-background'
                  )}
                >
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        step.id === currentStep
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {step.id}
                    </span>
                  )}
                </span>
              </span>
              <span className="ml-4 flex min-w-0 flex-col">
                <span
                  className={cn(
                    'text-sm font-medium',
                    step.id === currentStep
                      ? 'text-primary'
                      : step.id < currentStep
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {step.description}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
