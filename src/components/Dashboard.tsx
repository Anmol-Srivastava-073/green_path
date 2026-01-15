import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Camera, Plus, List, BarChart3, Menu, X, Sparkles, LogOut, Recycle, Bell, Settings, User } from 'lucide-react';
import { MapLoader } from './MapLoader';
import { Scanner } from './Scanner';
import { AddWaste } from './AddWaste';
import { WasteList } from './WasteList';
import { Analytics } from './Analytics';
import { Button } from './ui/button';
import { MapView } from "./MapView";


type View = 'map' | 'scanner' | 'add' | 'list' | 'analytics';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<View>('map');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = [
    { id: 'map' as View, label: 'Map View', icon: Map, color: 'from-[#3C91E6] to-[#5ba7f0]' },
    { id: 'scanner' as View, label: 'AI Scanner', icon: Camera, color: 'from-[#A2D729] to-[#b8e54a]' },
    { id: 'add' as View, label: 'Add Waste', icon: Plus, color: 'from-[#3C91E6] to-[#A2D729]' },
    { id: 'list' as View, label: 'Waste Hotspots', icon: List, color: 'from-[#6baaf0] to-[#3C91E6]' },
    { id: 'analytics' as View, label: 'Analytics', icon: BarChart3, color: 'from-[#A2D729] to-[#3C91E6]' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Professional Header with green to blue gradient */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-[#A2D729] via-[#6baaf0] to-[#3C91E6] shadow-xl"
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
                <Recycle className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-white">
                <h1 className="text-xl font-bold tracking-tight">GreenPath</h1>
                <p className="text-xs text-white/80 hidden sm:block">Smart Waste Management Dashboard</p>
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
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>

              {/* User Profile */}
              <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-white text-sm">
                  <p className="font-medium">{user?.user_metadata?.name || 'User'}</p>
                  <p className="text-xs text-white/70">Active</p>
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
        {/* Professional Sidebar Navigation */}
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
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</h3>
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
                          ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg shadow-' + (item.color.includes('3C91E6') ? 'blue' : 'green') + '-200'
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

              {/* Professional Stats Card */}
              <motion.div
                className="mx-4 mt-6 mb-4 bg-gradient-to-br from-[#3C91E6] to-[#A2D729] p-5 rounded-2xl text-white shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-90 mb-1">Community Impact</p>
                    <p className="text-3xl font-bold">247</p>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Recycle className="w-10 h-10 opacity-30" />
                  </motion.div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                  <div>
                    <p className="text-2xl font-bold">23</p>
                    <p className="text-xs opacity-80">Today</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs opacity-80">This Week</p>
                  </div>
                </div>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area with improved styling */}
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
{currentView === 'map' && <MapView />}
                {currentView === 'scanner' && <Scanner />}
                {currentView === 'add' && <AddWaste />}
                {currentView === 'list' && <WasteList />}
                {currentView === 'analytics' && <Analytics />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}