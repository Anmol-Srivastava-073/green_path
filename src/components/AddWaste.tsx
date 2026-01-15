import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  Upload,
  Locate,
  MapPin,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { createClient } from "../utils/supabase/client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationPicker({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function AddWaste() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [coords, setCoords] =
    useState<{ lat: number; lng: number } | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  /* ===============================
     GPS AUTO DETECT (OPTIONAL)
     =============================== */
  const detectGPS = () => {
    if (!navigator.geolocation) {
      toast.error("GPS not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        toast.success("GPS location set");
      },
      () => toast.error("Unable to detect GPS")
    );
  };

  /* ===============================
     IMAGE
     =============================== */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ===============================
     SUBMIT
     =============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coords) {
      toast.error("Please select location on map or use GPS");
      return;
    }

    setLoading(true);

    try {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) throw new Error("Not logged in");

      const { error } = await supabase.from("waste_posts").insert({
        user_id: user.id,
        item_name: title,
        bin_type: type,
        tips: description ? [description] : [],
        latitude: coords.lat,
        longitude: coords.lng,
        image_url: image,
      });

      if (error) throw error;

      toast.success("Waste location added!");
      window.dispatchEvent(new CustomEvent("wastePostAdded"));
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setTitle("");
        setType("");
        setDescription("");
        setImage(null);
        setCoords(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add waste");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     SUCCESS
     =============================== */
  if (submitted) {
    return (
      <motion.div
        className="bg-white p-12 rounded-3xl shadow-xl text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold">Waste Added</h2>
        <p className="text-gray-600">
          Location successfully pinned on map
        </p>
      </motion.div>
    );
  }

  /* ===============================
     FORM
     =============================== */
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-3xl font-bold">Add Waste</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl space-y-5"
      >
        <input
          required
          placeholder="Waste title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
        />

        <input
          required
          placeholder="Waste type (plastic, battery, etc.)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
        />

        {/* MAP PICKER */}
        <div className="h-64 rounded-xl overflow-hidden border">
          <MapContainer
            center={coords ? [coords.lat, coords.lng] : [20.5937, 78.9629]}
            zoom={coords ? 14 : 5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker
              onSelect={(lat, lng) => {
                setCoords({ lat, lng });
                toast.success("Location selected");
              }}
            />
            {coords && (
              <Marker position={[coords.lat, coords.lng]} />
            )}
          </MapContainer>
        </div>

        <button
          type="button"
          onClick={detectGPS}
          className="flex items-center gap-2 text-blue-600 text-sm"
        >
          <Locate /> Use my current location
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-dashed border-2 py-5 rounded-xl"
        >
          <Upload className="mx-auto" />
          Upload image (optional)
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white py-4 rounded-xl font-semibold"
        >
          {loading ? "Adding..." : "Add to Map"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin />
          {coords
            ? `Selected: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
            : "Select location by clicking on map or GPS"}
        </div>
      </form>
    </div>
  );
}
