import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Sparkles,
  CheckCircle,
  XCircle,
  Info,
  Zap,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function Scanner() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{
    recyclable: boolean;
    itemName: string;
    binType: string;
    tips: string[];
  } | null>(null);

  /* ===============================
     IMAGE UPLOAD
     =============================== */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  /* ===============================
     GEMINI ANALYSIS (FINAL)
     =============================== */
  const analyzeImage = async () => {
    if (!selectedImage) return;

    setScanning(true);

    try {
      const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/analyze-waste`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // ✅ VALID JWT
      "Authorization": `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({
      imageData: selectedImage,
    }),
  }
);


      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Gemini analysis failed");
      }

      setResult(data.result);
      toast.success("AI analysis complete!");
    } catch (err: any) {
      console.error("[SCANNER ERROR]", err);
      toast.error("Failed to analyze image");
    } finally {
      setScanning(false);
    }
  };

  /* ===============================
     UI
     =============================== */
  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3C91E6] to-[#A2D729]">
          AI Recycling Scanner
        </h2>
        <p className="text-gray-600">
          Upload an image to identify waste and disposal instructions
        </p>
      </motion.div>

      {/* INFO */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#3C91E6]" />
          <div>
            <p className="font-semibold flex items-center gap-2">
              Powered by Google Gemini <Zap className="w-4 h-4 text-green-500" />
            </p>
            <p className="text-sm text-gray-600">
              Uses AI trained on Indian waste-segregation rules
            </p>
          </div>
        </div>
      </div>

      {/* UPLOAD / PREVIEW */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <AnimatePresence mode="wait">
          {!selectedImage ? (
            <motion.label
              key="upload"
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-14 cursor-pointer hover:bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Camera className="w-16 h-16 text-gray-400 mb-4" />
              <span className="font-semibold">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </motion.label>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <img
                src={selectedImage}
                className="w-full h-80 object-cover rounded-xl"
              />

              {!result && !scanning && (
                <button
                  onClick={analyzeImage}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold"
                >
                  Analyze with AI
                </button>
              )}

              {scanning && (
                <div className="text-center text-gray-600">
                  Analyzing with Gemini AI...
                </div>
              )}

              {result && (
                <motion.div
                  className={`p-6 rounded-xl border ${
                    result.recyclable
                      ? "bg-green-50 border-green-400"
                      : "bg-red-50 border-red-400"
                  }`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {result.recyclable ? (
                      <CheckCircle className="text-green-600 w-8 h-8" />
                    ) : (
                      <XCircle className="text-red-600 w-8 h-8" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold">
                        {result.recyclable
                          ? "Recyclable"
                          : "Not Recyclable"}
                      </h3>
                      <p>{result.itemName}</p>
                    </div>
                  </div>

                  <p className="mb-2">
                    <strong>Bin:</strong> {result.binType}
                  </p>

                  <div>
                    <strong>Tips:</strong>
                    <ul className="list-disc pl-5 mt-2">
                      {result.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
