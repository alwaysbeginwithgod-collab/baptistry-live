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
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up"
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
                <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">BAPTISTRY</h1>
                <p className="text-xl text-white/90 drop-shadow">A Free KJV Bible Study Tool</p>
                <div className="inline-block mt-4 px-4 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold shadow-lg">
                  🚀 Launched June 8, 2026
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* FOMO Effect - Why this world needs this tool */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-6 mb-8 border-l-4 border-red-500">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-3xl">⚠️</span> Why the World Needs This Tool
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  In a world filled with confusion, false doctrines, and spiritual apathy, <strong>sound Bible study tools are more needed than ever</strong>. Many believers struggle to find reliable, free resources that uphold the authority of the King James Version and historic Baptist faith.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>BAPTISTRY was created to fill this gap</strong> — providing a trusted, accessible, and doctrinally sound platform for personal study, sermon preparation, and daily devotion. <strong>Don't let another day pass without digging deeper into God's Word.</strong>
                </p>
              </div>

              {/* Greeting */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 text-center border border-blue-200 dark:border-blue-800">
                <p className="text-gray-800 dark:text-gray-200 text-xl italic font-serif">
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
              <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-3xl">⚙️</span> Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                      <strong className="text-gray-800 dark:text-white">Ask Anything</strong>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Submit questions on Scriptures, doctrines, or preachings for immediate study.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                      <strong className="text-gray-800 dark:text-white">KJV Bible Integration</strong>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Complete King James Version with built-in dictionary.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                      <strong className="text-gray-800 dark:text-white">Free Flipbooks</strong>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Preview of written books and resources.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                      <strong className="text-gray-800 dark:text-white">Dark / Light Mode</strong>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Comfortable reading day or night.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invitation */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 mb-6 text-center text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-3">
                  Looking for the best Bible study tool?
                </h3>
                <p className="text-xl mb-4">
                  <strong>BAPTISTRY is created for you.</strong>
                </p>
                <p className="text-blue-100 mb-6">
                  Use it freely. Share it freely. Grow in grace and in the knowledge of our Lord Jesus Christ.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Start Studying Now →
                </button>
              </div>

              {/* Glory to God */}
              <div className="text-center mb-6 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "I am just a pen here. Any glory in BAPTISTRY does not belong to me but to our Lord Saviour Jesus Christ alone."
                </p>
                <p className="text-gray-500 dark:text-gray-500 mt-2 text-sm">— Soli Deo Gloria</p>
              </div>

              {/* Contact Info */}
              <div className="mb-6 text-center">
                <p className="text-gray-700 dark:text-gray-300">
                  📧 <a href="mailto:always.begin.with.god@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">always.begin.with.god@gmail.com</a>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  🏛️ <a href="https://www.bordergatebaptistchurch.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">bordergatebaptistchurch.net</a>
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