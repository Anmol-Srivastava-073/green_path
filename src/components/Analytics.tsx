import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingDown, Users, Fuel, Award, Sparkles, Leaf, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Analytics() {
  const [wastePosts, setWastePosts] = useState<any[]>([]);

  useEffect(() => {
    loadWastePosts();
  }, []);

  const loadWastePosts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/analyze-waste/waste-posts`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setWastePosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error loading waste posts:', error);
    }
  };

  // Calculate waste type distribution from real data
  const wasteTypeData = wastePosts.reduce((acc, post) => {
    const existing = acc.find((item: any) => item.name === post.type);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: post.type, value: 1 });
    }
    return acc;
  }, [] as any[]);

  const monthlyData = [
    { month: 'Jan', items: 65, fuel: 85 },
    { month: 'Feb', items: 78, fuel: 78 },
    { month: 'Mar', items: 92, fuel: 72 },
    { month: 'Apr', items: 105, fuel: 65 },
    { month: 'May', items: 124, fuel: 58 },
    { month: 'Jun', items: wastePosts.length || 145, fuel: 52 },
  ];

  const COLORS = ['#3C91E6', '#A2D729', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#3C91E6] to-[#A2D729]">
          Community Analytics
        </h2>
        <p className="text-gray-600">
          Track our environmental impact and efficiency gains
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          {
            icon: TrendingDown,
            value: '38%',
            label: 'Fuel Reduction',
            change: '↓ 12% from last month',
            color: 'from-[#A2D729] to-[#b8e54a]',
            bgColor: 'bg-[#A2D729]/10',
          },
          { 
            icon: Users, 
            value: '142', 
            label: 'Active Users', 
            change: '↑ 23 new this week',
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-100'
          },
          { 
            icon: Fuel, 
            value: '847', 
            label: 'Gallons Saved', 
            change: 'This quarter',
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-100'
          },
          { 
            icon: Award, 
            value: '2,547', 
            label: 'Items Recycled', 
            change: 'All time',
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-100'
          }
        ].map((metric, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative overflow-hidden group"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            {/* Animated background gradient */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              initial={{ scale: 0, rotate: 0 }}
              whileHover={{ scale: 1.5, rotate: 180 }}
              transition={{ duration: 0.6 }}
            />

            <motion.div
              className={`bg-gradient-to-br ${metric.color} p-3 rounded-xl w-fit mb-3 shadow-lg relative z-10`}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <metric.icon className="w-6 h-6 text-white" />
            </motion.div>
            
            <motion.div
              className="text-4xl font-bold text-gray-900 mb-1 relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
            >
              {metric.value}
            </motion.div>
            
            <div className="text-sm text-gray-600 mb-1 relative z-10">{metric.label}</div>
            <div className="text-xs text-green-600 mt-1 font-medium relative z-10">{metric.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Waste Type Distribution */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900">
              Waste Type Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {wasteTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Items by Month */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-yellow-500" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Activity
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="items" 
                fill="#10b981" 
                name="Items Recycled"
                animationBegin={0}
                animationDuration={1000}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Fuel Efficiency Trend */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <TrendingDown className="w-5 h-5 text-green-500" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900">
            Fuel Efficiency Improvement
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="fuel"
              stroke="#f97316"
              strokeWidth={3}
              name="Fuel Usage Index"
              animationBegin={0}
              animationDuration={1500}
              dot={{ r: 6, fill: "#f97316" }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-4">
          Lower fuel usage index means more efficient routes. Our smart routing has reduced fuel consumption by 38% since launch.
        </p>
      </motion.div>

      {/* Environmental Impact */}
      <motion.div
        className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-10 text-white relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 2px, transparent 2px)`,
            backgroundSize: '30px 30px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '30px 30px'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="flex items-center gap-3 mb-6 relative z-10"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Leaf className="w-10 h-10" />
          </motion.div>
          <h3 className="text-3xl font-bold">Environmental Impact</h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {[
            { value: '3.2 tons', label: 'CO₂ Emissions Prevented', delay: 0.9 },
            { value: '847 gal', label: 'Fuel Saved', delay: 1.0 },
            { value: '2,547', label: 'Items Properly Recycled', delay: 1.1 }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              whileHover={{ scale: 1.1, y: -10 }}
            >
              <motion.div
                className="text-5xl font-bold mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: stat.delay + 0.2, type: "spring", stiffness: 200 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-green-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Contributors */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ 
              rotate: [0, 20, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Award className="w-6 h-6 text-yellow-500" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900">
            Top Contributors This Month
          </h3>
        </div>
        
        <div className="space-y-3">
          {[
            { name: 'Saroj Mehta.', items: 23, badge: '🏆', color: 'from-yellow-400 to-yellow-600' },
            { name: 'Jatin Sharma.', items: 18, badge: '🥈', color: 'from-gray-300 to-gray-500' },
            { name: 'Maya Shah.', items: 15, badge: '🥉', color: 'from-orange-400 to-orange-600' },
            { name: 'Tanishk Rathi.', items: 12, badge: '⭐', color: 'from-blue-400 to-blue-600' },
            { name: 'Harpreet Kaur', items: 10, badge: '⭐', color: 'from-purple-400 to-purple-600' },
          ].map((user, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-100 group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + index * 0.1 }}
              whileHover={{ scale: 1.03, x: 10 }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className={`bg-gradient-to-br ${user.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg`}
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  {user.badge}
                </motion.div>
                <span className="font-semibold text-gray-900 text-lg">{user.name}</span>
              </div>
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg"
                whileHover={{ scale: 1.1 }}
              >
                {user.items} items
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}