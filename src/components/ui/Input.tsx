import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helpText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-body-sm font-medium text-dark-gray"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input',
            error && 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-body-sm text-semantic-error">{error}</p>}
        {helpText && !error && <p className="mt-1 text-body-sm text-gray">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
