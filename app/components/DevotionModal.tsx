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
    
    // Log for debugging
    console.log(`📅 Day ${dayOfYear} of year → Devotion ${index + 1}: ${sortedDevotions[index]?.title}`);
    console.log(`📚 Total devotions: ${sortedDevotions.length}`);
    console.log(`📖 Selected: ${sortedDevotions[index]?.id}`);
    
    return sortedDevotions[index];
  }, [isOpen]);

  if (!isOpen || !todayDevotion) return null;

  const { title, tagline, scripture, content, prayer, image, facebookLink } = todayDevotion;

  // ============================================================
  // FORMAT SCRIPTURE - Bold reference, italic quote
  // ============================================================
  const formatScripture = (text: string) => {
    // Match: "Book Chapter:Verse "quote""
    const match = text.match(/^(.+?)\s*["“](.+)["”]$/);
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
    const quoteIndex = text.indexOf('"');
    if (quoteIndex > 0) {
      const reference = text.substring(0, quoteIndex).trim();
      const verse = text.substring(quoteIndex + 1, text.lastIndexOf('"')).trim();
      return (
        <>
          <strong className="text-blue-600 dark:text-blue-400 font-bold">{reference}</strong>
          <span className="italic"> "{verse}"</span>
        </>
      );
    }
    return <span>{text}</span>;
  };

  // ============================================================
  // FORMAT TAGLINE - Handle \n line breaks
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
  // FORMAT CONTENT - Bold references, italic quotes
  // ============================================================
  const formatContent = (text: string) => {
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      
      // Scene break
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
      const formatted = processParagraph(trimmed);
      
      return (
        <p key={index} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
          {formatted}
        </p>
      );
    });
  };

  // ============================================================
  // PROCESS PARAGRAPH - Format scripture references and quotes
  // ============================================================
  const processParagraph = (text: string) => {
    // Match scripture references like "Hebrews 11:1", "1 Corinthians 13:2", etc.
    const scriptureRegex = /\b((?:[1-3]?\s?[A-Za-z]+)\s+\d+:\d+(?:-\d+)?)\b/g;
    const parts = [];
    let currentIndex = 0;
    let match;
    
    while ((match = scriptureRegex.exec(text)) !== null) {
      const ref = match[0];
      const refStart = match.index;
      
      // Add text before the reference (with quote formatting)
      if (refStart > currentIndex) {
        const beforeText = text.substring(currentIndex, refStart);
        const quoteParts = processQuotesSimple(beforeText);
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
      const quoteParts = processQuotesSimple(afterText);
      parts.push(...quoteParts);
    }
    
    // If no scripture references found, just process quotes
    if (parts.length === 0) {
      return processQuotesSimple(text);
    }
    
    return parts;
  };

  // ============================================================
  // PROCESS QUOTES - Italicize quoted scripture
  // ============================================================
  const processQuotesSimple = (text: string): (string | JSX.Element)[] => {
    if (!text) return [];
    
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
        parts.push(remaining.substring(0, quoteStart));
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
        parts.push(
          <em key={`q-${parts.length}`} className="italic text-gray-800 dark:text-gray-200">
            {quotedText}
          </em>
        );
        remaining = remaining.substring(quoteEnd + 1);
      } else {
        // No closing quote, add the rest
        parts.push(remaining.substring(quoteStart));
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
      if (remaining.includes('"') || remaining.includes('“') || remaining.includes('”')) {
        const moreParts = processQuotesSimple(remaining);
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