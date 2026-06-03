import { Pannellum } from "pannellum-react";
import { View, X } from "lucide-react";
import { useState } from "react";

interface VirtualTourViewerProps {
  imageUrl: string;
  title?: string;
  onClose?: () => void;
}

const VirtualTourViewer = ({ imageUrl, title = "360° Virtual Tour", onClose }: VirtualTourViewerProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-6xl h-[80vh] bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-800 flex justify-between items-center text-white border-b border-slate-700/50">
          <h3 className="font-bold flex items-center gap-2">
            <View className="text-primary" size={20} />
            {title}
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* 360 Viewer */}
        <div className="flex-1 w-full h-full bg-black relative">
          <Pannellum
            width="100%"
            height="100%"
            image={imageUrl}
            pitch={10}
            yaw={180}
            hfov={110}
            autoLoad
            onLoad={() => {
              console.log("360 Image Loaded");
            }}
          >
            <Pannellum.Hotspot
              type="info"
              pitch={11}
              yaw={-167}
              text="Living Area"
            />
          </Pannellum>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white/80 text-xs px-4 py-2 rounded-full backdrop-blur-sm pointer-events-none font-bold">
            Drag to look around (360°)
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTourViewer;
