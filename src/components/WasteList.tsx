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

export function WasteList() {
  const [wastePosts, setWastePosts] = useState<WastePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadCurrentUser();
    loadWastePosts();
  }, []);

  const loadCurrentUser = async () => {
    const { data } = await supabase.auth.getSession();
    setCurrentUserId(data.session?.user?.id || null);
  };

  /* ===============================
     LOAD WASTE POSTS (CORRECT)
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
    } catch (err: any) {
      console.error("[WASTE LIST] Load error:", err);
      toast.error("Failed to load waste posts");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DELETE WASTE POST (CORRECT)
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
    } catch (err: any) {
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
     RENDER
     =============================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
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
      <h2 className="text-3xl font-bold">Waste Hotspots</h2>

      {wastePosts.map((item) => (
        <motion.div
          key={item.id}
          className="bg-white rounded-2xl shadow-lg p-5 border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gray-100">
              {getIcon(item.type)}
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-lg">{item.title}</h4>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {item.userName}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getTimeAgo(item.createdAt)}
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {item.description}
                </p>
              )}
            </div>

            {currentUserId === item.userId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
