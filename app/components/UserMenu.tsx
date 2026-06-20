'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
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

  useEffect(() => {
    // Generate QR code when modal opens
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
      });
    }
  }, [showQRCode]);

  const handleHelpClick = () => {
    if (onHelpClick) onHelpClick();
    setIsOpen(false);
  };

  const handleFeedbackClick = () => {
    if (onFeedbackClick) onFeedbackClick();
    setIsOpen(false);
  };

  const handleInstallClick = async () => {
    // Check if the app can be installed
    if ('beforeinstallprompt' in window) {
      // @ts-ignore - beforeinstallprompt is not typed
      const deferredPrompt = window.deferredPrompt;
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
          console.log('✅ User installed the app');
        } else {
          console.log('❌ User dismissed the install prompt');
        }
      } else {
        // Fallback: show instructions
        alert('📱 To install BAPTISTRY on your phone:\n\n1. Tap the share icon (📤)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
      }
    } else {
      alert('📱 To install BAPTISTRY on your phone:\n\n1. Tap the share icon (📤)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
    }
    setIsOpen(false);
  };

  const getInitials = () => {
    if (!user) return 'U';
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName[0].toUpperCase();
    return 'U';
  };

  return (
    <>
      {/* ALWAYS VISIBLE DOWNLOAD BUTTON - Outside the dropdown */}
      <div className="flex items-center gap-2">
        {/* Sign in / User menu toggle */}
        {!user ? (
          <SignInButton mode="modal">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </button>
          </SignInButton>
        ) : (
          <div className="relative" ref={menuRef}>
            {/* User Avatar Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
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

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                {/* User Info Header */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                      {getInitials()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.fullName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </div>

                {/* Download Options Header */}
                <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    📱 Get BAPTISTRY on your phone
                  </p>
                </div>

                {/* Option 1: Direct Install Button */}
                <button
                  onClick={handleInstallClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
                >
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10l3-3m0 0l3 3m-3-3v8" />
                  </svg>
                  <div className="flex-1 text-left">
                    <span className="font-medium">Install App</span>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Direct install on your device</p>
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">Free</span>
                </button>

                {/* Option 2: QR Code */}
                <button
                  onClick={() => setShowQRCode(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <span className="font-medium">Scan QR Code</span>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Open on your phone camera</p>
                  </div>
                </button>

                {/* Help */}
                <button
                  onClick={handleHelpClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Help</span>
                </button>

                {/* Feedback */}
                <button
                  onClick={handleFeedbackClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span>Feedback</span>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                {/* Logout */}
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
          </div>
        )}

        {/* ALWAYS VISIBLE DOWNLOAD BUTTON */}
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
          title="Install BAPTISTRY on your phone"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10l3-3m0 0l3 3m-3-3v8" />
          </svg>
          <span className="hidden sm:inline">📱 Install</span>
        </button>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📱 Scan to Install</h3>
              <button onClick={() => setShowQRCode(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code for BAPTISTRY" 
                  className="w-48 h-48 mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-48 h-48 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Generating...</span>
                </div>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Scan this QR code with your phone camera to open BAPTISTRY
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Or visit <strong className="text-blue-600 dark:text-blue-400">baptistry.app</strong> directly
              </p>
              <button
                onClick={() => {
                  window.open('https://www.baptistry.app', '_blank');
                }}
                className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open in Browser
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}