'use client';

import { useState, useEffect } from 'react';
import { devotions, Devotion } from '../data/devotions';

interface DevotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DevotionModal({ isOpen, onClose }: DevotionModalProps) {
  const [todayDevotion, setTodayDevotion] = useState<Devotion | null>(null);

  useEffect(() => {
    if (isOpen && devotions.length > 0) {
      // Force sort by ID to ensure correct order
      const sortedDevotions = [...devotions].sort((a, b) => {
        const numA = parseInt(a.id.replace('Devotion-', ''));
        const numB = parseInt(b.id.replace('Devotion-', ''));
        return numA - numB;
      });
      
      // Calculate the day of the year
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      // Calculate index based on day of year
      const index = (dayOfYear - 1) % sortedDevotions.length;
      
      console.log(`📅 Day ${dayOfYear} of year → Devotion ${index + 1}: ${sortedDevotions[index]?.title}`);
      
      setTodayDevotion(sortedDevotions[index]);
    }
  }, [isOpen]);

  if (!isOpen || !todayDevotion) return null;

  const { title, tagline, scripture, content, prayer, image, facebookLink } = todayDevotion;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">📖 Today's Devotion</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Image with fallback */}
          {image && (
            <div className="mb-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img 
                src={image} 
                alt={title}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  // Fallback to logo if image fails to load
                  e.currentTarget.src = '/baptistry-logo.png';
                  e.currentTarget.className = 'w-32 h-32 mx-auto object-contain p-4';
                }}
              />
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
          
          {/* Tagline with two-line formatting support */}
          <p className="text-base italic text-blue-600 dark:text-blue-400 mb-4 whitespace-pre-line">
            {tagline}
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">📖 {scripture}</p>
          </div>

          <div className="prose prose-base dark:prose-invert max-w-none mb-6">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">{paragraph}</p>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">🙏 Prayer</h3>
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">{prayer}</p>
          </div>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">"A dose of God's Word a day, will keep you going all day."</p>
            <p className="text-lg text-blue-500 dark:text-blue-400 mt-1">— ALWAYS BEGIN WITH GOD —</p>
          </div>

          {facebookLink && (
            <div className="mt-4 text-center">
              <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                <span>📘 More on Facebook</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}