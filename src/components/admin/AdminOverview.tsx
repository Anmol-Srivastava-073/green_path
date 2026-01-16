import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, AlertTriangle, CheckCircle2, Clock, MapPin, 
  Users, Package, Activity, ArrowUp, ArrowDown 
} from 'lucide-react';

interface AdminOverviewProps {
  onStatsUpdate: (stats: any) => void;
}

export function AdminOverview({ onStatsUpdate }: AdminOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 247,
    pending: 23,
    inProgress: 45,
    resolved: 179,
    activeUsers: 1234,
    organizationsAssigned: 8,
    avgResponseTime: '2.4 hrs',
    completionRate: 72,
  });

  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      // Mock data + local storage data
      const mockPosts = [
        {
          id: '1',
          type: 'plastic',
          title: 'Plastic Bottles Dump',
          location: 'Connaught Place, New Delhi',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          status: 'pending'
        },
        {
          id: '2',
          type: 'organic',
          title: 'Vegetable Waste',
          location: 'Indiranagar, Bangalore',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending'
        },
        {
          id: '3',
          type: 'electronics',
          title: 'Old Monitors & Cables',
          location: 'Hitech City, Hyderabad',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          status: 'resolved'
        },
        {
          id: '4',
          type: 'metal',
          title: 'Construction Scraps',
          location: 'Andheri West, Mumbai',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          status: 'in_progress'
        },
        {
          id: '5',
          type: 'batteries',
          title: 'Used Car Batteries',
          location: 'Chennai Central',
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          status: 'pending'
        }
      ];

      const localPostsStr = localStorage.getItem('greenpath_local_posts');
      const localPosts = localPostsStr ? JSON.parse(localPostsStr) : [];
      
      const allPosts = [...localPosts, ...mockPosts];
      
      // Calculate real stats
      const totalRequests = allPosts.length;
      const pending = allPosts.filter(p => p.status === 'pending').length;
      const inProgress = allPosts.filter(p => p.status === 'in_progress').length;
      const resolved = allPosts.filter(p => p.status === 'resolved').length;
      
      const newStats = {
        totalRequests,
        pending,
        inProgress,
        resolved,
        activeUsers: 1234 + localPosts.length,
        organizationsAssigned: 8,
        avgResponseTime: '2.4 hrs',
        completionRate: Math.floor((resolved / totalRequests) * 100) || 0,
      };
      
      setStats(newStats);
      onStatsUpdate({ totalRequests, pending, inProgress, resolved });
      setRecentRequests(allPosts.slice(0, 5));

    } catch (error) {
      console.error('[ADMIN] Error loading overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Pending Requests',
      value: stats.pending,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      change: '+12%',
      changeType: 'up' as const,
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Activity,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+8%',
      changeType: 'up' as const,
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '+24%',
      changeType: 'up' as const,
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      change: '+15%',
      changeType: 'up' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-[#342E37] mb-2">
          Admin Dashboard Overview
        </h2>
        <p className="text-[#342E37]/60">
          Monitor and manage all waste collection requests across India
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`${stat.bgColor} rounded-2xl p-6 shadow-lg border-2 border-white cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.changeType === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span className="font-semibold">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#342E37] mb-1">{stat.value.toLocaleString()}</h3>
              <p className={`text-sm ${stat.textColor} font-medium`}>{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-[#342E37]/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#342E37]">Completion Rate</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-4xl font-bold text-[#342E37]">{stats.completionRate}%</span>
              </div>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#3C91E6] to-[#A2D729]"
              />
            </div>
            <p className="text-sm text-[#342E37]/60">
              {stats.resolved} of {stats.totalRequests} requests successfully resolved
            </p>
          </div>
        </motion.div>

        {/* Response Time */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Avg Response Time</h3>
            <Clock className="w-5 h-5 opacity-80" />
          </div>
          <div className="mb-4">
            <div className="text-5xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-white/80 text-sm mt-1">Average time to assign organization</p>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white/20 rounded-lg px-3 py-2">
            <ArrowDown className="w-4 h-4" />
            <span>15% faster than last month</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-xl border border-[#342E37]/10 overflow-hidden"
      >
        <div className="p-6 border-b border-[#342E37]/10">
          <h3 className="text-xl font-bold text-[#342E37] flex items-center gap-2">
            <Package className="w-5 h-5" />
            Recent Waste Requests
          </h3>
        </div>
        <div className="divide-y divide-[#342E37]/5">
          {loading ? (
            <div className="p-8 text-center text-[#342E37]/60">Loading requests...</div>
          ) : recentRequests.length === 0 ? (
            <div className="p-8 text-center text-[#342E37]/60">No requests yet</div>
          ) : (
            recentRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3C91E6] to-[#A2D729] flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#342E37]">{request.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-[#342E37]/60 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {request.location}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {request.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'resolved' 
                        ? 'bg-green-100 text-green-700' 
                        : request.status === 'in_progress' 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {request.status === 'resolved' ? 'Resolved' : request.status === 'in_progress' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Organizations Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white p-6 rounded-2xl shadow-xl"
      >
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Partner Organizations
        </h3>
        <p className="text-white/90 text-sm mb-4">
          Currently working with {stats.organizationsAssigned} certified waste management organizations across India
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Municipal Corp', count: 45 },
            { name: 'NGOs', count: 23 },
            { name: 'Recycling Centers', count: 67 },
            { name: 'Private Collectors', count: 112 },
          ].map((org) => (
            <div key={org.name} className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">{org.count}</div>
              <div className="text-xs text-white/80">{org.name}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
