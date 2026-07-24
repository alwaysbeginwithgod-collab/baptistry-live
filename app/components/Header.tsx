'use client';

import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUser, SignInButton } from '@clerk/nextjs';
import UserMenu from './UserMenu';
import HelpModal from './HelpModal';
import FeedbackModal from './FeedbackModal';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  onMenuClick: () => void;
  messageCount: number;
  messages?: Array<{ id: string; role: string; content: string; timestamp: Date }>;
  onLoadMessage?: (messageId: string) => void;
  onBooksClick?: () => void; // ✅ Keep this
}

export default function Header({ 
  onMenuClick, 
  messageCount, 
  messages = [], 
  onLoadMessage,
  onBooksClick // ✅ Destructure and use it
}: HeaderProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { isSignedIn } = useUser();

  // Handle install prompt
  const handleInstallClick = async () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (!isMobile) {
      alert('📱 Please open this page on your phone to install the app.');
      return;
    }
    
    if (isAndroid) {
      if ('beforeinstallprompt' in window) {
        // @ts-ignore
        const deferredPrompt = window.deferredPrompt;
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const result = await deferredPrompt.userChoice;
          console.log('Install result:', result.outcome);
          return;
        }
      }
      alert('📱 To install BAPTISTRY:\n\n1. Tap the share icon (📤)\n2. Tap "Add to Home Screen"\n3. Tap "Add"');
      return;
    }
    
    if (isIOS) {
      alert('📱 To install BAPTISTRY on your iPhone/iPad:\n\n1. Tap the share icon (📤) at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top-right corner');
      return;
    }
    
    alert('📱 To install BAPTISTRY:\n\n1. Tap the share icon (📤)\n2. Tap "Add to Home Screen"\n3. Tap "Add"');
  };

  const buttonBaseClass = "h-10 px-4 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const signInButtonClass = `${buttonBaseClass} text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300`;
  const installButtonClass = `${buttonBaseClass} flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300`;
  const iconButtonClass = "p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 w-full shadow-sm overflow-visible">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
            aria-label="Menu"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">FREE TO USE</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">For Bible Study using King James Version</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!isSignedIn ? (
            <>
              <div className="relative group">
                <SignInButton mode="modal">
                  <button className={signInButtonClass}>
                    Sign In
                  </button>
                </SignInButton>
                <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                  <p className="font-semibold text-yellow-400 mb-1">✨ Save Your Chat History</p>
                  <p className="text-gray-300 leading-relaxed">
                    Sign in to keep your conversations and sync them across all your devices. It's free!
                  </p>
                  <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45 border-l border-t border-gray-700"></div>
                </div>
              </div>

              <button
                onClick={handleInstallClick}
                className={installButtonClass}
                title="Install BAPTISTRY on your phone"
              >
                <span>📲</span>
                <span className="hidden sm:inline">Install</span>
              </button>
            </>
          ) : (
            <UserMenu onHelpClick={() => setIsHelpOpen(true)} onFeedbackClick={() => setIsFeedbackOpen(true)} />
          )}

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          
          {/* ✅ Pass onBooksClick to NotificationBell */}
          <NotificationBell onBooksClick={onBooksClick} />
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          <button 
            onClick={toggleDarkMode} 
            className={iconButtonClass}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </header>
  );
}