import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(
    localStorage.getItem("pwaPromptDismissed") === "true"
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("pwaPromptDismissed", "true");
  };

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[100] animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl shrink-0">
          <img src="/icon-192.png" alt="App Icon" className="w-8 h-8 rounded-lg" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-on-surface">অ্যাপ ইন্সটল করুন</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            আরও ভালো অভিজ্ঞতা ও অফলাইন অ্যাক্সেসের জন্য হোমস্ক্রিনে অ্যাপটি যোগ করুন।
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
        >
          <X size={18} />
        </button>
      </div>
      <button
        onClick={handleInstallClick}
        className="w-full mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <Download size={16} /> ইন্সটল করুন
      </button>
    </div>
  );
};
