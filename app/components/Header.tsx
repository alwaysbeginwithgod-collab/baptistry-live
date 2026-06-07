'use client';

import { useState, useRef, useEffect } from 'react';
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
}

export default function Header({ onMenuClick, messageCount, messages = [], onLoadMessage }: HeaderProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const historyDropdownRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useUser();

  // Close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyDropdownRef.current && !historyDropdownRef.current.contains(event.target as Node)) {
        setIsHistoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userMessages = messages.filter(m => m.role === 'user');

  const getPreview = (content: string) => {
    const words = content.split(' ').slice(0, 5).join(' ');
    return words.length < content.length ? words + '...' : words;
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 w-full">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">FREE TO USE</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Biblical teaching from the King James Version</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Sign In / User Menu */}
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <UserMenu 
              onHelpClick={() => setIsHelpOpen(true)}
              onFeedbackClick={() => setIsFeedbackOpen(true)}
            />
          )}

          {/* Separator */}
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>

          {/* Clickable Message Count */}
          <div className="relative" ref={historyDropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsHistoryOpen(!isHistoryOpen);
              }}
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1"
              aria-label="View message history"
            >
              <span>{messageCount} {messageCount === 1 ? 'message' : 'messages'}</span>
              <svg className={`w-3 h-3 transition-transform ${isHistoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Message History Dropdown */}
            {isHistoryOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Message History</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Click any message to jump to it</p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {userMessages.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 dark:text-gray-500 text-sm">No messages yet</div>
                  ) : (
                    userMessages.slice().reverse().map((msg, index) => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          if (onLoadMessage) onLoadMessage(msg.id);
                          setIsHistoryOpen(false);
                        }}
                        className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                #{userMessages.length - index}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate">
                              {getPreview(msg.content)}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {new Date(msg.timestamp).toLocaleDateString()} at {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Separator before notification bell */}
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Separator before theme toggle */}
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
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

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </header>
  );
}