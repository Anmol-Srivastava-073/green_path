import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo, useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Button } from "./ui/button";
import { createClient } from "../utils/supabase/client";

/* ===============================
   FIX LEAFLET ICON PATHS
   =============================== */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===============================
   TYPES
   =============================== */
interface WastePost {
  id: string;
  item_name: string;
  bin_type: string;
  latitude: number;
  longitude: number;
  user_id: string;
}

interface WasteMapProps {
  wastePosts: WastePost[];
}

/* ===============================
   COMPONENT
   =============================== */
export function WasteMap({ wastePosts }: WasteMapProps) {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  /* -------------------------------
     LOAD CURRENT USER
     ------------------------------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data.session?.user?.id || null);
    });
  }, []);

  /* -------------------------------
     DELETE WASTE POST
     ------------------------------- */
  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("waste_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast.success("Waste post deleted");

      // notify parent/list/map to refresh
      window.dispatchEvent(new CustomEvent("wastePostAdded"));
    } catch (err) {
      console.error("[WASTE MAP] Delete error:", err);
      toast.error("Failed to delete waste post");
    }
  };

  /* -------------------------------
     GROUP POSTS BY LOCATION
     ------------------------------- */
  const groupedLocations = useMemo(() => {
    const map: Record<
      string,
      { latitude: number; longitude: number; items: WastePost[] }
    > = {};

    wastePosts?.forEach((post) => {
      if (
        typeof post.latitude !== "number" ||
        typeof post.longitude !== "number"
      )
        return;

      const key = `${post.latitude}_${post.longitude}`;

      if (!map[key]) {
        map[key] = {
          latitude: post.latitude,
          longitude: post.longitude,
          items: [],
        };
      }

      map[key].items.push(post);
    });

    return Object.values(map);
  }, [wastePosts]);

  /* ===============================
     RENDER
     =============================== */
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {groupedLocations.map((group, index) => (
          <Marker
            key={index}
            position={[group.latitude, group.longitude]}
          >
            <Popup>
              <div style={{ minWidth: 220 }}>
                <strong>
                  Waste at this location ({group.items.length})
                </strong>

                <ul style={{ marginTop: 8 }}>
                  {group.items.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <span>
                        ♻️ {item.item_name} ({item.bin_type})
                      </span>

                      {currentUserId === item.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
