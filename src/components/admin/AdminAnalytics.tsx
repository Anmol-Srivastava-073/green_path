import { motion } from 'motion/react';
import { 
  TrendingUp, Package, MapPin, Calendar, BarChart3, PieChart, 
  Activity, Target, Zap
} from 'lucide-react';

export function AdminAnalytics() {
  const wasteTypeData = [
    { type: 'Plastic', count: 89, percentage: 36, color: 'bg-blue-500' },
    { type: 'Electronics', count: 52, percentage: 21, color: 'bg-purple-500' },
    { type: 'Batteries', count: 38, percentage: 15, color: 'bg-yellow-500' },
    { type: 'Metal', count: 31, percentage: 13, color: 'bg-gray-500' },
    { type: 'Glass', count: 23, percentage: 9, color: 'bg-green-500' },
    { type: 'Others', count: 14, percentage: 6, color: 'bg-orange-500' },
  ];

  const monthlyTrends = [
    { month: 'Jan', requests: 45, resolved: 38 },
    { month: 'Feb', requests: 52, resolved: 45 },
    { month: 'Mar', requests: 61, resolved: 52 },
    { month: 'Apr', requests: 58, resolved: 51 },
    { month: 'May', requests: 67, resolved: 59 },
    { month: 'Jun', requests: 74, resolved: 65 },
  ];

  const topLocations = [
    { city: 'Delhi NCR', requests: 89, growth: '+15%' },
    { city: 'Mumbai', requests: 67, growth: '+12%' },
    { city: 'Bangalore', requests: 54, growth: '+18%' },
    { city: 'Pune', requests: 43, growth: '+9%' },
    { city: 'Chennai', requests: 38, growth: '+7%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-[#342E37] mb-2">
          Analytics & Insights
        </h2>
        <p className="text-[#342E37]/60">
          Track trends, performance metrics, and platform insights
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Impact', value: '247', unit: 'Waste Items', icon: Target, color: 'from-[#3C91E6] to-blue-600', change: '+24%' },
          { label: 'Avg Response', value: '2.4', unit: 'Hours', icon: Zap, color: 'from-purple-600 to-pink-600', change: '-15%' },
          { label: 'Success Rate', value: '72', unit: '%', icon: TrendingUp, color: 'from-green-500 to-emerald-600', change: '+8%' },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-[#342E37]/10"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-4xl font-bold text-[#342E37] mb-1">
                    {metric.value}
                    <span className="text-lg text-[#342E37]/60 ml-1">{metric.unit}</span>
                  </div>
                  <div className="text-sm text-[#342E37]/60">{metric.label}</div>
                </div>
                <div className={`text-sm font-semibold ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Waste Type Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#342E37]/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#342E37] flex items-center gap-2">
            <PieChart className="w-6 h-6" />
            Waste Type Distribution
          </h3>
          <select className="px-4 py-2 rounded-lg border border-[#342E37]/10 bg-[#FAFFFD] text-sm">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
        </div>

        <div className="space-y-4">
          {wasteTypeData.map((item, index) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <span className="font-medium text-[#342E37]">{item.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#342E37]/60">{item.count} requests</span>
                  <span className="font-semibold text-[#342E37] w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.05, ease: "easeOut" }}
                  className={`h-full ${item.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-[#342E37]/10"
        >
          <h3 className="text-xl font-bold text-[#342E37] mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Monthly Trends
          </h3>

          <div className="space-y-6">
            {monthlyTrends.map((month, index) => {
              const maxValue = Math.max(...monthlyTrends.map(m => m.requests));
              const requestPercentage = (month.requests / maxValue) * 100;
              const resolvedPercentage = (month.resolved / maxValue) * 100;

              return (
                <div key={month.month}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#342E37]">{month.month}</span>
                    <div className="flex gap-4 text-xs text-[#342E37]/60">
                      <span>Requests: {month.requests}</span>
                      <span>Resolved: {month.resolved}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${requestPercentage}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                        className="h-full bg-[#3C91E6] rounded-full"
                      />
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${resolvedPercentage}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                        className="h-full bg-[#A2D729] rounded-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-[#342E37]/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#3C91E6]" />
              <span className="text-sm text-[#342E37]/60">Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#A2D729]" />
              <span className="text-sm text-[#342E37]/60">Resolved</span>
            </div>
          </div>
        </motion.div>

        {/* Top Locations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-[#342E37]/10"
        >
          <h3 className="text-xl font-bold text-[#342E37] mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Top Locations
          </h3>

          <div className="space-y-4">
            {topLocations.map((location, index) => (
              <motion.div
                key={location.city}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-[#342E37]/5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3C91E6] to-[#A2D729] flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-[#342E37]">{location.city}</div>
                    <div className="text-sm text-[#342E37]/60">{location.requests} requests</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">{location.growth}</div>
                  <div className="text-xs text-[#342E37]/60">growth</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white p-8 rounded-2xl shadow-xl"
      >
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold mb-1">36%</div>
            <div className="text-sm text-white/90">
              Plastic waste is the most reported category, requiring focused recycling initiatives
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold mb-1">+18%</div>
            <div className="text-sm text-white/90">
              Bangalore shows highest growth in user participation this quarter
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold mb-1">2.4h</div>
            <div className="text-sm text-white/90">
              Average response time improved by 15% with better organization assignment
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
