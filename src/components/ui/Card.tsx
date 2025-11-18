import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'glass' | 'glass-medium' | 'glass-heavy';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'solid', hover = true, children, ...props }, ref) => {
    const variantClasses = {
      solid: 'card',
      glass: 'glass-card',
      'glass-medium': 'glass-card-medium',
      'glass-heavy': 'glass-card-heavy',
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          !hover && variant === 'solid' && 'hover:transform-none hover:shadow-card',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
