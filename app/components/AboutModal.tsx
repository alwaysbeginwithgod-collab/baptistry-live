'use client';

import { useEffect, useState } from 'react';
import EmailContactModal from './EmailContactModal';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);

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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-20 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 backdrop-blur-sm transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-900 to-indigo-900 dark:from-blue-950 dark:to-indigo-950 rounded-t-2xl p-8 text-center">
            <div className="relative z-10">
              <img 
                src="/baptistry-logo.png" 
                alt="BAPTISTRY" 
                className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white/20 shadow-xl mb-4"
              />
              <h1 className="text-4xl font-bold text-white mb-2">BAPTISTRY</h1>
              <p className="text-blue-100 text-lg">A Free KJV Bible Study Tool</p>
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 bg-yellow-500 text-white rounded-full text-sm font-semibold shadow-lg">
                <span>🚀</span> Launched June 8, 2026
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            
            {/* FOMO / Hook Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-6 border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Why Every Believer Needs BAPTISTRY Today</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    In a digital age flooded with misinformation, shallow teaching, and compromised doctrine, finding a <strong>trustworthy, free, and biblically sound study tool</strong> has never been harder — or more urgent.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                    <strong>BAPTISTRY is not just another chatbot.</strong> It's a labor of love born from prayer, countless hours of development, and a burning desire to put <strong>solid, KJV-based resources</strong> into the hands of every believer — regardless of their ability to study.
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 mt-3 font-semibold text-sm">
                    🕊️ <em>"My people are destroyed for lack of knowledge..." — Hosea 4:6 (KJV)</em>
                  </p>
                </div>
              </div>
            </div>

            {/* How It Started */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">📖</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">How It Started</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    BAPTISTRY was born from the burden of a preacher who saw countless believers struggling to find <strong>reliable, free, and doctrinally sound Bible study tools</strong>. Many resources are either too expensive, theologically compromised, or buried under confusing interfaces.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                    With much prayer and reliance on God's grace, BAPTISTRY was developed to fill this gap. <strong>What started as a personal project has now become a free gift to the body of Christ worldwide.</strong>
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 mt-2 font-semibold text-sm">
                    🙏 <em>"Not by might, nor by power, but by my spirit, saith the LORD." — Zechariah 4:6 (KJV)</em>
                  </p>
                </div>
              </div>
            </div>

            {/* What Is BAPTISTRY? */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">✝️</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">What Is BAPTISTRY?</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Just as a <strong>baptistry</strong> (the pool where baptism is performed) is a place of public declaration of faith and obedience, <strong>BAPTISTRY</strong> (the tool) is a well of doctrines where believers can grow in their knowledge of God's Word.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                    It is a <strong>completely free, online King James Version (KJV) Bible study tool</strong> designed to help every believer:
                  </p>
                  <ul className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2"><span className="text-blue-500">🔍</span><span><strong>Look up Scriptures instantly</strong> — Find any verse in seconds</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">📚</span><span><strong>Access a built-in dictionary and reference library</strong> — Understand difficult words and explore historic Baptist resources</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">💡</span><span><strong>Explore doctrines, preachings, and daily devotions</strong> — Deepen your faith with sound teaching</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">💬</span><span><strong>Ask any Bible-related question</strong> — Get immediate, Scripture-based answers rooted in the KJV</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">📖</span><span><strong>Preview free flipbooks</strong> — Sample written resources before reading more</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Purpose</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    To <strong>equip believers worldwide</strong> with a reliable, easy-to-use digital tool for:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300 ml-2">
                    <li>Personal Bible study and spiritual growth</li>
                    <li>Sermon and lesson preparation</li>
                    <li>Daily devotion and prayer time</li>
                    <li>Sharing the gospel with others</li>
                  </ul>
                  <p className="text-green-600 dark:text-green-400 mt-2 font-semibold text-sm">
                    📖 <em>"Study to shew thyself approved unto God..." — 2 Timothy 2:15 (KJV)</em>
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚙️</span>
                <div className="w-full">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm"><div className="font-bold text-gray-900 dark:text-white">📝 Ask Anything</div><p className="text-sm text-gray-600 dark:text-gray-300">Submit questions on Scriptures, doctrines, or preachings for immediate study.</p></div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm"><div className="font-bold text-gray-900 dark:text-white">📖 KJV Bible Integration</div><p className="text-sm text-gray-600 dark:text-gray-300">Complete King James Version with built-in dictionary.</p></div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm"><div className="font-bold text-gray-900 dark:text-white">📚 Reference Library</div><p className="text-sm text-gray-600 dark:text-gray-300">Access to historic Baptist resources and study materials.</p></div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm"><div className="font-bold text-gray-900 dark:text-white">🌓 Dark / Light Mode</div><p className="text-sm text-gray-600 dark:text-gray-300">Comfortable reading day or night.</p></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why This Tool */}
            <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-6 border-l-4 border-red-500">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Why BAPTISTRY Exists</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>The average Christian today spends more time scrolling social media than studying God's Word.</strong> We've traded depth for distraction. BAPTISTRY is here to change that.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                    Every feature, every response, every resource is designed to <strong>point you back to Scripture</strong> — not to entertain, but to equip. Not to replace your Bible, but to help you love it more.
                  </p>
                  <p className="text-red-600 dark:text-red-400 mt-2 font-semibold text-sm">
                    ⏳ <em>Don't let another day pass without digging deeper into God's Word.</em>
                  </p>
                </div>
              </div>
            </div>

            {/* Invitation */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-3">Looking for a FREE and realiable Bible study tool?</h3>
              <p className="text-xl mb-2"><strong>BAPTISTRY is created for you.</strong></p>
              <p className="text-blue-100 mb-6 max-w-md mx-auto">Use it freely. Share it freely. Grow in grace and in the knowledge of our Lord Jesus Christ.</p>
              <button onClick={onClose} className="px-6 py-2.5 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105">Start Studying Now →</button>
            </div>

            {/* Glory to God */}
            <div className="text-center py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 italic text-sm">"I am just a pen here. Any glory in BAPTISTRY does not belong to me but to our Lord and Saviour Jesus Christ alone."</p>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-2 text-sm">"A dose of God's Word a day, will keep you going all day."</p>
              <p className="text-gray-500 dark:text-gray-500 mt-1 text-xs"><a href="https://www.facebook.com/BeginWithGod" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">— ALWAYS BEGIN WITH GOD —</a></p>
            </div>

            {/* Contact Info - Email button opens modal */}
            <div className="text-center space-y-2 py-2">
              <p className="text-gray-800 dark:text-gray-200 text-base">
                📧 <button 
                  onClick={() => setShowEmailModal(true)}
                  className="link-unified font-medium"
                >
                  always.begin.with.god@gmail.com
                </button>
              </p>
              <p className="text-gray-800 dark:text-gray-200 text-base">
                🏛️ <a href="https://www.bordergatebaptist.net" target="_blank" rel="noopener noreferrer" className="link-unified font-medium">bordergatebaptist.net</a>
              </p>
            </div>

{/* Footer Note */}
<div className="text-center pt-3 border-t border-gray-200 dark:border-gray-700">
  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
    *This is not a replacement for the infallible Word of God. </p>
     The Bible is still the final Authority in all matters of our faith and practice.
  </p>
  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
    © 2026 BAPTISTRY. All rights reserved.
  </p>
</div>
          </div>
        </div>
      </div>

      {/* Email Contact Modal */}
      <EmailContactModal 
        isOpen={showEmailModal} 
        onClose={() => setShowEmailModal(false)} 
        email="always.begin.with.god@gmail.com"
      />
    </>
  );
}