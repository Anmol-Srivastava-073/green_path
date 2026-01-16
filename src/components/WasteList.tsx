import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Battery,
  Package,
  Trash2,
  Droplet,
  MapPin,
  User,
  Clock,
  TrendingUp,
  Trash,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Button } from "./ui/button";
import { createClient } from "../utils/supabase/client";

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
  userName: string;
  createdAt: string;
}

/* ===============================
   COMPONENT
   =============================== */
export function WasteList() {
  const [wastePosts, setWastePosts] = useState<WastePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadCurrentUser();
    loadWastePosts();

    // refresh list when a waste is added/deleted
    window.addEventListener("wastePostAdded", loadWastePosts);
    return () =>
      window.removeEventListener("wastePostAdded", loadWastePosts);
  }, []);

  /* ===============================
     AUTH
     =============================== */
  const loadCurrentUser = async () => {
    const { data } = await supabase.auth.getSession();
    setCurrentUserId(data.session?.user?.id || null);
  };

  /* ===============================
     LOAD POSTS
     =============================== */
  const loadWastePosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("waste_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped: WastePost[] = (data || []).map((row: any) => ({
        id: row.id,
        type: row.bin_type || "other",
        title: row.item_name || "Unknown Waste",
        location:
          row.latitude && row.longitude
            ? `${row.latitude}, ${row.longitude}`
            : "Unknown location",
        description: row.tips?.join(", "),
        imageUrl: row.image_url,
        userId: row.user_id,
        userName: "User",
        createdAt: row.created_at,
      }));

      setWastePosts(mapped);
    } catch (err) {
      console.error("[WASTE LIST] Load error:", err);
      toast.error("Failed to load waste posts");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DELETE POST
     =============================== */
  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("waste_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast.success("Waste post deleted");
      loadWastePosts();
    } catch (err) {
      console.error("[WASTE LIST] Delete error:", err);
      toast.error("Failed to delete post");
    }
  };

  /* ===============================
     UI HELPERS
     =============================== */
  const getIcon = (type: string) => {
    switch (type) {
      case "batteries":
        return <Battery className="w-5 h-5" />;
      case "plastic":
        return <Package className="w-5 h-5" />;
      case "electronics":
        return <Trash2 className="w-5 h-5" />;
      case "oil":
        return <Droplet className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "batteries":
        return "bg-yellow-100 text-yellow-700";
      case "plastic":
        return "bg-blue-100 text-blue-700";
      case "electronics":
        return "bg-purple-100 text-purple-700";
      case "oil":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffHrs = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    );

    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const days = Math.floor(diffHrs / 24);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  };

  /* ===============================
     HOTSPOT GROUPING
     =============================== */
  const hotspots = wastePosts.reduce((acc, item) => {
    const area = item.location.split(",")[0];
    if (!acc[area]) {
      acc[area] = { area, items: [] as WastePost[] };
    }
    acc[area].items.push(item);
    return acc;
  }, {} as Record<string, { area: string; items: WastePost[] }>);

  const hotspotList = Object.values(hotspots).sort(
    (a, b) => b.items.length - a.items.length
  );

  /* ===============================
     RENDER
     =============================== */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#3C91E6] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (wastePosts.length === 0) {
    return (
      <div className="text-center py-20">
        <MapPin className="w-20 h-20 mx-auto text-gray-300 mb-4" />
        <h3 className="text-2xl font-bold mb-2">No Waste Posts Yet</h3>
        <p className="text-gray-500">
          Add a waste location to start tracking hotspots.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold mb-1">Waste Hotspots</h2>
        <p className="text-gray-500">
          Areas with the highest reported waste concentration
        </p>
      </motion.div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow">
          <MapPin className="w-6 h-6 mb-2 text-[#3C91E6]" />
          <div className="text-3xl font-bold">{wastePosts.length}</div>
          <div className="text-sm text-gray-500">Total Pins</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow">
          <TrendingUp className="w-6 h-6 mb-2 text-green-600" />
          <div className="text-3xl font-bold">{hotspotList.length}</div>
          <div className="text-sm text-gray-500">Hotspots</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow">
          <Battery className="w-6 h-6 mb-2 text-orange-600" />
          <div className="text-3xl font-bold">
            {hotspotList[0]?.items.length || 0}
          </div>
          <div className="text-sm text-gray-500">Top Area Count</div>
        </div>
      </div>

      {/* HOTSPOTS */}
      {hotspotList.map((hotspot) => (
        <div key={hotspot.area} className="bg-white rounded-2xl shadow">
          <div className="bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white p-5 rounded-t-2xl flex justify-between">
            <h3 className="text-lg font-bold">{hotspot.area}</h3>
            <span>{hotspot.items.length} items</span>
          </div>

          <div className="p-5 space-y-3">
            {hotspot.items.map((item) => (
              <motion.div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`p-3 rounded-xl ${getColor(item.type)}`}>
                  {getIcon(item.type)}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <div className="text-sm text-gray-500 flex gap-4">
                    <span>{item.location}</span>
                    <span>{getTimeAgo(item.createdAt)}</span>
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
