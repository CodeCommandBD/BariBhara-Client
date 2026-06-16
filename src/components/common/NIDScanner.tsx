import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { ScanFace, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface NIDScannerProps {
  onScanSuccess: (data: { name?: string; nid?: string }) => void;
}

const NIDScanner = ({ onScanSuccess }: NIDScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanProgress(0);
    setScanResult("idle");
    toast.info("NID স্ক্যান করা হচ্ছে, একটু অপেক্ষা করুন...");

    try {
      // Use Bengali and English language models
      const result = await Tesseract.recognize(file, "ben+eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setScanProgress(Math.floor(m.progress * 100));
          }
        },
      });

      const text = result.data.text;
      
      // Basic extraction logic for Bangladesh NID
      const extractedData: { name?: string; nid?: string } = {};

      // 1. Extract Name (Looking for 'Name:' or 'নাম:')
      const nameMatch = text.match(/(?:Name|নাম)[\s:]*([A-Za-z\s]+|[\u0980-\u09FF\s]+)/i);
      if (nameMatch && nameMatch[1]) {
        extractedData.name = nameMatch[1].trim().replace(/\n/g, "");
      }

      // 2. Extract NID Number (10, 13, or 17 digits)
      // Convert Bengali digits to English digits to ensure regex \d works
      const benDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
      const normalizedText = text.replace(/[০-৯]/g, (match) => String(benDigits.indexOf(match)));

      // NID numbers on cards might have spaces, hyphens or be misread
      const idKeywordRegex = /(?:NID|ID|NO|No\.|National ID|পরিচয়পত্র)[\s:-]*([\d\s-]{10,25})/i;
      const keywordMatch = normalizedText.match(idKeywordRegex);
      
      let foundNid = "";
      if (keywordMatch && keywordMatch[1]) {
         const cleanId = keywordMatch[1].replace(/\D/g, "");
         if ([10, 13, 17].includes(cleanId.length)) {
            foundNid = cleanId;
         }
      }

      // Fallback: Aggressively fix OCR character mix-ups and find longest digit sequence
      if (!foundNid) {
         // Replace O with 0, I/l with 1, S with 5, Z with 2, B with 8 ONLY IF they are adjacent to digits
         // To make it simple, we just strip spaces, replace those letters with digits, and look for 9-17 digits
         const ultraClean = normalizedText
            .replace(/[\s\-,_]/g, "")
            .replace(/O/g, "0")
            .replace(/o/g, "0")
            .replace(/I/g, "1")
            .replace(/l/g, "1");
            
         const matches = ultraClean.match(/\d{9,17}/g);
         if (matches && matches.length > 0) {
            const potentialNids = matches.filter(m => !(m.length === 11 && m.startsWith("01"))); // skip phone
            if (potentialNids.length > 0) {
                foundNid = potentialNids.sort((a, b) => b.length - a.length)[0];
            }
         }
      }

      if (foundNid) {
        extractedData.nid = foundNid;
      }

      if (extractedData.name || extractedData.nid) {
        setScanResult("success");
        onScanSuccess(extractedData);
        if (extractedData.nid) {
           toast.success(`NID স্ক্যান সফল হয়েছে! (NID: ${extractedData.nid})`);
        } else {
           toast.warning("নাম পাওয়া গেছে, কিন্তু NID নাম্বার অস্পষ্ট বিধায় পড়া যায়নি।");
        }
      } else {
        setScanResult("error");
        toast.error("NID থেকে কোনো তথ্য পাওয়া যায়নি। দয়া করে পরিষ্কার ছবি দিন।");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      setScanResult("error");
      toast.error("স্ক্যান করতে সমস্যা হয়েছে।");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-4 relative overflow-hidden transition-all hover:border-primary/50 group">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
      />
      
      {isScanning ? (
        <div className="flex flex-col items-center justify-center space-y-3 py-2">
          <Loader2 className="animate-spin text-primary" size={28} />
          <div className="w-full max-w-[200px] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out" 
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <p className="text-xs font-bold text-slate-500">AI বিশ্লেষণ করছে... {scanProgress}%</p>
        </div>
      ) : scanResult === "success" ? (
        <div className="flex flex-col items-center justify-center space-y-2 py-2">
          <CheckCircle2 className="text-emerald-500" size={28} />
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">অটো-ফিল সম্পন্ন হয়েছে!</p>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] text-slate-400 hover:text-primary underline mt-1"
          >
            আবার স্ক্যান করুন
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center space-y-2 cursor-pointer py-2"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <ScanFace className="text-primary" size={24} />
          </div>
          <p className="text-sm font-black text-slate-700 dark:text-slate-300">স্মার্ট NID স্ক্যান (OCR)</p>
          <p className="text-[10px] text-slate-500 max-w-[220px] text-center leading-relaxed">
            এনআইডি কার্ডের ছবি আপলোড করুন। সিস্টেম স্বয়ংক্রিয়ভাবে নাম ও আইডি নম্বর ফিলাপ করে দেবে।
          </p>
        </div>
      )}
    </div>
  );
};

export default NIDScanner;
