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
    console.log('AboutModal mounted, isOpen:', isOpen);
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  console.log('Rendering AboutModal, isOpen:', isOpen);

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-1.5 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Hero Section with Wallpaper Background */}
            <div 
              className="relative rounded-t-2xl bg-cover bg-center bg-no-repeat p-12 text-center"
              style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1504052434569-70ad5836ab41?q=80&w=2070&auto=format")',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(0,0,0,0.5)'
              }}
            >
              <div className="relative z-10">
                <img 
                  src="/baptistry-logo.png" 
                  alt="BAPTISTRY Logo" 
                  className="w-28 h-28 mx-auto mb-4 rounded-full object-cover border-4 border-white shadow-xl"
                />
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">BAPTISTRY</h1>
                <p className="text-lg text-white/90 drop-shadow">A Free KJV Bible Study Tool</p>
                <div className="inline-block mt-4 px-4 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold shadow-lg">
                  🚀 Launched June 8, 2026
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* FOMO Effect */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-5 mb-6 border-l-4 border-red-500">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span> Why the World Needs This Tool
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  In a world filled with confusion and false doctrines, <strong>sound Bible study tools are needed more than ever</strong>. 
                  BAPTISTRY provides a trusted, accessible platform for personal study and daily devotion. <strong>Don't let another day pass without digging deeper into God's Word.</strong>
                </p>
              </div>

              {/* Greeting */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 mb-6 text-center">
                <p className="text-gray-800 dark:text-gray-200 italic">
                  "Grace and peace be unto you from God our Father, and from the Lord Jesus Christ."
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">— Philippians 1:2 (KJV)</p>
              </div>

              {/* How it started */}
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">📖 How It Started</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  BAPTISTRY was created by a preacher who saw the need for a free, doctrinally sound Bible study tool.
                </p>
              </div>

              {/* What is BAPTISTRY */}
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">✝️ What Is BAPTISTRY?</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  A <strong>free online King James (KJV) Bible study tool</strong> with Scripture lookups, dictionary, reference library, doctrines, preachings, and daily devotions.
                </p>
              </div>

              {/* Purpose */}
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">🎯 Purpose</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  To equip believers with a reliable tool for personal Bible study, sermon preparation, and daily devotion.
                </p>
              </div>

              {/* Key Features */}
              <div className="mb-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">⚙️ Key Features</h2>
                <div className="space-y-2 text-sm">
                  <div>✓ <strong>Ask Anything</strong> — Questions on Scriptures, doctrines, preachings</div>
                  <div>✓ <strong>KJV Bible Integration</strong> — Complete King James Version with dictionary</div>
                  <div>✓ <strong>Free Flipbooks</strong> — Preview of written books</div>
                  <div>✓ <strong>Dark / Light Mode</strong> — Comfortable reading</div>
                </div>
              </div>

              {/* Invitation */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-5 text-center text-white">
                <h3 className="text-xl font-bold mb-2">Looking for the best Bible study tool?</h3>
                <p className="text-lg mb-3"><strong>BAPTISTRY is created for you.</strong></p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm"
                >
                  Start Studying Now →
                </button>
              </div>

              {/* Glory to God */}
              <div className="text-center mb-5 py-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 italic text-sm">
                  "I am just a pen here. Any glory in BAPTISTRY does not belong to me but to our Lord Saviour Jesus Christ alone."
                </p>
                <p className="text-gray-500 dark:text-gray-500 mt-1 text-xs">— Soli Deo Gloria</p>
              </div>

              {/* Contact */}
              <div className="text-center mb-5">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  📧 <a href="mailto:always.begin.with.god@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">always.begin.with.god@gmail.com</a>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                  🏛️ <a href="https://www.bordergatebaptistchurch.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">bordergatebaptistchurch.net</a>
                </p>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-400 dark:text-gray-500 italic">
                *This is not a replacement for the infallible Word of God. The Bible is the final authority.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}