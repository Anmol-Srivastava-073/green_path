import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, Plus, MapPin, Phone, Mail, Users, Package,
  TrendingUp, Star, Award, Edit, Trash2
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';

interface Organization {
  id: string;
  name: string;
  area: string;
  phone: string;
  email: string;
  assignedRequests: number;
  completedRequests: number;
  rating: number;
  specialization: string[];
}

export function OrganizationManager() {
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Delhi Municipal Corporation',
      area: 'Delhi NCR',
      phone: '+91-11-2345-6789',
      email: 'contact@dmc.gov.in',
      assignedRequests: 45,
      completedRequests: 38,
      rating: 4.5,
      specialization: ['batteries', 'electronics', 'hazardous'],
    },
    {
      id: '2',
      name: 'Clean India Recycling',
      area: 'Mumbai',
      phone: '+91-22-3456-7890',
      email: 'info@cleanindia.com',
      assignedRequests: 32,
      completedRequests: 30,
      rating: 4.8,
      specialization: ['plastic', 'glass', 'paper'],
    },
    {
      id: '3',
      name: 'Green Earth NGO',
      area: 'Bangalore',
      phone: '+91-80-4567-8901',
      email: 'contact@greenearth.org',
      assignedRequests: 28,
      completedRequests: 25,
      rating: 4.6,
      specialization: ['organic', 'paper', 'plastic'],
    },
    {
      id: '4',
      name: 'Waste Warriors',
      area: 'Pune',
      phone: '+91-20-5678-9012',
      email: 'hello@wastewarriors.org',
      assignedRequests: 19,
      completedRequests: 18,
      rating: 4.9,
      specialization: ['batteries', 'electronics', 'metal'],
    },
    {
      id: '5',
      name: 'EcoSolutions Pvt Ltd',
      area: 'Chennai',
      phone: '+91-44-6789-0123',
      email: 'support@ecosolutions.in',
      assignedRequests: 36,
      completedRequests: 32,
      rating: 4.4,
      specialization: ['hazardous', 'oil', 'chemicals'],
    },
    {
      id: '6',
      name: 'Swachh Bharat Initiative',
      area: 'Hyderabad',
      phone: '+91-40-7890-1234',
      email: 'info@swachhbharat.gov.in',
      assignedRequests: 41,
      completedRequests: 35,
      rating: 4.7,
      specialization: ['plastic', 'metal', 'glass'],
    },
  ]);

  const getSpecializationColor = (type: string) => {
    const colors: Record<string, string> = {
      batteries: 'bg-yellow-100 text-yellow-700',
      plastic: 'bg-blue-100 text-blue-700',
      electronics: 'bg-purple-100 text-purple-700',
      oil: 'bg-orange-100 text-orange-700',
      metal: 'bg-gray-100 text-gray-700',
      glass: 'bg-green-100 text-green-700',
      paper: 'bg-indigo-100 text-indigo-700',
      organic: 'bg-lime-100 text-lime-700',
      hazardous: 'bg-red-100 text-red-700',
      chemicals: 'bg-pink-100 text-pink-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-[#342E37] mb-2">
            Partner Organizations
          </h2>
          <p className="text-[#342E37]/60">
            Manage and monitor waste collection organizations
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Organization
        </Button>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Organizations', value: organizations.length, icon: Building2, color: 'from-blue-500 to-cyan-500' },
          { label: 'Active Assignments', value: organizations.reduce((acc, org) => acc + org.assignedRequests, 0), icon: Package, color: 'from-purple-500 to-pink-500' },
          { label: 'Completed Tasks', value: organizations.reduce((acc, org) => acc + org.completedRequests, 0), icon: Award, color: 'from-green-500 to-emerald-500' },
          { label: 'Avg Rating', value: (organizations.reduce((acc, org) => acc + org.rating, 0) / organizations.length).toFixed(1), icon: Star, color: 'from-yellow-500 to-orange-500' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-[#342E37]/10"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-[#342E37] mb-1">{stat.value}</h3>
              <p className="text-sm text-[#342E37]/60">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {organizations.map((org, index) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg border border-[#342E37]/10 overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3C91E6] to-[#A2D729] p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{org.name}</h3>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {org.area}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="font-semibold">{org.rating}</span>
                </div>
              </div>

              {/* Performance */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{org.completedRequests}/{org.assignedRequests}</div>
                  <div className="text-xs text-white/80">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.floor((org.completedRequests / org.assignedRequests) * 100)}%</div>
                  <div className="text-xs text-white/80">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#342E37]/70">
                  <Phone className="w-4 h-4" />
                  {org.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#342E37]/70">
                  <Mail className="w-4 h-4" />
                  {org.email}
                </div>
              </div>

              {/* Specialization */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-[#342E37] mb-2">Specialization</h4>
                <div className="flex flex-wrap gap-2">
                  {org.specialization.map((type) => (
                    <span
                      key={type}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getSpecializationColor(type)}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-[#342E37]/10">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-xl"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6" />
          Top Performing Organizations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {organizations
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
            .map((org, index) => (
              <div key={org.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl font-bold text-white/60">#{index + 1}</div>
                  <div className="flex-1">
                    <div className="font-bold">{org.name}</div>
                    <div className="text-xs text-white/80">{org.area}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                    <span className="font-bold">{org.rating}</span>
                  </div>
                </div>
                <div className="text-sm text-white/90">
                  {org.completedRequests} completed • {Math.floor((org.completedRequests / org.assignedRequests) * 100)}% success
                </div>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
