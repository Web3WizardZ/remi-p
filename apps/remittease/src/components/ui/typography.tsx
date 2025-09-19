'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { type ElementType } from 'react';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  /** Render as a specific intrinsic element, e.g. 'p' | 'h1' */
  as?: keyof React.JSX.IntrinsicElements; // <-- use React.JSX here
}

export function Typography({
  className,
  variant,
  as,
  ...props
}: TypographyProps) {
  // Decide element: explicit `as` wins; otherwise infer from variant; fallback 'p'
  const Comp = (
    as ?? (variant && `${variant}`.startsWith('h') ? (variant as 'h1' | 'h2' | 'h3' | 'h4') : 'p')
  ) as ElementType;

  return (
    <Comp
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  );
}
