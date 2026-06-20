'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';

interface UserMenuProps {
  onFeedbackClick?: () => void;
  onHelpClick?: () => void;
}

export default function UserMenu({ onFeedbackClick, onHelpClick }: UserMenuProps) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
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
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
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

                {/* Help */}
                <button
                  onClick={handleHelpClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
    </>
  );
}