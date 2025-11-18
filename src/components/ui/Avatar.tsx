import { forwardRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = 'md', fallback, alt = 'Avatar', src, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
    };

    const textSizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-xl',
    };

    if (!src && fallback) {
      return (
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-brand-mint text-white font-medium',
            sizeClasses[size],
            textSizes[size],
            className
          )}
        >
          {fallback}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src || '/avatars/default.png'}
        alt={alt}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
        {...props}
      />
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
