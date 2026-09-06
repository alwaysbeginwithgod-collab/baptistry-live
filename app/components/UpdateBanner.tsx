// app/components/UpdateBanner.tsx
'use client';

import { useState, useEffect } from 'react';

interface UpdateBannerProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export default function UpdateBanner({ onUpdate, onDismiss }: UpdateBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onUpdate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 shadow-lg animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔄</span>
          <div>
            <p className="text-white font-semibold text-sm">
              New Version Available!
            </p>
            <p className="text-blue-100 text-xs">
              {countdown > 0 
                ? `Updating in ${countdown} second${countdown > 1 ? 's' : ''}...` 
                : 'Updating now...'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onUpdate}
            className="px-4 py-1.5 bg-white text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Update Now
          </button>
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}