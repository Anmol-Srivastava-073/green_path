import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Battery,
  Package,
  Trash2,
  Droplet,
  MapPin,
  TrendingUp,
  Trash,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { supabase } from '../utils/supabase/client';

/* ===============================
   TYPES
   =============================== */
interface WastePost {
  id: string;
  type: string;
  title: string;
  location: string;
  description?: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
}

/* ===============================
   COMPONENT
   =============================== */
export function WasteList() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wastePosts, setWastePosts] = useState<WastePost[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  /* ===============================
     SSR SAFETY
     =============================== */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ===============================
     INIT
     =============================== */
  useEffect(() => {
    if (!mounted) return;

    fetchCurrentUser();
    fetchWastePosts();

    const refresh = () => fetchWastePosts();
    window.addEventListener('wastePostAdded', refresh);

    return () => {
      window.removeEventListener('wastePostAdded', refresh);
    };
  }, [mounted]);

  if (!mounted) return null;

  /* ===============================
     AUTH
     =============================== */
  const fetchCurrentUser = async () => {
    const { data } = await supabase.auth.getUser();
    setCurrentUserId(data.user?.id ?? null);
  };

  /* ===============================
     DATA FETCH
     =============================== */
  const fetchWastePosts = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('waste_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: WastePost[] = (data ?? []).map((row: any) => ({
        id: row.id,
        type: row.bin_type ?? 'other',
        title: row.item_name ?? 'Unknown Waste',
        location:
          row.latitude && row.longitude
            ? `${row.latitude}, ${row.longitude}`
            : 'Unknown location',
        description: row.tips?.join(', '),
        imageUrl: row.image_url,
        userId: row.user_id,
        createdAt: row.created_at,
      }));

      setWastePosts(mapped);
    } catch (err) {
      console.error('[WasteList] Fetch error:', err);
      toast.error('Failed to load waste posts');
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DELETE
     =============================== */
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('waste_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Waste post deleted');
      fetchWastePosts();
    } catch (err) {
      console.error('[WasteList] Delete error:', err);
      toast.error('Failed to delete post');
    }
  };

  /* ===============================
     UI HELPERS
     =============================== */
  const iconMap: Record<string, JSX.Element> = {
    batteries: <Battery className="w-5 h-5" />,
    plastic: <Package className="w-5 h-5" />,
    electronics: <Trash2 className="w-5 h-5" />,
    oil: <Droplet className="w-5 h-5" />,
    other: <MapPin className="w-5 h-5" />,
  };

  const colorMap: Record<string, string> = {
    batteries: 'bg-yellow-100 text-yellow-700',
    plastic: 'bg-blue-100 text-blue-700',
    electronics: 'bg-purple-100 text-purple-700',
    oil: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-700',
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hrs = Math.floor(diff / 36e5);
    if (hrs < 1) return 'Just now';
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)} days ago`;
  };

  /* ===============================
     HOTSPOTS
     =============================== */
  const hotspots = Object.values(
    wastePosts.reduce((acc, post) => {
      const area = post.location.split(',')[0];
      acc[area] ??= { area, items: [] as WastePost[] };
      acc[area].items.push(post);
      return acc;
    }, {} as Record<string, { area: string; items: WastePost[] }>)
  ).sort((a, b) => b.items.length - a.items.length);

  /* ===============================
     RENDER
     =============================== */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#3C91E6] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (wastePosts.length === 0) {
    return (
      <div className="text-center py-20">
        <MapPin className="w-20 h-20 mx-auto text-gray-300 mb-4" />
        <h3 className="text-2xl font-bold">No Waste Posts Yet</h3>
        <p className="text-gray-500">
          Add a waste location to start tracking hotspots.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Waste Hotspots</h2>

      {hotspots.map((hotspot) => (
        <div key={hotspot.area} className="bg-white rounded-2xl shadow">
          <div className="bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white p-5 rounded-t-2xl flex justify-between">
            <h3 className="font-bold">{hotspot.area}</h3>
            <span>{hotspot.items.length} items</span>
          </div>

          <div className="p-5 space-y-3">
            {hotspot.items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div
                  className={`p-3 rounded-xl ${
                    colorMap[item.type] ?? colorMap.other
                  }`}
                >
                  {iconMap[item.type] ?? iconMap.other}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <div className="text-sm text-gray-500">
                    {item.location} • {timeAgo(item.createdAt)}
                  </div>
                  {item.description && (
                    <p className="text-sm mt-1">{item.description}</p>
                  )}
                </div>

                {currentUserId === item.userId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
