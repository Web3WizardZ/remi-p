'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { LoginButton } from 'panna-sdk';
import { AppSidebar } from './app-sidebar';

const themeStyle = {
  '--brand-primary': '262 83% 58%',
  '--brand-secondary': '286 84% 62%',
  '--brand-accent': '142 71% 45%',
  '--brand-blue': '217 91% 60%',
  '--brand-pink': '316 73% 58%'
} as React.CSSProperties;

// Global type declaration for Panna widget
declare global {
  interface Window {
    __openPannaWidget?: (view?: 'Deposit' | 'Send' | 'Receive') => void;
  }
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // reduced motion guard for heavy animations
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Register global widget opener for Panna integration (more deterministic)
  React.useEffect(() => {
    const selectTabSafely = (label?: 'Deposit' | 'Send' | 'Receive') => {
      if (!label) return;
      const attrMatch = document.querySelector<HTMLElement>(`[data-panna-tab="${label}"]`);
      if (attrMatch) return attrMatch.click();
      const root = document.querySelector('[data-panna-widget]') || document.body;
      const candidates = Array.from(root.querySelectorAll<HTMLElement>('button,[role="tab"]'));
      const wanted = label.toLowerCase();
      const match = candidates.find((el) => {
        const txt = (el.innerText || el.textContent || '').trim().toLowerCase();
        if (!txt) return false;
        return (
          txt === wanted ||
          (wanted === 'deposit' && /deposit|add funds|top ?up/.test(txt)) ||
          (wanted === 'send' && /send|transfer/.test(txt)) ||
          (wanted === 'receive' && /receive|request/.test(txt))
        );
      });
      match?.click();
    };

    window.__openPannaWidget = (view) => {
      const wrapper =
        document.getElementById('panna-widget-trigger') ||
        document.querySelector('[data-panna-login-wrapper]');

      const clickTarget = wrapper?.querySelector<HTMLElement>('button, [role="button"]');
      if (!clickTarget) {
        console.warn('Panna widget trigger not found');
        return;
      }
      clickTarget.click();
      if (view) setTimeout(() => selectTabSafely(view), 120);
    };

    return () => {
      delete window.__openPannaWidget;
    };
  }, []);

  // Close sidebar on ESC / route change
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    const handleRouteChange = () => setIsSidebarOpen(false);

    document.addEventListener('keydown', handleEscape);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Prevent body scroll on small screens only when sidebar is open
  React.useEffect(() => {
    const isSmall =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(max-width: 1024px)').matches;

    if (isSmall && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);

  const backgroundShapes = React.useMemo(
    () =>
      prefersReduced ? null : (
        <>
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl"
            animate={{ x: [0, 60, -20, 0], y: [0, 40, -10, 0], scale: [1, 1.1, 0.9, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl"
            animate={{ x: [0, -50, 30, 0], y: [0, -60, 20, 0], scale: [1, 0.8, 1.2, 1] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-full mix-blend-multiply filter blur-3xl"
            animate={{ x: [-30, 40, -30], y: [-20, 30, -20], rotate: [0, 180, 360] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ),
    [prefersReduced]
  );

  return (
    <div
      style={themeStyle}
      className="min-h-dvh w-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden"
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">{backgroundShapes}</div>

      {/* Floating Burger */}
      <motion.button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 p-3 sm:p-4 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/30 hover:bg-white/90 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8, x: -100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.2 }}
        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isSidebarOpen}
        aria-controls="app-sidebar"
      >
        <motion.div
          animate={{ rotate: isSidebarOpen ? 180 : 0, scale: isSidebarOpen ? 1.1 : 1 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
        >
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 hover:text-purple-600 transition-colors" />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 hover:text-purple-600 transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>

      {/* Hidden LoginButton for Panna widget integration */}
      <div id="panna-widget-trigger" data-panna-login-wrapper className="sr-only" tabIndex={-1} aria-hidden="true">
        <LoginButton {...({ tabIndex: -1 } as any)} />
      </div>

      {/* Sidebar (mobile): fixed and out of flow so it never pushes main content */}
      <div id="app-sidebar" className="fixed inset-y-0 left-0 z-40" aria-hidden={!isSidebarOpen} style={{ pointerEvents: isSidebarOpen ? 'auto' : 'none' }}>
        <AppSidebar isMobile={true} isMobileOpen={isSidebarOpen} onMobileClose={closeSidebar} />
      </div>

      {/* Main Content Container - Full width with centered content */}
      <div className="relative z-20 w-full min-h-dvh flex items-center justify-center">
        <motion.div
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            filter: isSidebarOpen ? 'blur(2px)' : 'blur(0px)', 
            scale: isSidebarOpen ? 0.98 : 1 
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.div>
      </div>

      {/* Sidebar backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSidebar} />
        )}
      </AnimatePresence>
    </div>
  );
}