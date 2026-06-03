import { useEffect, useRef } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

interface VirtualTourViewerProps {
  imageUrl: string;
  title?: string;
  onClose: () => void;
}

const VirtualTourViewer = ({ imageUrl, title, onClose }: VirtualTourViewerProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col bg-black"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-black/80 backdrop-blur-sm border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌐</span>
          <div>
            <h3 className="text-white font-bold text-sm">{title || "360° Virtual Tour"}</h3>
            <p className="text-white/50 text-xs">মাউস বা আঙুল দিয়ে ঘুরিয়ে দেখুন</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all font-bold text-lg"
          title="বন্ধ করুন"
        >
          ✕
        </button>
      </div>

      {/* Photo Sphere Viewer */}
      <div className="flex-1 w-full overflow-hidden">
        <ReactPhotoSphereViewer
          src={imageUrl}
          height="100%"
          width="100%"
          defaultZoomLvl={0}
          navbar={["zoom", "fullscreen"]}
          loadingImg=""
          touchmoveTwoFingers={false}
          mousewheelCtrlKey={false}
          container=""
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center py-2 bg-black/70 border-t border-white/10 shrink-0">
        <p className="text-white/40 text-xs">
          🖱️ Click & drag to look around &nbsp;|&nbsp; 🔍 Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default VirtualTourViewer;
