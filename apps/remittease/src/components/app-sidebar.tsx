'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  User,
  Wallet,
  Home,
  Send as SendIcon,
  Download as ReceiveIcon,
  Plus as DepositIcon,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  useActiveAccount,
  useAccountBalance,
  usePanna,
  useLogout,
  useConnectedAccounts,
  lisk,
  LoginButton,
} from 'panna-sdk';

const themeStyle: React.CSSProperties = {
  '--brand-primary': '262 83% 58%',
  '--brand-secondary': '286 84% 62%',
  '--brand-accent': '142 71% 45%',
  '--brand-blue': '217 91% 60%',
  '--brand-pink': '316 73% 58%',
} as React.CSSProperties;

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

// Simple reduced motion detection
const useMotionPreference = () => {
  const [prefersReduced, setPrefersReduced] = React.useState(false);
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
};

const Logo = ({ className = '' }) => (
  <div className={`flex items-center gap-3 transition-all duration-300 ${className}`}>
    <motion.div
      className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100"
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src="/RE icon.png"
        alt="RemittEase Logo"
        className="w-6 h-6 object-contain"
      />
    </motion.div>
    <div className="flex flex-col">
      <span className="text-lg font-bold text-gray-900">RemittEase</span>
      <span className="text-xs text-gray-500 font-medium">Global Payments</span>
    </div>
  </div>
);

// global opener
declare global {
  interface Window {
    __openPannaWidget?: (view?: 'Deposit' | 'Send' | 'Receive') => void;
  }
}

export type AppSidebarProps = {
  // Desktop props
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;

  // Mobile props
  isMobile?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  opensWidget?: 'Deposit' | 'Send' | 'Receive';
  description?: string;
};

const nav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Dashboard',
    items: [
      { title: 'Home', url: '/', icon: Home, description: 'Overview & stats' },
      { title: 'Account', url: '/account', icon: User, description: 'Profile & settings' },
    ],
  },
  {
    title: 'Transactions',
    items: [
      { title: 'Send Money', url: '/send', icon: SendIcon, opensWidget: 'Send', description: 'Transfer funds globally' },
      { title: 'Receive', url: '/receive', icon: ReceiveIcon, opensWidget: 'Receive', description: 'Get payments instantly' },
      { title: 'Add Funds', url: '/deposit', icon: DepositIcon, opensWidget: 'Deposit', description: 'Deposit to wallet' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { title: 'Wallets', url: '/wallets', icon: Wallet, description: 'Manage wallets' },
      { title: 'Preferences', url: '/settings', icon: Settings, description: 'App settings' },
      { title: 'Help', url: '/help', icon: HelpCircle, description: 'Support center' },
    ],
  },
];

function usePannaBits() {
  const pathname = usePathname();
  const { disconnect: logout } = useLogout();
  const activeAccount = useActiveAccount();
  const connectedAccounts = useConnectedAccounts();
  const { client } = usePanna();
  
  const { data: accountBalance } = useAccountBalance({
    address: activeAccount?.address || '',
    client,
    chain: lisk,
    enabled: Boolean(client && activeAccount?.address)
  } as any);

  const isConnected = !!activeAccount;

  const activeWallet = React.useMemo(
    () =>
      connectedAccounts?.find((w: any) => {
        try {
          return w?.getAccount?.()?.address === activeAccount?.address;
        } catch {
          return false;
        }
      }) ?? connectedAccounts?.[0],
    [connectedAccounts, activeAccount]
  );

  const totalFiatUSD: number | null = React.useMemo(() => {
    if (!accountBalance) return null;
    try {
      const usd1 = (accountBalance as any)?.fiatBalance?.amount;
      const usd2 = (accountBalance as any)?.fiat?.usd;
      const usd3 = (accountBalance as any)?.usdValue ?? (accountBalance as any)?.fiatValue;
      const n = [usd1, usd2, usd3].find((v) => typeof v === 'number');
      return typeof n === 'number' ? n : null;
    } catch {
      return null;
    }
  }, [accountBalance]);

  const formatCurrencyUSD = (amount: number | null | undefined) => {
    if (amount === undefined || amount === null || Number.isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const truncateAddress = (addr?: string) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '');
  const itemIsActive = (url: string) => pathname === url;

  return {
    isConnected,
    activeAccount,
    activeWallet,
    totalFiatUSD,
    formatCurrencyUSD,
    truncateAddress,
    itemIsActive,
    logout,
  } as const;
}

export function AppSidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  isMobileOpen = false,
  onMobileClose,
}: AppSidebarProps) {
  const {
    isConnected,
    activeAccount,
    activeWallet,
    totalFiatUSD,
    formatCurrencyUSD,
    truncateAddress,
    itemIsActive,
    logout,
  } = usePannaBits();

  const prefersReducedMotion = useMotionPreference();

  const openPannaWidget = React.useCallback(
    (view?: 'Deposit' | 'Send' | 'Receive') => {
      if (onMobileClose) onMobileClose();
      setTimeout(() => window.__openPannaWidget?.(view), 300);
    },
    [onMobileClose]
  );

  const handleLogout = () => {
    if (activeWallet) logout(activeWallet);
    onMobileClose?.();
  };

  // Simplified background blobs (respects reduced motion)
  const backgroundShapes = React.useMemo(
    () => prefersReducedMotion ? null : (
      <>
        <motion.div
          className="absolute -top-24 -right-24 h-40 w-40 rounded-full bg-gradient-to-br from-purple-400/15 to-pink-400/15 blur-3xl"
          animate={{ x: [0, 20, -10, 0], y: [0, 15, -5, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 h-32 w-32 rounded-full bg-gradient-to-tr from-purple-500/15 to-blue-500/15 blur-3xl"
          animate={{ x: [0, -15, 10, 0], y: [0, -20, 5, 0], scale: [1, 0.8, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </>
    ),
    [prefersReducedMotion]
  );

  // -------- Mobile variant (drawer)
  if (isMobile) {
    return (
      <AnimatePresence>
        {isMobileOpen && (
          <div style={themeStyle}>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw]"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="relative h-full">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">{backgroundShapes}</div>

                <div className="relative bg-white/90 backdrop-blur-2xl shadow-2xl h-full flex flex-col">
                  {/* Header */}
                  <motion.div
                    className="p-4 border-b border-gray-100"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Logo />

                    {isConnected && activeAccount ? (
                      <motion.div
                        className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-md flex items-center justify-center">
                            <img
                              src="/RE icon.png"
                              alt="RemittEase Logo"
                              className="w-6 h-6 object-contain"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {truncateAddress(activeAccount.address)}
                            </div>
                            <div className="text-xs text-gray-500">My Wallet</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Total Balance</span>
                          <span className="text-lg font-bold text-gray-900">{formatCurrencyUSD(totalFiatUSD)}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="text-center">
                          <div className="text-base font-semibold text-gray-900 mb-2">Welcome to RemittEase</div>
                          <div className="text-sm text-gray-600 mb-4">Connect your wallet to get started</div>
                          <LoginButton />
                        </div>
                      </motion.div>
                    )}

                    {/* Connection status */}
                    <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                      <div
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm',
                          isConnected
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        )}
                      >
                        <motion.div
                          className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-emerald-500' : 'bg-amber-500')}
                          animate={
                            isConnected
                              ? {
                                  scale: [1, 1.3, 1],
                                  boxShadow: [
                                    '0 0 0 0 rgba(16, 185, 129, 0.5)',
                                    '0 0 0 6px rgba(16, 185, 129, 0)',
                                    '0 0 0 0 rgba(16, 185, 129, 0.5)',
                                  ],
                                }
                              : {}
                          }
                          transition={{ duration: 2, repeat: isConnected ? Infinity : 0 }}
                        />
                        <span className="font-semibold">{isConnected ? 'Connected & Secure' : 'Connect to continue'}</span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Navigation */}
                  <NavList
                    nav={nav}
                    itemIsActive={itemIsActive}
                    onItemLinkClick={onMobileClose}
                    onOpenWidget={openPannaWidget}
                  />

                  {/* Footer */}
                  {isConnected && activeWallet && (
                    <motion.div
                      className="p-4 border-t border-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 transition-colors group border border-red-200 hover:border-red-300"
                      >
                        <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Sign Out</div>
                          <div className="text-xs opacity-80">Disconnect wallet</div>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // -------- Desktop variant (static)
  return (
    <aside
      style={themeStyle}
      className={cn(
        'h-full bg-white/90 backdrop-blur-xl border-r border-gray-100 shadow-lg',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="relative h-full flex flex-col">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">{backgroundShapes}</div>

        {/* Header / Collapse button */}
        <div className="relative z-10 p-4 border-b border-gray-100 flex items-center justify-between">
          {!isCollapsed ? <Logo /> : (
            <div className="w-8 h-8 bg-white border border-gray-100 shadow-md rounded-xl flex items-center justify-center">
              <img
                src="/RE icon.png"
                alt="RemittEase"
                className="w-5 h-5 object-contain"
              />
            </div>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="ml-2 rounded-lg border border-gray-200 px-2 py-1 text-xs bg-white hover:bg-gray-50 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? '›' : '‹'}
            </button>
          )}
        </div>

        {/* Navigation */}
        <NavList
          nav={nav}
          itemIsActive={itemIsActive}
          onItemLinkClick={undefined}
          onOpenWidget={openPannaWidget}
          collapsed={isCollapsed}
        />
      </div>
    </aside>
  );
}

type NavListProps = {
  nav: { title: string; items: NavItem[] }[];
  itemIsActive: (url: string) => boolean;
  onItemLinkClick?: () => void;
  onOpenWidget: (view?: 'Deposit' | 'Send' | 'Receive') => void;
  collapsed?: boolean;
};

function NavList({
  nav,
  itemIsActive,
  onItemLinkClick,
  onOpenWidget,
  collapsed = false,
}: NavListProps) {
  return (
    <div className="relative z-10 flex-1 p-4 overflow-y-auto">
      {nav.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          className={cn('mb-6', collapsed && 'mb-4')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + groupIndex * 0.05 }}
        >
          {!collapsed && (
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
              {group.title}
            </h3>
          )}

          <div className="space-y-2">
            {group.items.map((item, itemIndex) => {
              const active = itemIsActive(item.url);
              const Icon = item.icon;

              const content = (
                <motion.div
                  className={cn(
                    'w-full rounded-xl transition-all duration-200 group relative',
                    active
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'hover:bg-gray-50 text-gray-700'
                  )}
                  whileHover={active ? {} : { scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + groupIndex * 0.1 + itemIndex * 0.05, duration: 0.2 }}
                >
                  <div className={cn('flex items-center gap-3 p-3', collapsed && 'justify-center p-3')}>
                    <div
                      className={cn(
                        'p-2 rounded-lg transition-colors flex-shrink-0',
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600 shadow-sm'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            'font-semibold text-sm mb-1',
                            active
                              ? 'text-white'
                              : 'text-gray-900 group-hover:text-purple-600'
                          )}
                        >
                          {item.title}
                        </div>
                        {item.description && (
                          <div className={cn(
                            'text-xs leading-tight',
                            active ? 'text-white/80' : 'text-gray-500'
                          )}>
                            {item.description}
                          </div>
                        )}
                      </div>
                    )}

                    {!collapsed && item.badge && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-sm flex-shrink-0">
                        {item.badge}
                      </span>
                    )}

                    {collapsed && <span className="sr-only">{item.title}</span>}
                  </div>
                </motion.div>
              );

              if (item.opensWidget) {
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => onOpenWidget(item.opensWidget)}
                    className="w-full text-left"
                    aria-label={item.title}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link key={item.title} href={item.url} className="block" onClick={onItemLinkClick}>
                  {content}
                </Link>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}