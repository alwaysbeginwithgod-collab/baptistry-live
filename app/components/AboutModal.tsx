'use client';

import { useState, useEffect } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <img 
                  src="/baptistry-logo.png" 
                  alt="BAPTISTRY Logo" 
                  className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
                />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">BAPTISTRY</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">A Free KJV Bible Study Tool</p>
              </div>

              {/* Greeting */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 text-center">
                <p className="text-gray-800 dark:text-gray-200 text-lg italic">
                  "Grace and peace be unto you from God our Father, and from the Lord Jesus Christ."
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">— Philippians 1:2 (KJV)</p>
              </div>

              {/* How it started */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-3xl">📖</span> How It Started
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  BAPTISTRY was created by a preacher who saw the need for a free, accessible, and doctrinally sound 
                  Bible study tool. What began as a personal project has grown into a resource for believers worldwide 
                  to study the King James Version of the Holy Scriptures.
                </p>
              </div>

              {/* What is BAPTISTRY */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-3xl">✝️</span> What Is BAPTISTRY?
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  BAPTISTRY is a <strong>free online King James (KJV) Bible study tool</strong> that provides features like 
                  Scripture lookups, a built-in dictionary, a reference library, and topical queries for doctrines, 
                  preachings, and daily devotions.
                </p>
              </div>

              {/* Purpose */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-3xl">🎯</span> Purpose
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  To equip believers with a reliable, easy-to-use digital tool for personal Bible study, sermon preparation, 
                  and daily devotion — all centered on the King James Version and sound Baptist doctrine.
                </p>
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-3xl">⚙️</span> Key Features
                </h2>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <strong>Ask Anything</strong> — Submit questions on Scriptures, doctrines, or preachings for immediate study and references.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <strong>KJV Bible Integration</strong> — Features the complete King James Version alongside a built-in dictionary.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <strong>Free Flipbooks</strong> — Preview of written books and resources.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    <strong>Dark / Light Mode</strong> — Comfortable reading day or night.
                  </li>
                </ul>
              </div>

              {/* Launch Date */}
              <div className="mb-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  🚀 Launched on <strong>June 8, 2026</strong>
                </p>
              </div>

              {/* Invitation */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 mb-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Looking for the best Bible study tool?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  <strong>BAPTISTRY is created for you.</strong>
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Use it freely. Share it freely. Grow in grace and in the knowledge of our Lord Jesus Christ.
                </p>
              </div>

              {/* Glory to God */}
              <div className="text-center mb-6 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "I am just a pen here. Any glory in BAPTISTRY does not belong to me but to our Lord Saviour Jesus Christ alone."
                </p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">— Soli Deo Gloria</p>
              </div>

              {/* Contact Info */}
              <div className="mb-6 text-center">
                <p className="text-gray-700 dark:text-gray-300">
                  📧 For inquiries: <a href="mailto:always.begin.with.god@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">always.begin.with.god@gmail.com</a>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  🏛️ My Church: <a href="https://www.bordergatebaptistchurch.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">bordergatebaptistchurch.net</a>
                </p>
              </div>

              {/* Footer Note */}
              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                  *This is not a replacement for the infallible Word of God. This is just a tool for educational purposes only. 
                  The Bible is still the final authority in all matters of our faith and practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}