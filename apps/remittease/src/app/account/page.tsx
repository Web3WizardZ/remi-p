'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CSSProperties } from 'react';
import {
  LogOut,
  Send,
  Download,
  Plus,
  Wallet,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Shield,
  Globe,
  Lock,
  Share,
  History,
  ArrowDownLeft,
  Info,
  X,
  ChevronRight,
  Users,
  Activity,
  Home,
} from 'lucide-react';
import {
  lisk,
  useAccountBalance,
  useActiveAccount,
  useConnectedAccounts,
  useLogout,
  usePanna,
  useUserProfiles,
  LoginButton,
} from 'panna-sdk';

const themeStyle = {
  '--brand-primary': '262 83% 58%',
  '--success': '142 76% 36%',
  '--warning': '38 92% 50%',
  '--error': '0 84% 60%',
} as CSSProperties;

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const motionConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = React.memo(
  ({
    children,
    className,
    variant = 'primary',
    size = 'default',
    loading,
    disabled,
    onClick,
    'aria-label': ariaLabel,
  }) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm h-9 min-w-[44px]',
      default: 'px-4 py-3 text-sm h-12 min-w-[44px]',
      lg: 'px-6 py-4 text-base h-14 min-w-[44px]',
    };

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl border border-purple-500/20',
      outline:
        'border-2 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white',
      ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    };

    return (
      <motion.button
        className={cn(
          'rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 relative',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        whileHover={disabled || loading ? {} : motionConfig.hover}
        whileTap={disabled || loading ? {} : motionConfig.tap}
        disabled={loading || disabled}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
        {!loading && children}
      </motion.button>
    );
  },
);

const Card: React.FC<{ className?: string; children: React.ReactNode }> =
  React.memo(({ className, children }) => {
    return (
      <div
        className={cn(
          'bg-white rounded-2xl shadow-lg border border-gray-100 p-6',
          className,
        )}
      >
        {children}
      </div>
    );
  });

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={cn('animate-pulse bg-gray-200 rounded-lg', className)} />
);

const Tooltip: React.FC<{ children: React.ReactNode; content: string }> = ({
  children,
  content,
}) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="cursor-help"
        tabIndex={0}
      >
        {children}
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg max-w-xs z-50"
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export default function ImprovedRemittEaseWallet() {
  const [showBalance, setShowBalance] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Toast[]>([]);
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'accounts' | 'activity'
  >('overview');
  const [widgetOpen, setWidgetOpen] = React.useState(false);
  const openLockRef = React.useRef(false);

  const { disconnect: logout } = useLogout();
  const connectedAccounts = useConnectedAccounts();
  const activeAccount = useActiveAccount();
  const { client } = usePanna();

  const isConnected = React.useMemo(() => !!activeAccount, [activeAccount]);
  const address = React.useMemo(
    () => activeAccount?.address ?? '',
    [activeAccount],
  );
  const hasValidData = React.useMemo(
    () => Boolean(client && address),
    [client, address],
  );

  const activeWallet = React.useMemo(
    () =>
      connectedAccounts?.find((w: any) => {
        try {
          return w?.getAccount?.()?.address === activeAccount?.address;
        } catch {
          return false;
        }
      }) ?? connectedAccounts?.[0],
    [connectedAccounts, activeAccount],
  );

  const {
    data: accountBalance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
    error: balanceError,
  } = useAccountBalance({
    address,
    client: client!,
    chain: lisk,
    enabled: hasValidData,
  } as any);

  const {
    data: userProfiles,
    isLoading: isLoadingProfiles,
    error: profilesError,
  } = useUserProfiles({
    client: client!,
    enabled: Boolean(client),
  } as any);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...toast, id }]);
    setTimeout(
      () =>
        setNotifications((prev) => prev.filter((n) => n.id !== id)),
      4000,
    );
  }, []);

  const totalUSD = React.useMemo(() => {
    const val = [
      (accountBalance as any)?.fiatBalance?.amount,
      (accountBalance as any)?.fiat?.usd,
      (accountBalance as any)?.usdValue,
      (accountBalance as any)?.fiatValue,
    ].find((v) => typeof v === 'number');
    return Number.isFinite(val) ? (val as number) : 0;
  }, [accountBalance]);

  const openPannaWidget = React.useCallback(
    (view?: 'Deposit' | 'Send' | 'Receive') => {
      if (openLockRef.current || widgetOpen) return;
      openLockRef.current = true;
      setWidgetOpen(true);

      try {
        (window as any).__openPannaWidget?.(view);
        if (view) {
          addToast({
            type: 'info',
            title: `${view} Opening`,
            message: `Launching ${view.toLowerCase()} interface...`,
          });
        }
      } finally {
        setTimeout(() => {
          openLockRef.current = false;
        }, 1200);
      }
    },
    [widgetOpen, addToast],
  );

  React.useEffect(() => {
    const close = () => setWidgetOpen(false);
    const events = [
      'panna:widget:close',
      'panna:widget:closed',
      'panna:modal:close',
    ];
    events.forEach((evt) => window.addEventListener(evt, close));
    return () =>
      events.forEach((evt) => window.removeEventListener(evt, close));
  }, []);

  const copyAddress = React.useCallback(async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      addToast({
        type: 'success',
        title: 'Address Copied!',
        message: 'Wallet address copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [address, addToast]);

  const handleRefresh = React.useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refetchBalance?.();
      addToast({
        type: 'success',
        title: 'Updated',
        message: 'Balance refreshed successfully',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not refresh balance',
      });
    }
    setTimeout(() => setRefreshing(false), 1000);
  }, [refetchBalance, refreshing, addToast]);

  const formatUSD = React.useCallback((amount?: number | null) => {
    if (amount === undefined || amount === null || Number.isNaN(amount))
      return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const truncateAddress = React.useCallback(
    (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`,
    [],
  );

  // NOT CONNECTED STATE – simple, MiniPay-style onboarding
  if (!isConnected) {
    return (
      <div
        style={themeStyle}
        className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 flex items-center justify-center px-4"
      >
        <Card className="max-w-sm w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100">
              <img
                src="/RE icon.png"
                alt="RemittEase Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              RemittEase Wallet
            </h2>
            <p className="text-gray-600 text-sm">
              Sign in to start sending and receiving money across borders in
              seconds.
            </p>
          </div>
          <LoginButton />
          <div className="grid grid-cols-3 gap-4 text-center mt-6">
            <div className="p-3 bg-gray-50 rounded-xl">
              <Shield className="w-5 h-5 mx-auto mb-2 text-green-600" />
              <span className="text-xs font-medium text-gray-700">
                Secure
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <Globe className="w-5 h-5 mx-auto mb-2 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">
                Global
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <CheckCircle className="w-5 h-5 mx-auto mb-2 text-purple-600" />
              <span className="text-xs font-medium text-gray-700">
                Instant
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // CONNECTED STATE – MiniPay-style wallet screen
  return (
    <div
      style={themeStyle}
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 relative"
    >
      {/* Toasts */}
      <div
        className="fixed top-4 right-4 z-40 space-y-2 max-w-sm"
        role="region"
        aria-label="Notifications"
      >
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={cn(
                'p-4 rounded-xl shadow-lg border-l-4 bg-white cursor-pointer',
                notification.type === 'success' && 'border-l-green-500',
                notification.type === 'error' && 'border-l-red-500',
                notification.type === 'info' && 'border-l-blue-500',
              )}
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id),
                )
              }
            >
              <div className="flex items-start gap-3">
                {notification.type === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                )}
                {notification.type === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                {notification.type === 'info' && (
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
                <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-md mx-auto p-4 sm:p-6">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow border border-gray-100">
              <img
                src="/RE icon.png"
                alt="RemittEase Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                RemittEase Wallet
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Lock className="w-3 h-3 text-green-600" />
                <span>Connected</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh balance"
            >
              <RefreshCw
                className={cn('w-4 h-4', refreshing && 'animate-spin')}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (activeWallet) {
                  logout(activeWallet);
                  addToast({
                    type: 'info',
                    title: 'Signed Out',
                    message: 'Successfully logged out. See you soon!',
                  });
                }
              }}
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* BALANCE CARD */}
        <Card className="mb-4 relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.4),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.3),transparent_55%)]" />
          <div className="relative z-10 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-white/15 rounded-lg backdrop-blur-sm">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Wallet Balance
                    </span>
                    <div className="flex items-center gap-1 text-[11px] opacity-80">
                      <Shield className="w-3 h-3" />
                      <span>Powered by Lisk</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 bg-white/15 rounded-lg backdrop-blur-sm hover:bg-white/25 transition-colors"
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              >
                {showBalance ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="mb-4">
              <Tooltip content="Your total balance across this RemittEase wallet">
                <p className="text-xs opacity-80 mb-1">Total balance</p>
              </Tooltip>
              {isLoadingBalance ? (
                <Skeleton className="h-8 w-32 bg-white/20" />
              ) : balanceError ? (
                <div className="p-3 bg-red-500/20 border border-red-400/40 rounded-xl text-xs">
                  <div className="flex items-start gap-2 text-red-50">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Connection Failed</h4>
                      <p className="mt-1">
                        Unable to fetch balance. Check your connection.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="mt-2 border-red-200 text-red-50 hover:bg-red-500/20"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold tracking-tight">
                      {showBalance
                        ? formatUSD(totalUSD) || '$0.00'
                        : '••••••'}
                    </span>
                  </div>
                  {showBalance && totalUSD === 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-white/80 mb-2">
                        Your wallet is empty.
                      </p>
                      <Button
                        onClick={() => openPannaWidget('Deposit')}
                        className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/25 transition-colors text-xs h-9"
                      >
                        Add your first funds
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-white hover:bg-white/15 h-9"
                onClick={copyAddress}
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="ml-1 text-xs">Copy</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-white hover:bg-white/15 h-9"
              >
                <Share className="w-4 h-4" />
                <span className="ml-1 text-xs">Share</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-white hover:bg-white/15 h-9"
              >
                <History className="w-4 h-4" />
                <span className="ml-1 text-xs">History</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <div className="flex items-center gap-1 opacity-75 mb-1">
                  <Lock className="w-3 h-3" />
                  <span>Wallet address</span>
                </div>
                <div className="font-mono text-xs">
                  {truncateAddress(address)}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 opacity-75 mb-1">
                    <Globe className="w-3 h-3" />
                    <span>Network</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/25 text-green-100 rounded-full text-[10px]">
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    <span>Live</span>
                  </div>
                </div>
                <div className="text-xs font-medium">Lisk Mainnet</div>
              </div>
            </div>
          </div>
        </Card>

        {/* PRIMARY ACTIONS – MiniPay-style large buttons */}
        <section
          className="grid grid-cols-4 gap-3 mb-5"
          aria-label="Main actions"
        >
          <Button
            className="col-span-2 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 flex-col"
            onClick={() => openPannaWidget('Send')}
            aria-label="Send money"
          >
            <Send className="w-5 h-5 mb-1" />
            <span className="font-semibold text-xs">Send</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col"
            onClick={() => openPannaWidget('Receive')}
            aria-label="Receive money"
          >
            <Download className="w-5 h-5 mb-1" />
            <span className="text-xs">Receive</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col"
            onClick={() => openPannaWidget('Deposit')}
            aria-label="Add funds"
          >
            <ArrowDownLeft className="w-5 h-5 mb-1" />
            <span className="text-xs">Add Funds</span>
          </Button>
        </section>

        {/* TABS */}
        <nav
          className="flex bg-gray-100 p-1 rounded-xl mb-5"
          role="tablist"
        >
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'accounts', label: 'Accounts', icon: Users },
            { id: 'activity', label: 'Activity', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-xs transition-all',
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Recent Activity
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="text-center py-6 text-gray-500">
                  <Activity className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-sm">
                    No recent transactions
                  </p>
                  <p className="text-xs">
                    Your transaction history will appear here.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'accounts' && (
            <motion.div
              key="accounts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Connected Accounts
                    </h3>
                    <p className="text-xs text-gray-600">
                      {userProfiles?.length || 0} profiles linked
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-9 text-xs">
                    <Plus className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">
                      Add Account
                    </span>
                  </Button>
                </div>
                {isLoadingProfiles ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                ) : profilesError ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900 text-sm">
                          Unable to load accounts
                        </h4>
                        <p className="text-xs text-red-700 mt-1">
                          Please check your connection and try again.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : userProfiles && userProfiles.length > 0 ? (
                  <div className="space-y-3">
                    {userProfiles.map((profile: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                            {(profile.email ||
                              profile.phoneNumber ||
                              'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-gray-900">
                              {profile.email ||
                                profile.phoneNumber ||
                                'Connected Account'}
                            </div>
                            <div className="text-[11px] text-gray-500 capitalize">
                              {profile.type || 'social'} account
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[11px] font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      No connected accounts
                    </h4>
                    <p className="text-xs text-gray-600 mb-4 max-w-xs mx-auto">
                      Link your email or phone for easier sign-in and extra
                      security.
                    </p>
                    <Button className="h-10 text-xs">
                      <Plus className="w-4 h-4" />
                      <span className="ml-2">Add Account</span>
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <h3 className="text-sm font-semibold text-gray-900 mb-5">
                  Transaction History
                </h3>
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <h4 className="text-sm font-semibold mb-1">
                    No transactions yet
                  </h4>
                  <p className="text-xs max-w-xs mx-auto">
                    Once you start sending or receiving money, your
                    transaction history will appear here.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
