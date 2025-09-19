export const touchFriendlyProps = {
  // Minimum 44px touch targets (Apple HIG)
  minHeight: 44,
  minWidth: 44,
  // Better tap targets on mobile
  padding: {
    mobile: 'p-3',
    tablet: 'p-4',
    desktop: 'p-2',
  },
  // Enhanced hover states for touch devices
  touchableClasses: 'active:scale-95 active:opacity-80 select-none',
} as const;
