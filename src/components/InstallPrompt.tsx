import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for Chrome / Edge / Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'ios' | 'unsupported'> => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
        return 'accepted';
      }
      return 'dismissed';
    }

    if (isIOS) {
      return 'ios';
    }

    return 'unsupported';
  };

  return { isStandalone, isIOS, canInstall: Boolean(deferredPrompt) || isIOS, promptInstall };
}

export function InstallAppButton({ className = "" }: { className?: string }) {
  const { isStandalone, isIOS, promptInstall } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed as app, no need to clutter
  if (isStandalone) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 shadow-sm ${className}`}>
        <span>✅</span>
        <span>App Installed</span>
      </div>
    );
  }

  const handleClick = async () => {
    const result = await promptInstall();
    if (result === 'ios' || result === 'unsupported') {
      setShowModal(true);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`cursor-pointer inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all border-2 border-white/40 ${className}`}
        title="Download AlphaBuddies as an app on your phone, tablet, or computer!"
      >
        <span className="text-base sm:text-lg">📲</span>
        <span>Download App</span>
      </motion.button>

      {/* Guide Modal for iOS or manual install */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-orange-200 relative overflow-hidden font-nunito"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl shadow-inner border border-orange-200">
                <img src="/buddy.svg" alt="Buddy" className="w-12 h-12" />
              </div>

              <h3 className="text-xl font-black text-orange-950 mb-1">
                Install AlphaBuddies!
              </h3>
              <p className="text-xs text-orange-800 font-bold mb-4">
                Play full-screen, offline, and right from your home screen!
              </p>

              {isIOS ? (
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 text-left space-y-2.5 text-xs text-orange-950 font-bold mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-black shrink-0">1</span>
                    <span>Tap the <strong>Share</strong> button <span className="inline-block px-1.5 py-0.5 bg-white rounded border border-gray-300">📤</span> at the bottom of Safari.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-black shrink-0">2</span>
                    <span>Scroll down and tap <strong>Add to Home Screen</strong> <span className="inline-block px-1.5 py-0.5 bg-white rounded border border-gray-300">➕</span>.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-black shrink-0">3</span>
                    <span>Tap <strong>Add</strong> in the top right corner!</span>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 text-left space-y-2.5 text-xs text-orange-950 font-bold mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-black shrink-0">1</span>
                    <span>Tap the browser menu (<strong>⋮</strong> or three dots) in the top-right corner.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-black shrink-0">2</span>
                    <span>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-black shrink-0">3</span>
                    <span>Enjoy full-screen learning anywhere!</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-2xl bg-orange-500 text-white font-black text-sm shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
              >
                Got It, Thanks! 👍
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function InstallBanner() {
  const { isStandalone } = usePWAInstall();

  if (isStandalone) return null;

  return (
    <div className="w-full max-w-md mx-auto mb-4 px-4">
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 rounded-3xl p-3 sm:p-4 border-2 border-orange-200 shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 border border-orange-200">
            <img src="/buddy.svg" alt="Buddy" className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-orange-950">
              Get the AlphaBuddies App!
            </div>
            <div className="text-[10px] sm:text-xs text-orange-800 font-bold">
              Instant play, works offline on your phone or tablet
            </div>
          </div>
        </div>
        <InstallAppButton />
      </div>
    </div>
  );
}
