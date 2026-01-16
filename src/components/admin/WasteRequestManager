import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, MapPin, User, Calendar, Package, 
  Send, CheckCircle, XCircle, Clock, RefreshCw, Eye,
  Building2, Phone, Mail, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type RequestStatus = 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'rejected';

interface WasteRequest {
  id: string;
  type: string;
  title: string;
  location: string;
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
  userName?: string;
  userId?: string;
  createdAt: string;
  status?: RequestStatus;
  assignedOrg?: string;
}

const MOCK_REQUESTS: WasteRequest[] = [
  {
    id: '1',
    type: 'plastic',
    title: 'Plastic Bottles Dump',
    location: 'Connaught Place, New Delhi',
    userName: 'Rajesh K.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'pending'
  },
  {
    id: '2',
    type: 'organic',
    title: 'Vegetable Waste',
    location: 'Indiranagar, Bangalore',
    userName: 'Anita S.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending'
  },
  {
    id: '3',
    type: 'electronics',
    title: 'Old Monitors & Cables',
    location: 'Hitech City, Hyderabad',
    userName: 'Vikram R.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'resolved',
    assignedOrg: 'Clean India Recycling'
  },
  {
    id: '4',
    type: 'metal',
    title: 'Construction Scraps',
    location: 'Andheri West, Mumbai',
    userName: 'Suresh P.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'in-progress',
    assignedOrg: 'EcoSolutions Pvt Ltd'
  },
  {
    id: '5',
    type: 'batteries',
    title: 'Used Car Batteries',
    location: 'Chennai Central',
    userName: 'Meera L.',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'pending'
  }
];

export function WasteRequestManager() {
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<WasteRequest | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    loadRequests();
    
    // Listen for new requests
    const handleNewRequest = () => {
      loadRequests();
    };
    window.addEventListener('wastePostAdded', handleNewRequest);
    return () => window.removeEventListener('wastePostAdded', handleNewRequest);
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      console.log('[ADMIN] Loading mock waste requests');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const localPostsStr = localStorage.getItem('greenpath_local_posts');
      const localPosts = localPostsStr ? JSON.parse(localPostsStr) : [];
      
      const allPosts = [...localPosts, ...MOCK_REQUESTS].map((post: any) => ({
        ...post,
        status: post.status || 'pending',
        assignedOrg: post.assignedOrg || null,
        userName: post.userName || 'Anonymous',
      }));

      setRequests(allPosts);
      toast.success(`Loaded ${allPosts.length} requests`);
    } catch (error: any) {
      console.error('[ADMIN] Error loading requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOrganization = (request: WasteRequest) => {
    setSelectedRequest(request);
    setShowAssignModal(true);
  };

  const assignToOrganization = (orgName: string) => {
    if (!selectedRequest) return;
    
    // Simulate assignment
    toast.success(`Assigned "${selectedRequest.title}" to ${orgName}`);
    setRequests(prev => prev.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'assigned', assignedOrg: orgName }
        : req
    ));
    setShowAssignModal(false);
    setSelectedRequest(null);
  };

  const updateStatus = (requestId: string, newStatus: RequestStatus) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
    toast.success('Status updated successfully');
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'assigned': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'in-progress': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
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
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const organizations = [
    { name: 'Delhi Municipal Corporation', area: 'Delhi NCR', phone: '+91-11-2345-6789' },
    { name: 'Clean India Recycling', area: 'Mumbai', phone: '+91-22-3456-7890' },
    { name: 'Green Earth NGO', area: 'Bangalore', phone: '+91-80-4567-8901' },
    { name: 'Waste Warriors', area: 'Pune', phone: '+91-20-5678-9012' },
    { name: 'EcoSolutions Pvt Ltd', area: 'Chennai', phone: '+91-44-6789-0123' },
    { name: 'Swachh Bharat Initiative', area: 'Hyderabad', phone: '+91-40-7890-1234' },
  ];

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
            Manage Waste Requests
          </h2>
          <p className="text-[#342E37]/60">
            Review, assign, and track waste collection requests
          </p>
        </div>
        <Button
          onClick={loadRequests}
          variant="outline"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-[#342E37]/10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#342E37]/40" />
            <Input
              type="text"
              placeholder="Search by title, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-[#FAFFFD] border-[#342E37]/10"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#342E37]/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
              className="w-full pl-11 pr-4 py-2 rounded-lg border border-[#342E37]/10 bg-[#FAFFFD] text-[#342E37] focus:outline-none focus:ring-2 focus:ring-[#3C91E6]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          {[
            { label: 'All', count: requests.length, color: 'text-gray-700' },
            { label: 'Pending', count: requests.filter(r => r.status === 'pending').length, color: 'text-yellow-700' },
            { label: 'Assigned', count: requests.filter(r => r.status === 'assigned').length, color: 'text-blue-700' },
            { label: 'In Progress', count: requests.filter(r => r.status === 'in-progress').length, color: 'text-purple-700' },
            { label: 'Resolved', count: requests.filter(r => r.status === 'resolved').length, color: 'text-green-700' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
              <div className="text-xs text-[#342E37]/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#3C91E6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#342E37]/60">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-[#342E37]/20 mx-auto mb-4" />
            <p className="text-[#342E37]/60">No requests found</p>
          </div>
        ) : (
          filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border border-[#342E37]/10 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Request Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3C91E6] to-[#A2D729] flex items-center justify-center flex-shrink-0">
                        <Package className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#342E37] mb-2">{request.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-[#342E37]/60">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {request.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {request.userName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(request.type)}`}>
                        {request.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status || 'pending')}`}>
                        {request.status || 'pending'}
                      </span>
                      {request.assignedOrg && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {request.assignedOrg}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {request.status === 'pending' && (
                      <Button
                        onClick={() => handleAssignOrganization(request)}
                        className="bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Assign
                      </Button>
                    )}
                    {request.status === 'assigned' && (
                      <Button
                        onClick={() => updateStatus(request.id, 'in-progress')}
                        className="bg-purple-600 text-white flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        In Progress
                      </Button>
                    )}
                    {request.status === 'in-progress' && (
                      <Button
                        onClick={() => updateStatus(request.id, 'resolved')}
                        className="bg-green-600 text-white flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Resolved
                      </Button>
                    )}
                    {request.status === 'pending' && (
                      <Button
                        onClick={() => updateStatus(request.id, 'rejected')}
                        variant="outline"
                        className="border-red-300 text-red-600 flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Assign Organization Modal */}
      <AnimatePresence>
        {showAssignModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
            >
              <div className="p-6 border-b border-[#342E37]/10">
                <h3 className="text-2xl font-bold text-[#342E37]">Assign to Organization</h3>
                <p className="text-[#342E37]/60 mt-1">
                  Select an organization to handle: "{selectedRequest.title}"
                </p>
              </div>
              
              <div className="p-6 space-y-3">
                {organizations.map((org) => (
                  <motion.button
                    key={org.name}
                    onClick={() => assignToOrganization(org.name)}
                    className="w-full p-4 rounded-xl border-2 border-[#342E37]/10 hover:border-[#3C91E6] hover:bg-blue-50 transition-all text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-[#342E37] mb-1">{org.name}</h4>
                        <div className="flex flex-col gap-1 text-sm text-[#342E37]/60">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {org.area}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {org.phone}
                          </span>
                        </div>
                      </div>
                      <Building2 className="w-8 h-8 text-[#3C91E6]" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="p-6 border-t border-[#342E37]/10">
                <Button
                  onClick={() => setShowAssignModal(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
