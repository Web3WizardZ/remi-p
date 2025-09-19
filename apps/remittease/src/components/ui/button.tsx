// =============================================
// FILE: components/ui/button.tsx
// (UI-only: aligned to Tailwind v4 theme tokens)
// =============================================
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';


export const buttonVariants = cva(
'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-ring))] disabled:pointer-events-none disabled:opacity-50',
{
variants: {
variant: {
default: 'bg-[hsl(var(--brand-primary))] text-white shadow-sm hover:shadow-md hover:bg-[hsl(var(--brand-primary)/0.92)]',
destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-600/90',
outline: 'border border-[hsl(var(--brand-primary))] bg-card text-[hsl(var(--brand-primary))] hover:bg-muted',
secondary: 'bg-[hsl(var(--brand-secondary))] text-white shadow-sm hover:bg-[hsl(var(--brand-secondary)/0.9)]',
ghost: 'hover:bg-muted',
link: 'text-[hsl(var(--brand-primary))] underline-offset-4 hover:underline',
},
size: {
default: 'h-10 px-4 py-2',
sm: 'h-9 rounded-xl px-3',
lg: 'h-11 rounded-2xl px-6',
icon: 'h-10 w-10',
},
},
defaultVariants: {
variant: 'default',
size: 'default',
},
}
);


export interface ButtonProps
extends React.ButtonHTMLAttributes<HTMLButtonElement>,
VariantProps<typeof buttonVariants> {
asChild?: boolean;
}


export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
({ className, variant, size, asChild = false, ...props }, ref) => {
const Comp = asChild ? Slot : 'button';
return (
<Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
);
}
);
Button.displayName = 'Button';