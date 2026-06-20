'use client';

import { useState, useEffect } from 'react';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      console.log(`User ${result.outcome}`);
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">📱 Install BAPTISTRY</h3>
          <p className="text-xs text-blue-100">Get the app on your home screen</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBanner(false)}
            className="px-3 py-1 text-sm text-blue-100 hover:text-white"
          >
            Later
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-1 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}