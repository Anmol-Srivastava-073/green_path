import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Button } from "./ui/button";
import { WasteMap } from "../components/WasteMap";
import { createClient } from "../utils/supabase/client";

interface WastePost {
  id: string;
  item_name: string;
  bin_type: string;
  latitude: number;
  longitude: number;
}

export function MapView() {
  const [wastePosts, setWastePosts] = useState<WastePost[]>([]);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadWastePosts();
  }, []);

  /* ===============================
     LOAD FROM SUPABASE (CORRECT)
     =============================== */
  const loadWastePosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("waste_posts")
        .select("id, item_name, bin_type, latitude, longitude");

      if (error) throw error;

      setWastePosts(data || []);
      toast.success("Waste locations loaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load waste locations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-[#342E37] mb-2">
            Waste Location Map
          </h2>
          <p className="text-[#342E37]/60">
            View all reported waste locations across India
          </p>
        </div>

        <Button
          onClick={loadWastePosts}
          variant="outline"
          size="sm"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      {/* REAL MAP (LEAFLET) */}
      <motion.div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="h-[500px] w-full">
          <WasteMap wastePosts={wastePosts} />
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-12 h-12 border-4 border-[#3C91E6] border-t-transparent rounded-full"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
