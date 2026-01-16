import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, CheckCircle, XCircle, Zap, RefreshCw, Upload, ScanLine, Trash2, AlertTriangle } from "lucide-react";
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -------------------------
       IMAGE UPLOAD HANDLER
  --------------------------*/
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size to 5MB (Gemini limit/Edge function limit safety)
    if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // FileReader result includes 'data:image/jpeg;base64,...' which Gemini needs
      setSelectedImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const resetScanner = () => {
      setSelectedImage(null);
      setResult(null);
      setScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* -------------------------
       GEMINI AI ANALYSIS
  --------------------------*/
  const analyzeImage = async () => {
    if (!selectedImage) return;
    setScanning(true);

    try {
      // Calling the Supabase Edge Function where Gemini logic resides
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/analyze-waste`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": publicAnonKey,
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            imageData: selectedImage, // Sending base64 string
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Gemini AI could not identify this item.");
      }

      setResult(data.result);
      toast.success("Analysis complete! Gemini identified the item.");
    } catch (err: any) {
      console.error("Scanner error:", err);
      toast.error(err.message || "Failed to analyze image. Try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 pt-6"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-[#3C91E6] to-[#A2D729] mb-4 shadow-lg shadow-blue-500/20">
            <ScanLine className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
          Gemini AI Waste Scanner
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Photo upload karo aur Gemini AI batayega ki kachra recyclable hai ya nahi aur kaunse bin mein daalna hai.
        </p>
      </motion.div>

      {/* Main Interface Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px]">
        <AnimatePresence mode="wait">
          {!selectedImage ? (
            /* STATE 1: UPLOAD SCREEN */
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 h-full flex flex-col items-center justify-center text-center"
            >
                <div 
                    className="mb-8 relative group cursor-pointer" 
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-green-100 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative w-48 h-48 mx-auto bg-gray-50 border-4 border-dashed border-gray-200 rounded-full flex items-center justify-center group-hover:border-[#3C91E6] group-hover:bg-blue-50 transition-all duration-300">
                        <Camera className="w-16 h-16 text-gray-400 group-hover:text-[#3C91E6] transition-colors" />
                    </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload or Take a Photo</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    JPG or PNG formats supported. Photo saaf aur clear honi chahiye.
                </p>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 hover:shadow-lg transition-all transform hover:-translate-y-1"
                >
                    <Upload className="w-5 h-5" />
                    Select Image
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </motion.div>
          ) : (
            /* STATE 2: PREVIEW & RESULTS SPLIT VIEW */
            <motion.div 
                key="preview" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col md:flex-row h-full min-h-[600px]"
            >
                {/* Left Side: Image Preview */}
                <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative">
                    <div className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden shadow-md bg-white">
                        <img src={selectedImage} alt="Upload" className="w-full h-full object-cover" />
                        
                        {/* Scanning Animation Overlay */}
                        {scanning && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                                <div className="text-center text-white">
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mb-4 mx-auto"
                                    />
                                    <div className="flex items-center gap-2 justify-center">
                                        <Sparkles className="w-5 h-5 animate-pulse text-yellow-300" />
                                        <p className="font-medium text-lg">Gemini Analyzing...</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={resetScanner}
                        className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm"
                        disabled={scanning}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Scan Another Item
                    </button>
                </div>

                {/* Right Side: Action or Results */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white">
                    {!result ? (
                        // Pre-Scan State
                        <div className="text-center space-y-6">
                            <div className="inline-flex p-4 rounded-full bg-blue-50 text-[#3C91E6] mb-2">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Analyze</h3>
                                <p className="text-gray-500">
                                    Click the button below to let Gemini identify the waste type and disposal method.
                                </p>
                            </div>
                            <button
                                onClick={analyzeImage}
                                disabled={scanning}
                                className="w-full bg-gradient-to-r from-[#3C91E6] to-[#A2D729] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {scanning ? (
                                    "Processing..."
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" /> Identify with Gemini
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        // Post-Scan Results State
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Status Header */}
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`p-6 rounded-2xl border-2 ${
                                    result.recyclable 
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-red-50 border-red-200 text-red-800"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full shadow-sm ${result.recyclable ? "bg-green-100" : "bg-red-100"}`}>
                                        {result.recyclable ? <CheckCircle className="w-8 h-8 text-green-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold capitalize">{result.itemName}</h3>
                                        <p className="font-medium opacity-90 flex items-center gap-1.5 mt-1">
                                            {result.recyclable ? "✅ Recyclable Material" : "❌ Non-Recyclable Waste"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Recommended Bin</p>
                                    <div className="flex items-center gap-2">
                                        <Trash2 className="w-5 h-5 text-[#3C91E6]" />
                                        <span className="font-bold text-gray-900 text-lg">{result.binType}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">AI Confidence</p>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-yellow-500" />
                                        <span className="font-bold text-gray-900 text-lg">High</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-500" /> Disposal Tips
                                </h4>
                                <ul className="space-y-2">
                                    {result.tips.map((tip, idx) => (
                                        <motion.li 
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-start gap-3 text-gray-700 text-sm bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                                        >
                                            <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-[#3C91E6]" />
                                            {tip}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
