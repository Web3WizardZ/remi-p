'use client';

import React, { useEffect, useMemo, forwardRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, type MotionProps } from 'framer-motion';
import { LoginButton, useActiveAccount } from 'panna-sdk';
import {
  Menu,
  Bell,
  Settings,
  Wallet,
  ChevronDown,
  X,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const themeStyle = {
  '--brand-primary': '262 83% 58%',
  '--brand-secondary': '286 84% 62%',
  '--brand-accent': '142 71% 45%',
  '--brand-blue': '217 91% 60%',
  '--brand-pink': '316 73% 58%',
} as React.CSSProperties;

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'gradient' | 'glass';
type ButtonSize = 'sm' | 'default' | 'lg';

// Omit HTML drag props so they don't clash with Framer Motion's drag handlers
type HTMLButtonNoDrag = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd'
>;

interface OwnButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

type ButtonProps = HTMLButtonNoDrag & MotionProps & OwnButtonProps;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'default',
      size = 'default',
      disabled,
      loading,
      ...props
    },
    ref
  ) => {
    const sizeClasses =
      size === 'sm'
        ? 'px-3 py-1.5 text-xs h-8'
        : size === 'lg'
        ? 'px-6 py-3 text-base h-12'
        : 'px-4 py-2 text-sm h-10';

    const base =
      'rounded-2xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 relative overflow-hidden';

    const variants: Record<ButtonVariant, string> = {
      default:
        'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-800',
      outline:
        'border-2 border-gray-200/60 text-gray-700 hover:bg-white/60 hover:border-gray-300/60 backdrop-blur-sm bg-white/40',
      ghost:
        'text-gray-700 hover:bg-white/30 hover:text-gray-900 backdrop-blur-sm',
      gradient:
        'bg-gradient-to-r from-[hsl(var(--brand-primary))] via-[hsl(var(--brand-secondary))] to-[hsl(var(--brand-pink))] hover:from-[hsl(var(--brand-secondary))] hover:to-[hsl(var(--brand-pink))] text-white shadow-lg hover:shadow-xl',
      glass:
        'bg-white/20 backdrop-blur-xl border border-white/30 text-gray-800 hover:bg-white/30 shadow-lg hover:shadow-xl',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(sizeClasses, base, variants[variant], className)}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

const labels: Record<string, string> = {
  '/': 'Dashboard',
  '/account': 'Account',
  '/send': 'Send Money',
  '/receive': 'Receive',
  '/deposit': 'Deposit',
  '/wallets': 'Wallets',
  '/settings': 'Settings',
  '/help': 'Help',
};

// Global helper type to open the Panna widget
declare global {
  interface Window {
    __openPannaWidget?: (view?: 'Deposit' | 'Send' | 'Receive') => void;
  }
}

const truncateAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

interface AppHeaderProps {
  onMenuClick?: () => void;
  isMobileMenuOpen?: boolean;
}

export function AppHeader({ onMenuClick, isMobileMenuOpen }: AppHeaderProps) {
  const pathname = usePathname();
  const label = labels[pathname] ?? 'Dashboard';

  const activeAccount = useActiveAccount();
  const isConnected = !!activeAccount;

  // Enhanced background animations
  const backgroundShapes = useMemo(
    () => (
      <>
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-2xl"
          animate={{
            x: [0, 20, -10, 0],
            y: [0, 15, -5, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full mix-blend-multiply filter blur-2xl"
          animate={{
            x: [0, -15, 10, 0],
            y: [0, -20, 5, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
      </>
    ),
    []
  );

  // Register a global opener that clicks the wrapped LoginButton and optionally selects a tab
  useEffect(() => {
    const selectTabByLabel = (tabLabel?: string) => {
      if (!tabLabel) return;
      let tries = 0;
      const t = window.setInterval(() => {
        tries += 1;
        const candidates = Array.from(
          document.querySelectorAll<HTMLElement>('button,[role="tab"]')
        );

        const match = candidates.find((el) => {
          const txt = (el.innerText || el.textContent || '')
            .trim()
            .toLowerCase();
          if (!txt) return false;
          const wanted = tabLabel.toLowerCase();
          return (
            txt === wanted ||
            (wanted === 'deposit' && /deposit|add funds|top ?up/.test(txt)) ||
            (wanted === 'send' && /send|transfer/.test(txt)) ||
            (wanted === 'receive' && /receive|request/.test(txt))
          );
        });

        if (match) {
          match.click();
          window.clearInterval(t);
        }
        if (tries > 20) window.clearInterval(t); // ~2s max (20 * 100ms)
      }, 100);
    };

    window.__openPannaWidget = (view) => {
      const wrapper =
        document.getElementById('panna-widget-trigger') ||
        document.querySelector('[data-panna-login-wrapper]');

      const clickTarget =
        wrapper?.querySelector<HTMLElement>('button, [role="button"]');
      if (clickTarget) {
        clickTarget.click();
        if (view) selectTabByLabel(view);
      }
    };

    return () => {
      delete window.__openPannaWidget;
    };
  }, []);

  const accountPill = useMemo(() => {
    if (!isConnected) return null;

    return (
      <motion.button
        onClick={() => window.__openPannaWidget?.()}
        className="group flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl bg-white/60 hover:bg-white/80 backdrop-blur-xl ring-1 ring-white/30 shadow-lg transition-all"
        whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-xl p-0.5 bg-gradient-to-br from-[hsl(var(--brand-primary))] via-[hsl(var(--brand-secondary))] to-[hsl(var(--brand-pink))] shadow-lg">
          <div className="w-full h-full rounded-[10px] bg-white grid place-items-center">
            <Logo className="w-5 h-5 opacity-90" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-800">
            {truncateAddress(activeAccount.address)}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
        </div>
      </motion.button>
    );
  }, [isConnected, activeAccount?.address]);

  return (
    <div style={themeStyle} className="relative">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundShapes}
      </div>

      <motion.header
        className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-white/30 shadow-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 sm:h-18 items-center justify-between">
            {/* Left: Menu + Logo + Title + Breadcrumb */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                variant="glass"
                size="sm"
                className="p-2 lg:hidden"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={onMenuClick}
              >
                <motion.div
                  animate={isMobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.div>
              </Button>

              {/* Logo and brand */}
              <Link href="/" className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--brand-primary))] via-[hsl(var(--brand-secondary))] to-[hsl(var(--brand-pink))] p-0.5 shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-full h-full rounded-2xl bg-white grid place-items-center">
                    <Logo className="w-6 h-6 opacity-90" />
                  </div>
                </motion.div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-[hsl(var(--brand-primary))] via-[hsl(var(--brand-secondary))] to-[hsl(var(--brand-pink))] bg-clip-text text-transparent">
                    RemittEase
                  </span>
                  <div className="text-xs text-gray-500 font-medium">
                    Global Payments
                  </div>
                </div>
              </Link>

              {/* Breadcrumb with enhanced styling */}
              <div className="hidden md:flex items-center gap-3 ml-2">
                <motion.div
                  className="w-1.5 h-1.5 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[hsl(var(--brand-primary))]/10 to-[hsl(var(--brand-secondary))]/10 backdrop-blur-sm border border-white/40"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-sm font-semibold bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-secondary))] bg-clip-text text-transparent">
                    {label}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  {/* Connected status chip */}
                  <motion.div
                    className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50/90 to-green-50/90 border border-emerald-200/50 backdrop-blur-sm shadow-sm"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(16, 185, 129, 0.4)',
                          '0 0 0 4px rgba(16, 185, 129, 0)',
                          '0 0 0 0 rgba(16, 185, 129, 0.4)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs font-semibold text-emerald-700">
                      Connected
                    </span>
                  </motion.div>

                  {/* Action buttons */}
                  <Button
                    variant="glass"
                    size="sm"
                    className="p-2"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4 text-gray-700" />
                  </Button>

                  <Button
                    variant="glass"
                    size="sm"
                    className="p-2"
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4 text-gray-700" />
                  </Button>

                  {/* Account pill */}
                  {accountPill}
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <motion.div
                    className="flex items-center gap-2 text-gray-500 px-3 py-2 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Connect to continue
                    </span>
                  </motion.div>
                </div>
              )}

              {/* Wrapped LoginButton (programmatically triggered) */}
              <div
                id="panna-widget-trigger"
                data-panna-login-wrapper
                className="sr-only"
              >
                <LoginButton />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced gradient accent line */}
        <motion.div
          className="h-px bg-gradient-to-r from-[hsl(var(--brand-primary))] via-[hsl(var(--brand-secondary))] to-[hsl(var(--brand-pink))]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.header>
    </div>
  );
}
