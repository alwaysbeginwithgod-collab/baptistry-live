'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface VersePopupProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  verseText: string;
}

export default function VersePopup({ isOpen, onClose, reference, verseText }: VersePopupProps) {
  const { darkMode } = useTheme();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${reference}\n${verseText}`);
    setCopied(true);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div 
        className={`
          relative max-w-md w-full mx-4 rounded-xl shadow-2xl 
          ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
          animate-scaleIn
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg">📖</span>
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {reference}
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">KJV</span>
          </div>

          {/* Verse text */}
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">
            {verseText}
          </p>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`
              mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${copied 
                ? 'bg-green-500 text-white' 
                : darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}