'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { DEVOTIONS } from '../admin/dailyDevotions';

interface DevotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DevotionModal({ isOpen, onClose }: DevotionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Close modal when pressing Escape
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Use useMemo to calculate the devotion based on today's date
  const todayDevotion = useMemo(() => {
    if (!isOpen || devotions.length === 0) return null;
    
    // Force sort by ID to ensure correct order (Devotion-1, Devotion-2, etc.)
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
    
    // Calculate index based on day of year - this ensures sequential looping
    const index = (dayOfYear - 1) % sortedDevotions.length;
    
    return sortedDevotions[index];
  }, [isOpen]);

  if (!isOpen || !todayDevotion) return null;

  const { title, tagline, scripture, content, prayer, image, facebookLink } = todayDevotion;

  // ============================================================
  // SAFE FORMAT SCRIPTURE - Bold reference, italic quote
  // ============================================================
  const formatScripture = (text: string) => {
    if (!text || typeof text !== 'string') return <span></span>;
    
    // Match: "Book Chapter:Verse "quote""
    const match = text.match(/^(.+?)\s*["“](.+)["”]$/);
    if (match) {
      const reference = match[1]?.trim() || '';
      const verse = match[2]?.trim() || '';
      return (
        <>
          <strong className="text-blue-600 dark:text-blue-400 font-bold">{reference}</strong>
          <span className="italic"> "{verse}"</span>
        </>
      );
    }
    // Fallback: try to split by quote
    const quoteIndex = text.indexOf('"');
    if (quoteIndex > 0) {
      const reference = text.substring(0, quoteIndex)?.trim() || '';
      const verse = text.substring(quoteIndex + 1, text.lastIndexOf('"'))?.trim() || '';
      return (
        <>
          <strong className="text-blue-600 dark:text-blue-400 font-bold">{reference}</strong>
          <span className="italic"> "{verse}"</span>
        </>
      );
    }
    return <span>{text || ''}</span>;
  };

  // ============================================================
  // SAFE FORMAT TAGLINE - Handle \n line breaks
  // ============================================================
  const formatTagline = (text: string) => {
    if (!text || typeof text !== 'string') return null;
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <span key={index}>
        {line || ''}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  };

  // ============================================================
  // SAFE FORMAT CONTENT - With comprehensive safety checks
  // ============================================================
  const formatContent = (text: string) => {
    if (!text || typeof text !== 'string') return <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">Content not available</p>;
    
    const paragraphs = text.split('\n\n').filter(p => p && p.trim().length > 0);
    
    if (paragraphs.length === 0) {
      return <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">{text}</p>;
    }
    
    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      // Scene break
      if (trimmed === '---' || trimmed === '***' || trimmed === '—' || trimmed === '— — —') {
        return (
          <div key={index} className="text-center text-gray-400 dark:text-gray-500 my-4">
            <span className="inline-block w-8 h-px bg-gray-300 dark:bg-gray-600 mx-2"></span>
            <span className="text-gray-400 dark:text-gray-500 text-xs mx-1">✦</span>
            <span className="inline-block w-8 h-px bg-gray-300 dark:bg-gray-600 mx-2"></span>
          </div>
        );
      }
      
      // Process the paragraph with safety
      try {
        const formatted = processParagraphSafe(trimmed);
        return (
          <p key={index} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            {formatted || trimmed}
          </p>
        );
      } catch (error) {
        console.error('Error formatting paragraph:', error);
        return (
          <p key={index} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            {trimmed}
          </p>
        );
      }
    });
  };

  // ============================================================
  // SAFE PROCESS PARAGRAPH - With error handling
  // ============================================================
  const processParagraphSafe = (text: string): (string | JSX.Element)[] | string => {
    if (!text || typeof text !== 'string') return text || '';
    
    try {
      // Match scripture references like "Hebrews 11:1", "1 Corinthians 13:2", etc.
      const scriptureRegex = /\b((?:[1-3]?\s?[A-Za-z]+)\s+\d+:\d+(?:-\d+)?)\b/g;
      const parts: (string | JSX.Element)[] = [];
      let currentIndex = 0;
      let match;
      
      while ((match = scriptureRegex.exec(text)) !== null) {
        const ref = match[0];
        const refStart = match.index;
        
        // Add text before the reference (with quote formatting)
        if (refStart > currentIndex) {
          const beforeText = text.substring(currentIndex, refStart);
          const quoteParts = processQuotesSafe(beforeText);
          parts.push(...quoteParts);
        }
        
        // Add the scripture reference (bold)
        parts.push(
          <strong key={`ref-${match.index}`} className="text-blue-600 dark:text-blue-400 font-bold">
            {ref}
          </strong>
        );
        
        currentIndex = scriptureRegex.lastIndex;
      }
      
      // Add remaining text (with quote formatting)
      if (currentIndex < text.length) {
        const afterText = text.substring(currentIndex);
        const quoteParts = processQuotesSafe(afterText);
        parts.push(...quoteParts);
      }
      
      // If no scripture references found, just process quotes
      if (parts.length === 0) {
        return processQuotesSafe(text);
      }
      
      return parts;
    } catch (error) {
      console.error('Error in processParagraphSafe:', error);
      return text;
    }
  };

  // ============================================================
  // SAFE PROCESS QUOTES - With comprehensive safety
  // ============================================================
  const processQuotesSafe = (text: string): (string | JSX.Element)[] => {
    if (!text || typeof text !== 'string') return [];
    
    try {
      const parts: (string | JSX.Element)[] = [];
      let remaining = text;
      
      // Handle both straight quotes and smart quotes
      const quoteChars = ['"', '“', '”'];
      let quoteStart = -1;
      
      // Find the first quote (any type)
      for (const char of quoteChars) {
        const pos = remaining.indexOf(char);
        if (pos !== -1 && (quoteStart === -1 || pos < quoteStart)) {
          quoteStart = pos;
        }
      }
      
      while (quoteStart !== -1) {
        // Add text before the quote
        if (quoteStart > 0) {
          const beforeText = remaining.substring(0, quoteStart);
          if (beforeText) {
            // Check if there are more quotes in beforeText
            parts.push(beforeText);
          }
        }
        
        // Find the closing quote (matching type)
        const openingChar = remaining[quoteStart];
        let closingChar = '"';
        if (openingChar === '“') closingChar = '”';
        else if (openingChar === '”') closingChar = '“';
        else closingChar = '"';
        
        const quoteEnd = remaining.indexOf(closingChar, quoteStart + 1);
        if (quoteEnd !== -1) {
          // Extract the quoted text
          const quotedText = remaining.substring(quoteStart, quoteEnd + 1);
          if (quotedText) {
            parts.push(
              <em key={`q-${parts.length}`} className="italic text-gray-800 dark:text-gray-200">
                {quotedText}
              </em>
            );
          }
          remaining = remaining.substring(quoteEnd + 1);
        } else {
          // No closing quote, add the rest
          const restText = remaining.substring(quoteStart);
          if (restText) {
            parts.push(restText);
          }
          break;
        }
        
        // Find the next quote
        quoteStart = -1;
        for (const char of quoteChars) {
          const pos = remaining.indexOf(char);
          if (pos !== -1 && (quoteStart === -1 || pos < quoteStart)) {
            quoteStart = pos;
          }
        }
      }
      
      // Add any remaining text
      if (remaining) {
        parts.push(remaining);
      }
      
      return parts;
    } catch (error) {
      console.error('Error in processQuotesSafe:', error);
      return [text];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
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

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title || 'Devotion'}</h1>
          
          {/* Tagline */}
          <p className="text-base italic text-blue-600 dark:text-blue-400 mb-4 whitespace-pre-line">
            {formatTagline(tagline)}
          </p>

          {/* Scripture Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              📖 {formatScripture(scripture)}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-base dark:prose-invert max-w-none mb-6">
            {formatContent(content)}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-5 mb-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">🙏 Prayer</h3>
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">{prayer || 'Prayer content not available.'}</p>
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