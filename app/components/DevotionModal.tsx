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
      
      setTodayDevotion(sortedDevotions[index]);
    }
  }, [isOpen]);

  if (!isOpen || !todayDevotion) return null;

  const { title, tagline, scripture, content, prayer, image, facebookLink } = todayDevotion;

  // ============================================================
  // FUNCTION: Format content with bold scripture references
  // ============================================================
  const formatContent = (text: string) => {
    // Split content into paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph is a scene break (starts with "---" or "***")
      if (paragraph.trim().startsWith('---') || paragraph.trim().startsWith('***')) {
        return (
          <div key={index} className="text-center text-gray-400 dark:text-gray-500 text-xl my-6">
            <span className="inline-block w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-2"></span>
            <span className="mx-2">✦</span>
            <span className="inline-block w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-2"></span>
          </div>
        );
      }
      
      // Format scripture references within the paragraph
      const formattedText = formatScriptureReferences(paragraph);
      
      return (
        <p key={index} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
          {formattedText}
        </p>
      );
    });
  };

  // ============================================================
  // FUNCTION: Bold scripture references (Book Chapter:Verse)
  // ============================================================
  const formatScriptureReferences = (text: string) => {
    // Match patterns like "John 3:16", "1 Corinthians 13:2", "Galatians 5:6", etc.
    const scripturePattern = /\b((?:[1-3]?\s?[A-Za-z]+)\s+\d+:\d+(?:-\d+)?)\b/g;
    
    // Split text by scripture references
    const parts = [];
    let lastIndex = 0;
    let match;
    
    // Create a regex that matches scripture references
    const regex = new RegExp(scripturePattern);
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before the scripture reference
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the scripture reference with bold styling
      const scriptureRef = match[0];
      // Check if the scripture reference is part of a larger quote
      const fullMatch = match[0];
      
      // Check if there's a quote before or after
      const beforeChar = text[match.index - 1] || '';
      const afterChar = text[regex.lastIndex] || '';
      
      let styledRef = `<strong class="text-blue-600 dark:text-blue-400 font-bold">${fullMatch}</strong>`;
      
      // If the scripture reference is part of a quote (has quotes around it)
      if (beforeChar === '"' && afterChar === '"') {
        // The reference is inside quotes, keep it styled but don't add extra quotes
        parts.push(styledRef);
      } else if (afterChar === ' ' || afterChar === '.' || afterChar === ',' || afterChar === ';' || afterChar === '') {
        // Check if this scripture reference has a preceding quote
        const quoteMatch = text.substring(0, match.index).match(/"([^"]*)$/);
        if (quoteMatch) {
          // The scripture is part of a quoted passage
          parts.push(styledRef);
        } else {
          parts.push(styledRef);
        }
      } else {
        parts.push(styledRef);
      }
      
      lastIndex = regex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    // If no scripture references found, return the original text
    if (parts.length === 0) {
      return text;
    }
    
    // Join all parts and return as JSX
    return parts.map((part, i) => {
      if (part.startsWith('<strong')) {
        // It's a styled scripture reference
        return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  // ============================================================
  // FUNCTION: Format scripture (bold book/chapter/verse)
  // ============================================================
  const formatScripture = (text: string) => {
    // Extract the book/chapter/verse part
    const match = text.match(/^([^:]+:\s*)(.+)$/);
    if (match) {
      const reference = match[1];
      const verse = match[2];
      return (
        <>
          <strong className="text-blue-600 dark:text-blue-400 font-bold">{reference}</strong>
          <span>"{verse}"</span>
        </>
      );
    }
    return <span>"{text}"</span>;
  };

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
                  e.currentTarget.src = '/baptistry-logo.png';
                  e.currentTarget.className = 'w-32 h-32 mx-auto object-contain p-4';
                }}
              />
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
          
          {/* Tagline with two-line formatting */}
          <p className="text-base italic text-blue-600 dark:text-blue-400 mb-4 whitespace-pre-line">
            {tagline}
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              📖 {formatScripture(scripture)}
            </p>
          </div>

          <div className="prose prose-base dark:prose-invert max-w-none mb-6">
            {formatContent(content)}
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
                <span> More on Facebook</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}