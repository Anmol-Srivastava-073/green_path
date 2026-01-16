import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ListChecks,
  Building2,
  BarChart3,
  Bell,
  Package,
} from 'lucide-react';

import { AdminOverview } from './admin/AdminOverview.tsx';
import { WasteRequestManager } from './admin/ManageRequests.tsx';
import { OrganizationManager } from './admin/OrganizationManager.tsx';
import { AdminAnalytics } from './admin/AdminAnalytics.tsx';

type View = 'overview' | 'requests' | 'organizations' | 'analytics';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  /* ===============================
     CLIENT-ONLY RESPONSIVE LOGIC
     =============================== */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isDesktop === null) {
    // Prevent SSR / hydration mismatch
    return null;
  }

  const navigation = [
    {
      id: 'overview' as View,
      label: 'Overview',
      icon: LayoutDashboard,
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'requests' as View,
      label: 'Manage Requests',
      icon: ListChecks,
      color: 'from-[#3C91E6] to-purple-600',
    },
    {
      id: 'organizations' as View,
      label: 'Organizations',
      icon: Building2,
      color: 'from-pink-600 to-orange-500',
    },
    {
      id: 'analytics' as View,
      label: 'Analytics',
      icon: BarChart3,
      color: 'from-[#A2D729] to-[#3C91E6]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 shadow-2xl">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">GreenPath Admin</h1>
                <p className="text-xs text-white/80 hidden sm:block">
                  Waste Management Control Center
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="hidden md:flex p-2.5 rounded-lg bg-white/10 text-white relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              </button>

              <div className="hidden md:flex items-center gap-3 bg-white/10 rounded-lg px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-white text-sm">
                  <p className="font-medium">
                    {user?.user_metadata?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-white/70">Administrator</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 text-white"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ================= SIDEBAR ================= */}
        <AnimatePresence>
          {(mobileMenuOpen || isDesktop) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`
                ${mobileMenuOpen ? 'block' : 'hidden'} md:block
                fixed md:sticky top-0 left-0 z-40
                w-72 bg-white shadow-2xl
                ${isDesktop ? 'h-[calc(100vh-64px)]' : 'h-screen pt-16'}
              `}
            >
              <nav className="p-4 space-y-1.5">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = currentView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium ${
                        active
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mx-4 mt-6 bg-gradient-to-br from-purple-600 to-pink-600 p-5 rounded-2xl text-white">
                <div className="flex justify-between mb-3">
                  <div>
                    <p className="text-xs opacity-80">Total Requests</p>
                    <p className="text-3xl font-bold">{stats.totalRequests}</p>
                  </div>
                  <Package className="w-10 h-10 opacity-30" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-xl font-bold">{stats.pending}</p>
                    Pending
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stats.inProgress}</p>
                    Active
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stats.resolved}</p>
                    Done
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ================= MAIN ================= */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 lg:px-6 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {currentView === 'overview' && (
                  <AdminOverview onStatsUpdate={setStats} />
                )}
                {currentView === 'requests' && <WasteRequestManager />}
                {currentView === 'organizations' && <OrganizationManager />}
                {currentView === 'analytics' && <AdminAnalytics />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
