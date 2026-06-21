'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import QRCode from 'qrcode';

interface UserMenuProps {
  onFeedbackClick?: () => void;
  onHelpClick?: () => void;
}

export default function UserMenu({ onFeedbackClick, onHelpClick }: UserMenuProps) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowQRCode(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate QR code when modal opens
  useEffect(() => {
    if (showQRCode) {
      QRCode.toDataURL('https://www.baptistry.app', {
        width: 200,
        margin: 2,
        color: {
          dark: '#1e3a5f',
          light: '#ffffff'
        }
      })
      .then((url) => {
        setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error('QR Code generation error:', err);
        setQrCodeDataUrl(null);
      });
    }
  }, [showQRCode]);

  const handleDownloadClick = () => {
    setShowQRCode(true);
    setIsOpen(false);
  };

  const handleHelpClick = () => {
    if (onHelpClick) onHelpClick();
    setIsOpen(false);
  };

  const handleFeedbackClick = () => {
    if (onFeedbackClick) onFeedbackClick();
    setIsOpen(false);
  };

  const handleDirectDownload = async () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Desktop
    if (!isMobile) {
      alert('📱 Please open this page on your phone to install the app.');
      setShowQRCode(false);
      return;
    }
    
    // Android: Try native install prompt
    if (isAndroid) {
      if ('beforeinstallprompt' in window) {
        // @ts-ignore
        const deferredPrompt = window.deferredPrompt;
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const result = await deferredPrompt.userChoice;
          console.log('Install result:', result.outcome);
          setShowQRCode(false);
          return;
        }
      }
      alert('📱 To install BAPTISTRY:\n\n1. Tap the share icon (📤)\n2. Tap "Add to Home Screen"\n3. Tap "Add"');
      setShowQRCode(false);
      return;
    }
    
    // iOS: Show instructions
    if (isIOS) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'BAPTISTRY',
            text: 'Install BAPTISTRY on your phone!',
            url: 'https://www.baptistry.app',
          });
          setShowQRCode(false);
          return;
        } catch (err) {
          console.log('Share cancelled');
        }
      }
      alert('📱 To install BAPTISTRY on your iPhone/iPad:\n\n1. Tap the share icon (📤) at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top-right corner');
      setShowQRCode(false);
      return;
    }
    
    // Fallback
    alert('📱 To install BAPTISTRY:\n\n1. Tap the share icon (📤)\n2. Tap "Add to Home Screen"\n3. Tap "Add"');
    setShowQRCode(false);
  };
  
  // Fallback for iOS or if beforeinstallprompt is not available
  // Show instructions with a direct link to open the site
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'BAPTISTRY',
        text: 'Install BAPTISTRY on your phone!',
        url: 'https://www.baptistry.app',
      });
      setShowQRCode(false);
      return;
    } catch (err) {
      console.log('Share cancelled');
    }
  }
  
  // Final fallback: open the site (user can install from there)
  window.open('https://www.baptistry.app', '_blank');
  setShowQRCode(false);
};

  const getInitials = () => {
    if (!user) return 'U';
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName[0].toUpperCase();
    return 'U';
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {user.imageUrl ? (
          <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            {getInitials()}
          </div>
        )}
        <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">
          {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
        </span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {getInitials()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.fullName || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>

          {/* Download Mobile App - Opens QR Code Modal */}
          <button
            onClick={handleDownloadClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
          >
            <span className="text-xl">📲</span>
            <div className="flex-1 text-left">
              <span className="font-medium text-gray-800 dark:text-white">Download Mobile App</span>
              <p className="text-xs text-gray-400 dark:text-gray-500">QR code & direct link</p>
            </div>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">Free</span>
          </button>

          <button
            onClick={handleHelpClick}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Help</span>
          </button>

          <button
            onClick={handleFeedbackClick}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>Feedback</span>
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          <SignOutButton>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </SignOutButton>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📱 Download BAPTISTRY
              </h3>
              <button onClick={() => setShowQRCode(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              {/* QR Code */}
              <div className="flex justify-center items-center w-48 h-48 mx-auto bg-white rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code for BAPTISTRY" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">Generating...</div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                Scan with your phone camera to open BAPTISTRY
              </p>

              <div className="my-3 flex items-center gap-2">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Direct Download Link */}
              <button
                onClick={handleDirectDownload}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>📲</span>
                Download Mobile App
              </button>
              
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Available on iOS and Android via browser
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}