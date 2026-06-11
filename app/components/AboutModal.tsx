'use client';

import { useEffect } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={onClose}
      />
      
      {/* Modal - with watermark background */}
      <div 
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto z-10 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/wallpaper.png")',
          backgroundSize: '40%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-20 bg-white/80 dark:bg-gray-800/80 rounded-full p-1.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content - with semi-transparent background for readability */}
        <div className="relative z-10 p-6 bg-white/90 dark:bg-gray-900/90 rounded-2xl m-4">
          {/* Header */}
          <div className="text-center mb-6">
            <img 
              src="/baptistry-logo.png" 
              alt="BAPTISTRY" 
              className="w-20 h-20 mx-auto rounded-full object-cover mb-3"
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">BAPTISTRY</h1>
            <p className="text-gray-600 dark:text-gray-400">A Free KJV Bible Study Tool</p>
            <div className="inline-block mt-2 px-3 py-1 bg-yellow-500 text-white rounded-full text-xs">
              🚀 Launched June 8, 2026
            </div>
          </div>

          {/* Greeting */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-5 text-center">
            <p className="text-gray-800 dark:text-gray-200 italic text-sm">
              "Grace and peace be unto you from God our Father, and from the Lord Jesus Christ."
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">— Philippians 1:2 (KJV)</p>
          </div>

          {/* Content sections */}
          <div className="space-y-4 text-sm">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">📖 How It Started</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-1">Created by a preacher for free, doctrinally sound Bible study.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">✝️ What Is BAPTISTRY?</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-1">A free online KJV Bible study tool with Scripture lookups, dictionary, reference library, doctrines, preachings, and devotions.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">🎯 Purpose</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-1">Equipping believers for personal study, sermon prep, and daily devotion.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">⚙️ Key Features</h2>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>✓ Ask Anything — Questions on Scriptures, doctrines, preachings</li>
                <li>✓ KJV Bible Integration — Complete KJV with dictionary</li>
                <li>✓ Free Flipbooks — Preview of written books</li>
                <li>✓ Dark / Light Mode — Comfortable reading</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 border-l-4 border-red-500">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">⚠️ Why This Tool?</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-1">In a world of confusion, BAPTISTRY provides trusted, accessible Bible study.</p>
            </div>
          </div>

          {/* Invitation */}
          <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 text-center text-white">
            <h3 className="text-lg font-bold">Looking for the best Bible study tool?</h3>
            <p className="text-md mt-1"><strong>BAPTISTRY is created for you.</strong></p>
            <button onClick={onClose} className="mt-3 px-4 py-1.5 bg-white text-blue-600 rounded-full text-sm font-semibold hover:bg-gray-100">
              Start Studying Now →
            </button>
          </div>

          {/* Glory to God */}
          <div className="text-center mt-5 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 italic text-xs">
              "Any glory in BAPTISTRY belongs to our Lord Saviour Jesus Christ alone."
            </p>
          </div>

          {/* Contact */}
          <div className="text-center mt-3 text-xs text-gray-600 dark:text-gray-400">
            <p>📧 always.begin.with.god@gmail.com</p>
            <p>🏛️ bordergatebaptistchurch.net</p>
          </div>

          {/* Footer */}
          <div className="text-center mt-3 text-xs text-gray-400 dark:text-gray-500 italic">
            *Not a replacement for God's Word. The Bible is final authority.
          </div>
        </div>
      </div>
    </div>
  );
}