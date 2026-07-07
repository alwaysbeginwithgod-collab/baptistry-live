'use client';

import { useState, useEffect, useMemo } from 'react';
import { devotions, Devotion } from '../data/devotions';

interface DevotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DevotionModal({ isOpen, onClose }: DevotionModalProps) {
  // Use useMemo to calculate the devotion based on today's date
  const todayDevotion = useMemo(() => {
    if (!isOpen || devotions.length === 0) return null;
    
    // Force sort by ID
    const sortedDevotions = [...devotions].sort((a, b) => {
      const numA = parseInt(a.id.replace('Devotion-', ''));
      const numB = parseInt(b.id.replace('Devotion-', ''));
      return numA - numB;
    });
    
    // Calculate the day of the year - using UTC to avoid timezone issues
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Calculate index based on day of year
    const index = (dayOfYear - 1) % sortedDevotions.length;
    
    console.log(`📅 Day ${dayOfYear} of year → Devotion ${index + 1}: ${sortedDevotions[index]?.title}`);
    console.log(`🔍 Today's date: ${now.toLocaleDateString()}`);
    console.log(`📚 Total devotions: ${sortedDevotions.length}`);
    
    return sortedDevotions[index];
  }, [isOpen]); // Recalculate when modal opens

  if (!isOpen || !todayDevotion) return null;

  const { title, tagline, scripture, content, prayer, image, facebookLink } = todayDevotion;

  // ============================================================
  // FORMAT TAGLINE - Handle \n line breaks properly
  // ============================================================
  const formatTagline = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  };

  // ============================================================
  // FORMAT SCRIPTURE - Bold reference, italic quote
  // ============================================================
  const formatScripture = (text: string) => {
    // Match pattern: "Book Chapter:Verse" followed by quoted text
    // Example: "Matthew 6:34 "Take therefore..."
    const match = text.match(/^([^:]+:\s*\d+)\s*["'](.+)["']$/);
    if (match) {
      const reference = match[1].trim();
      const verse = match[2].trim();
      return (
        <>
          <strong className="text-blue-600 dark:text-blue-400 font-bold">{reference}</strong>
          <span className="italic"> "{verse}"</span>
        </>
      );
    }
    
    // Fallback: try to split by quote
    const quoteMatch = text.match(/^([^"']+)["'](.+)["']$/);
    if (quoteMatch) {
      const reference = quoteMatch[1].trim();
      const verse = quoteMatch[2].trim();
      return (
        <>
          <strong className="text-blue-600 dark:text-blue-400 font-bold">{reference}</strong>
          <span className="italic"> "{verse}"</span>
        </>
      );
    }
    
    return <span className="italic">"{text}"</span>;
  };

  // ============================================================
  // FORMAT CONTENT - Bold scripture references, italic quotes
  // ============================================================
  const formatContent = (text: string) => {
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      
      // Check for scene break
      if (trimmed === '---' || trimmed === '***' || trimmed === '—' || trimmed === '— — —') {
        return (
          <div key={index} className="text-center text-gray-400 dark:text-gray-500 my-8">
            <span className="inline-block w-12 h-px bg-gray-300 dark:bg-gray-600 mx-3"></span>
            <span className="text-gray-400 dark:text-gray-500 text-sm mx-2">✦</span>
            <span className="inline-block w-12 h-px bg-gray-300 dark:bg-gray-600 mx-3"></span>
          </div>
        );
      }
      
      // Process the paragraph
      const formattedParagraph = processParagraph(trimmed);
      
      return (
        <p key={index} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
          {formattedParagraph}
        </p>
      );
    });
  };

  // ============================================================
  // PROCESS PARAGRAPH - Format scripture references and quotes
  // ============================================================
  const processParagraph = (text: string) => {
    // First, find all scripture references and format them
    const result = [];
    let remaining = text;
    let lastIndex = 0;
    
    // Match scripture references like "Matthew 6:34", "1 Corinthians 13:2", etc.
    const scriptureRegex = /\b((?:[1-3]?\s?[A-Za-z]+)\s+\d+:\d+(?:-\d+)?)\b/g;
    let match;
    let tempText = text;
    let parts = [];
    let currentIndex = 0;
    
    while ((match = scriptureRegex.exec(text)) !== null) {
      const ref = match[0];
      const refStart = match.index;
      const refEnd = scriptureRegex.lastIndex;
      
      // Add text before the reference
      if (refStart > currentIndex) {
        const beforeText = text.substring(currentIndex, refStart);
        // Process quotes in the before text
        parts.push(...processQuotes(beforeText));
      }
      
      // Add the scripture reference (bold)
      parts.push(
        <strong key={`ref-${match.index}`} className="text-blue-600 dark:text-blue-400 font-bold">
          {ref}
        </strong>
      );
      
      currentIndex = refEnd;
    }
    
    // Add remaining text after all references
    if (currentIndex < text.length) {
      const afterText = text.substring(currentIndex);
      parts.push(...processQuotes(afterText));
    }
    
    // If no scripture references found, just process quotes
    if (parts.length === 0) {
      return processQuotes(text);
    }
    
    return parts;
  };

  // ============================================================
  // PROCESS QUOTES - Italicize text within quotes
  // ============================================================
  const processQuotes = (text: string): (string | JSX.Element)[] => {
    if (!text) return [];
    
    const parts: (string | JSX.Element)[] = [];
    let remaining = text;
    let quoteStart = remaining.indexOf('"');
    
    while (quoteStart !== -1) {
      // Add text before the quote
      if (quoteStart > 0) {
        parts.push(remaining.substring(0, quoteStart));
      }
      
      // Find the closing quote
      const quoteEnd = remaining.indexOf('"', quoteStart + 1);
      if (quoteEnd !== -1) {
        // Extract the quoted text (including quotes)
        const quotedText = remaining.substring(quoteStart, quoteEnd + 1);
        // Add italicized quoted text
        parts.push(
          <em key={`quote-${parts.length}`} className="italic text-gray-800 dark:text-gray-200">
            {quotedText}
          </em>
        );
        remaining = remaining.substring(quoteEnd + 1);
      } else {
        // No closing quote, add the rest
        parts.push(remaining.substring(quoteStart));
        break;
      }
      
      quoteStart = remaining.indexOf('"');
    }
    
    // Add any remaining text
    if (remaining) {
      // Check if remaining has quotes
      if (remaining.includes('"')) {
        // Recursively process remaining text
        const moreParts = processQuotes(remaining);
        parts.push(...moreParts);
      } else {
        parts.push(remaining);
      }
    }
    
    return parts;
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