import React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}

function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', shape = 'square', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
    };

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-md',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden bg-gray-700 items-center justify-center text-gray-300',
          sizeClasses[size],
          shapeClasses[shape],
          className,
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span>{fallback || alt?.charAt(0) || '?'}</span>
        )}
      </div>
    );
  },
);
Avatar.displayName = 'Avatar';
