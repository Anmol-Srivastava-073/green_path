import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, LogOut, Menu, X, LayoutDashboard, ListChecks, Building2, 
  BarChart3, Settings, Bell, User, TrendingUp, AlertTriangle, 
  CheckCircle2, Clock, Package
} from 'lucide-react';
import { Button } from './ui/button';
import { AdminOverview } from './admin/AdminOverview';
import { WasteRequestManager } from './admin/WasteRequestManager';
import { OrganizationManager } from './admin/OrganizationManager';
import { AdminAnalytics } from './admin/AdminAnalytics';

type View = 'overview' | 'requests' | 'organizations' | 'analytics';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = [
    { id: 'overview' as View, label: 'Overview', icon: LayoutDashboard, color: 'from-purple-600 to-pink-600' },
    { id: 'requests' as View, label: 'Manage Requests', icon: ListChecks, color: 'from-[#3C91E6] to-purple-600' },
    { id: 'organizations' as View, label: 'Organizations', icon: Building2, color: 'from-pink-600 to-orange-500' },
    { id: 'analytics' as View, label: 'Analytics', icon: BarChart3, color: 'from-[#A2D729] to-[#3C91E6]' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Admin Header with purple/pink gradient */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 shadow-2xl"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-white">
                <h1 className="text-xl font-bold tracking-tight">GreenPath Admin</h1>
                <p className="text-xs text-white/80 hidden sm:block">Waste Management Control Center</p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <motion.button
                className="hidden md:flex p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              </motion.button>

              {/* Admin Profile */}
              <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-white text-sm">
                  <p className="font-medium">{user?.user_metadata?.name || 'Admin'}</p>
                  <p className="text-xs text-white/70">Administrator</p>
                </div>
              </div>

              <motion.button
                onClick={onLogout}
                className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
              
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 hover:bg-white/10 rounded-lg text-white"
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Admin Sidebar Navigation */}
        <AnimatePresence>
          {(mobileMenuOpen || isDesktop) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`
                ${mobileMenuOpen ? 'block' : 'hidden'} md:block
                fixed md:sticky top-0 left-0 z-40
                w-72 bg-white shadow-2xl md:shadow-lg
                ${isDesktop ? 'h-[calc(100vh-64px)]' : 'h-screen pt-16'}
              `}
            >
              <nav className="p-4 space-y-1.5">
                <div className="px-3 py-2 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Menu</h3>
                </div>
                
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium
                        transition-all relative overflow-hidden
                        ${isActive
                          ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                      
                      {isActive && (
                        <motion.div
                          className="ml-auto"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Mobile Logout */}
              <div className="md:hidden absolute bottom-4 left-4 right-4">
                <motion.button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </div>

              {/* Quick Stats Card */}
              <motion.div
                className="mx-4 mt-6 mb-4 bg-gradient-to-br from-purple-600 to-pink-600 p-5 rounded-2xl text-white shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-90 mb-1">Total Requests</p>
                    <p className="text-3xl font-bold">{stats.totalRequests}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Package className="w-10 h-10 opacity-30" />
                  </motion.div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20">
                  <div>
                    <p className="text-xl font-bold">{stats.pending}</p>
                    <p className="text-xs opacity-80">Pending</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stats.inProgress}</p>
                    <p className="text-xs opacity-80">Active</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stats.resolved}</p>
                    <p className="text-xs opacity-80">Done</p>
                  </div>
                </div>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 lg:px-6 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                {currentView === 'overview' && <AdminOverview onStatsUpdate={setStats} />}
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
