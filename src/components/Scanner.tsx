import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, CheckCircle, XCircle, Zap } from "lucide-react";
import { toast } from "sonner";
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

  /* -------------------------
       IMAGE UPLOAD
  --------------------------*/
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

  /* -------------------------
       AI ANALYSIS
  --------------------------*/
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
            // ✔ REQUIRED FOR PUBLIC EDGE FUNCTIONS
            "apikey": publicAnonKey,
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            imageData: selectedImage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "AI analysis failed");
      }

      setResult(data.result);
      toast.success("AI analysis complete!");
    } catch (err) {
      console.error("Scanner error:", err);
      toast.error("Failed to analyze image");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3C91E6] to-[#A2D729]">
          AI Recycling Scanner
        </h2>
        <p className="text-gray-600">
          Upload an image to identify waste and disposal instructions.
        </p>
      </motion.div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#3C91E6]" />
          <div>
            <p className="font-semibold flex items-center gap-2">
              Powered by Google Gemini <Zap className="w-4 h-4 text-green-500" />
            </p>
            <p className="text-sm text-gray-600">
              Uses AI trained on Indian waste-segregation rules.
            </p>
          </div>
        </div>
      </div>

      {/* Upload / Preview */}
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
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <img src={selectedImage} className="w-full h-80 object-cover rounded-xl" />

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
                  {/* Result header */}
                  <div className="flex items-center gap-3 mb-3">
                    {result.recyclable ? (
                      <CheckCircle className="text-green-600 w-8 h-8" />
                    ) : (
                      <XCircle className="text-red-600 w-8 h-8" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold">
                        {result.recyclable ? "Recyclable" : "Not Recyclable"}
                      </h3>
                      <p>{result.itemName}</p>
                    </div>
                  </div>

                  {/* Bin info */}
                  <p className="mb-2">
                    <strong>Bin:</strong> {result.binType}
                  </p>

                  {/* Tips */}
                  <div>
                    <strong>Tips:</strong>
                    <ul className="list-disc pl-5 mt-2">
                      {(result.tips || []).map((t, i) => (
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
