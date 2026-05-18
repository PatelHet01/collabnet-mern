import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(function Input({ className, type, ...props }, ref) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
