// =============================================
// FILE: components/ui/card.tsx
// (UI-only: use glass-card + elevation utilities)
// =============================================
import * as React from 'react';
import { cn } from '@/lib/utils';


export function Card({ className, ...props }: React.ComponentProps<'div'>) {
return (
<div
data-slot="card"
className={cn('glass-card card-elevation-3 flex flex-col gap-6', className)}
{...props}
/>
);
}


export function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
return (
<div data-slot="card-header" className={cn('grid gap-1 px-6 pt-6', className)} {...props} />
);
}


export function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
return (
<div data-slot="card-title" className={cn('text-base font-semibold', className)} {...props} />
);
}


export function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
return (
<p data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
);
}


export function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
return (
<div data-slot="card-content" className={cn('px-6', className)} {...props} />
);
}


export function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
return (
<div data-slot="card-footer" className={cn('flex items-center gap-2 px-6 pb-6', className)} {...props} />
);
}

