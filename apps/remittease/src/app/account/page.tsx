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
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
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
  useSocialAccounts,
  useUserProfiles,
  LoginButton,
} from 'panna-sdk';

// Simplified theme tokens
const themeStyle = {
  '--brand-primary': '262 83% 58%',
  '--success': '142 76% 36%',
  '--warning': '38 92% 50%',
  '--error': '0 84% 60%',
} as CSSProperties;

// Utility function
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

  return React.useMemo(() => ({
    initial: prefersReduced ? {} : { opacity: 0, y: 20 },
    animate: prefersReduced ? {} : { opacity: 1, y: 0 },
    transition: prefersReduced ? {} : { duration: 0.3 },
    hover: prefersReduced ? {} : { scale: 1.02, transition: { duration: 0.2 } },
    tap: prefersReduced ? {} : { scale: 0.98, transition: { duration: 0.1 } },
  }), [prefersReduced]);
};

// Enhanced Button Component
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

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'default',
  loading,
  disabled,
  onClick,
  'aria-label': ariaLabel,
}) => {
  const motionProps = useMotionPreference();
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm h-9 min-w-[44px]',
    default: 'px-4 py-3 text-sm h-12 min-w-[44px]',
    lg: 'px-6 py-4 text-base h-14 min-w-[44px]',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl border border-purple-500/20',
    outline: 'border-2 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  };

  return (
    <motion.button
      className={cn(
        'rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 relative',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={disabled || loading ? {} : motionProps.hover}
      whileTap={disabled || loading ? {} : motionProps.tap}
      disabled={loading || disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      initial={motionProps.initial}
      animate={motionProps.animate}
      transition={motionProps.transition}
    >
      {loading && (
        <RefreshCw className="w-4 h-4 animate-spin" />
      )}
      {!loading && children}
    </motion.button>
  );
};

// Card Component
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  const motionProps = useMotionPreference();
  
  return (
    <motion.div
      className={cn('bg-white rounded-2xl shadow-lg border border-gray-100 p-6', className)}
      initial={motionProps.initial}
      animate={motionProps.animate}
      transition={motionProps.transition}
    >
      {children}
    </motion.div>
  );
};

// Skeleton Component
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={cn('animate-pulse bg-gray-200 rounded-lg', className)} />
);

// Tooltip Component
interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
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

// Toast System
interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

// Generate avatar helper
const generateAvatar = (
  seed: string,
  style: 'initials' | 'bottts' | 'avataaars' = 'initials'
) => {
  const baseUrl = 'https://api.dicebear.com/7.x';
  const params = new URLSearchParams({
    seed,
    backgroundColor: 'b6e3f4,c0aede,d1d4f9,fde68a,fed7aa,fecaca',
    radius: '20',
  });
  if (style === 'initials') params.append('fontSize', '36');
  return `${baseUrl}/${style}/svg?${params.toString()}`;
};

// Main Component
export default function ImprovedRemittEaseWallet() {
  const [showBalance, setShowBalance] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Toast[]>([]);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'accounts' | 'activity'>('overview');
  const [widgetOpen, setWidgetOpen] = React.useState(false);
  const openLockRef = React.useRef(false);

  const { disconnect: logout } = useLogout();
  const connectedAccounts = useConnectedAccounts();
  const activeAccount = useActiveAccount();
  const { client } = usePanna();

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

  const address = activeAccount?.address ?? '';

  // Enable hooks only when client/address exist (prevents early errors)
  const {
    data: accountBalance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
    error: balanceError,
  } = useAccountBalance({
    address,
    client,
    chain: lisk,
    enabled: Boolean(client && address)
  } as any);

  const {
    data: userProfiles,
    isLoading: isLoadingProfiles,
    error: profilesError,
  } = useUserProfiles({
    client,
    enabled: Boolean(client)
  } as any);

  useSocialAccounts({ client, address } as any);

  const isConnected = !!activeAccount;

  // Toast system - defined early to avoid hoisting issues
  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  /** USD total normalized */
  const totalUSD = React.useMemo<number>(() => {
    const val = [
      (accountBalance as any)?.fiatBalance?.amount,
      (accountBalance as any)?.fiat?.usd,
      (accountBalance as any)?.usdValue ?? (accountBalance as any)?.fiatValue,
    ].find((v) => typeof v === 'number');
    return Number.isFinite(val as number) ? (val as number) : 0;
  }, [accountBalance]);

  /** Network status */
  const networkStatus = React.useMemo(() => {
    if (balanceError)
      return { status: 'error' as const, label: 'Network error' };
    if (isLoadingBalance || refreshing)
      return { status: 'loading' as const, label: 'Syncing' };
    return { status: 'live' as const, label: 'Live Data' };
  }, [balanceError, isLoadingBalance, refreshing]);

  /** Widget opener (simple lock) */
  const openPannaWidget = React.useCallback(
    (view?: 'Deposit' | 'Send' | 'Receive') => {
      if (openLockRef.current || widgetOpen) return;
      openLockRef.current = true;
      setWidgetOpen(true);

      try {
        (window as any).__openPannaWidget?.(view);
        addToast({
          type: 'info',
          title: `${view} Opening`,
          message: `Launching ${view?.toLowerCase()} interface...`,
        });
      } finally {
        setTimeout(() => {
          openLockRef.current = false;
        }, 1200);
      }
    },
    [widgetOpen, addToast]
  );

  React.useEffect(() => {
    const close = () => setWidgetOpen(false);
    const events = [
      'panna:widget:close',
      'panna:widget:closed',
      'panna:modal:close',
      'panna:overlay:close',
      'widget:close',
      'modal:close',
    ];
    events.forEach((evt) => window.addEventListener(evt, close));
    return () => events.forEach((evt) => window.removeEventListener(evt, close));
  }, []);

  // Copy address functionality
  const copyAddress = React.useCallback(async () => {
    if (!activeAccount?.address) return;
    
    try {
      await navigator.clipboard.writeText(activeAccount.address);
      setCopied(true);
      addToast({
        type: 'success',
        title: 'Address Copied!',
        message: 'Wallet address copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = activeAccount.address;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (success) {
        setCopied(true);
        addToast({
          type: 'success',
          title: 'Address Copied!',
          message: 'Wallet address copied to clipboard',
        });
        setTimeout(() => setCopied(false), 2000);
      } else {
        addToast({
          type: 'error',
          title: 'Copy Failed',
          message: 'Failed to copy address',
        });
      }
    }
  }, [activeAccount?.address, addToast]);

  // Refresh functionality
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

  const formatUSD = (amount?: number | null) => {
    if (amount === undefined || amount === null || Number.isNaN(amount))
      return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const truncateAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Real Panna widget actions
  const handleSendMoney = () => openPannaWidget('Send');
  const handleReceive = () => openPannaWidget('Receive'); 
  const handleAddFunds = () => openPannaWidget('Deposit');

  // Not connected view
  if (!isConnected) {
    return (
      <div style={themeStyle} className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100">
              <img
                src="/RE icon.png"
                alt="RemittEase Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RemittEase</h2>
            <p className="text-gray-600">Connect your wallet to access instant cross-border payments</p>
          </div>
          
          <LoginButton />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-xl">
              <Shield className="w-5 h-5 mx-auto mb-2 text-green-600" />
              <span className="text-xs font-medium text-gray-700">Secure</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <Globe className="w-5 h-5 mx-auto mb-2 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Global</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <CheckCircle className="w-5 h-5 mx-auto mb-2 text-purple-600" />
              <span className="text-xs font-medium text-gray-700">Instant</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={themeStyle} className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm" role="region" aria-label="Notifications">
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
                notification.type === 'info' && 'border-l-blue-500'
              )}
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            >
              <div className="flex items-start gap-3">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />}
                {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />}
                {notification.type === 'info' && <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-100">
              <img
                src="/RE icon.png"
                alt="RemittEase Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Account</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
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
              <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
              <span className="hidden sm:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </motion.header>

        {/* Balance Card */}
        <Card className="mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600" />
          <div className="relative z-10 text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold">Total Balance</span>
                    <div className="flex items-center gap-1 text-xs opacity-80">
                      <Shield className="w-3 h-3" />
                      <span>Protected & Insured</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              >
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            <div className="mb-6">
              <Tooltip content="Your total balance across all connected accounts">
                <p className="text-sm opacity-80 mb-2">Portfolio Value</p>
              </Tooltip>
              {isLoadingBalance ? (
                <Skeleton className="h-10 w-40 bg-white/20" />
              ) : balanceError ? (
                <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-200">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Connection Failed</h4>
                      <p className="text-sm opacity-90 mb-2">Unable to fetch balance. Check your connection.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefresh}
                        className="border-red-300 text-red-100 hover:bg-red-500/20"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-4xl font-bold">
                      {showBalance ? formatUSD(totalUSD) || '$0.00' : '••••••'}
                    </span>
                  </div>
                  {showBalance && totalUSD === 0 && (
                    <div className="text-center py-4">
                      <p className="text-white/80 mb-4">Your wallet is empty</p>
                      <Button 
                        onClick={handleAddFunds} 
                        className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors"
                      >
                        Add your first funds
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className="flex gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-4">
              <Button variant="ghost" size="sm" className="flex-1 text-white hover:bg-white/20" onClick={copyAddress}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">Copy</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-white hover:bg-white/20">
                <Share className="w-4 h-4" />
                <span className="ml-2">Share</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-white hover:bg-white/20">
                <History className="w-4 h-4" />
                <span className="ml-2">History</span>
              </Button>
            </div>

            {/* Wallet Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <div className="text-xs opacity-70 mb-2 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Wallet Address
                </div>
                <div className="font-mono text-sm">
                  {truncateAddress(activeAccount.address)}
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <div className="text-xs opacity-70 mb-2 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Network
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Lisk Mainnet</span>
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span>Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Actions - Improved Hierarchy */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-4 gap-3 mb-6"
          aria-label="Main actions"
        >
          {/* Primary Action - Send Money (spans 2 columns) */}
          <Button
            className="col-span-2 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 flex-col"
            onClick={handleSendMoney}
            aria-label="Send money"
          >
            <Send className="w-6 h-6 mb-2" />
            <span className="font-semibold">Send Money</span>
          </Button>

          {/* Secondary Actions */}
          <Button
            variant="outline"
            className="h-20 flex-col"
            onClick={handleReceive}
            aria-label="Receive money"
          >
            <Download className="w-5 h-5 mb-2" />
            <span className="text-sm">Receive</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex-col"
            onClick={handleAddFunds}
            aria-label="Add funds"
          >
            <ArrowDownLeft className="w-5 h-5 mb-2" />
            <span className="text-sm">Add Funds</span>
          </Button>
        </motion.section>

        {/* Tab Navigation */}
        <nav className="flex bg-gray-100 p-1 rounded-xl mb-6" role="tablist">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'accounts', label: 'Accounts', icon: Users },
            { id: 'activity', label: 'Activity', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              role="tabpanel"
              id="overview-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">No recent transactions</p>
                  <p className="text-sm">Your transaction history will appear here</p>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'accounts' && (
            <motion.div
              key="accounts"
              role="tabpanel"
              id="accounts-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Connected Accounts</h3>
                    <p className="text-sm text-gray-600">{userProfiles?.length || 0} profiles linked</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Add Account</span>
                  </Button>
                </div>

                {isLoadingProfiles ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : profilesError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900">Unable to load accounts</h4>
                        <p className="text-sm text-red-700">Please check your connection and try again</p>
                      </div>
                    </div>
                  </div>
                ) : userProfiles && userProfiles.length > 0 ? (
                  <div className="space-y-3">
                    {userProfiles.map((profile: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold">
                            {(profile.email || profile.phoneNumber || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {profile.email || profile.phoneNumber || 'Connected Account'}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {profile.type || 'social'} account
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No connected accounts</h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Link your social accounts, email, or phone number for enhanced security and easier access.
                    </p>
                    <Button>
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
              role="tabpanel"
              id="activity-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Transaction History</h3>
                <div className="text-center py-12 text-gray-500">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h4 className="text-lg font-semibold mb-2">No transactions yet</h4>
                  <p className="text-sm max-w-md mx-auto">Once you start sending or receiving money, your transaction history will appear here</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}