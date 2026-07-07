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
  // FORMAT TAGLINE - Handle \n line breaks properly
  // ============================================================
  const formatTagline = (text: string) => {
    if (!text) return null;
    // Split by \n and render each line
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  };

  // ============================================================
  // FORMAT SCRIPTURE - Bold reference, italic quotes
  // ============================================================
  const formatScripture = (text: string) => {
    // Match pattern: "Book Chapter:Verse" followed by quoted text
    const match = text.match(/^([^:]+:\s*)(.+)$/);
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
    return <span className="italic">"{text}"</span>;
  };

  // ============================================================
  // FORMAT CONTENT - Bold scripture references, italic quotes
  // ============================================================
  const formatContent = (text: string) => {
    // Split content into paragraphs by double newlines
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      
      // Check if paragraph is a scene break (--- or ***)
      if (trimmed === '---' || trimmed === '***' || trimmed === '—' || trimmed === '— — —') {
        return (
          <div key={index} className="text-center text-gray-400 dark:text-gray-500 my-8">
            <span className="inline-block w-12 h-px bg-gray-300 dark:bg-gray-600 mx-3"></span>
            <span className="text-gray-400 dark:text-gray-500 text-sm mx-2">✦</span>
            <span className="inline-block w-12 h-px bg-gray-300 dark:bg-gray-600 mx-3"></span>
          </div>
        );
      }
      
      // Format scripture references in the paragraph
      const formattedParagraph = formatScriptureReferences(trimmed);
      
      return (
        <p key={index} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
          {formattedParagraph}
        </p>
      );
    });
  };

  // ============================================================
  // FORMAT SCRIPTURE REFERENCES - Bold reference, italic quotes
  // ============================================================
  const formatScriptureReferences = (text: string) => {
    // Match patterns like "John 3:16", "1 Corinthians 13:2", "Galatians 5:6", etc.
    const scripturePattern = /\b((?:[1-3]?\s?[A-Za-z]+)\s+\d+:\d+(?:-\d+)?)\b/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;
    
    // Clone the text to work with
    let remainingText = text;
    
    // Find all scripture references
    while ((match = scripturePattern.exec(text)) !== null) {
      // Add text before the scripture reference
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const fullReference = match[0];
      const beforeChar = text[match.index - 1] || '';
      const afterChar = text[scripturePattern.lastIndex] || '';
      
      // Check if this reference is part of a quoted scripture
      // Look for quotes around the reference
      let isQuoted = false;
      
      // Check if the reference is within quotes
      const beforeText = text.substring(0, match.index);
      const afterText = text.substring(scripturePattern.lastIndex);
      
      // Check if there's an opening quote before this reference that isn't closed
      const openQuoteIndex = beforeText.lastIndexOf('"');
      const closeQuoteIndex = afterText.indexOf('"');
      
      if (openQuoteIndex !== -1 && closeQuoteIndex !== -1) {
        // Check if the reference is within these quotes
        const textBetweenQuotes = text.substring(openQuoteIndex + 1, scripturePattern.lastIndex + closeQuoteIndex);
        if (textBetweenQuotes.includes(fullReference)) {
          isQuoted = true;
        }
      }
      
      // Check for single quote as well
      const openSingleQuoteIndex = beforeText.lastIndexOf("'");
      const closeSingleQuoteIndex = afterText.indexOf("'");
      
      if (openSingleQuoteIndex !== -1 && closeSingleQuoteIndex !== -1) {
        const textBetweenSingleQuotes = text.substring(openSingleQuoteIndex + 1, scripturePattern.lastIndex + closeSingleQuoteIndex);
        if (textBetweenSingleQuotes.includes(fullReference)) {
          isQuoted = true;
        }
      }
      
      // Build the styled scripture reference
      let styledRef;
      
      // Check if this is a standalone scripture reference (like in the scripture box)
      // or embedded in text
      if (isQuoted) {
        // If it's within quotes, just bold the reference and italicize the quote
        styledRef = `<strong class="text-blue-600 dark:text-blue-400 font-bold">${fullReference}</strong>`;
      } else {
        // Check if the reference has parentheses around it (like (John 3:16))
        const beforeTextFull = text.substring(0, match.index);
        const afterTextFull = text.substring(scripturePattern.lastIndex);
        const hasOpenParen = beforeTextFull.endsWith('(') || beforeTextFull.endsWith('（');
        const hasCloseParen = afterTextFull.startsWith(')') || afterTextFull.startsWith('）');
        
        if (hasOpenParen && hasCloseParen) {
          // It's in parentheses, style the reference
          styledRef = `<strong class="text-blue-600 dark:text-blue-400 font-bold">${fullReference}</strong>`;
        } else {
          // Regular reference in text
          styledRef = `<strong class="text-blue-600 dark:text-blue-400 font-bold">${fullReference}</strong>`;
        }
      }
      
      parts.push(styledRef);
      lastIndex = scripturePattern.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    // If no scripture references found, return the original text
    if (parts.length === 0) {
      // Still need to format quotes
      return formatQuotes(text);
    }
    
    // Join all parts and render as JSX
    return parts.map((part, i) => {
      if (part.startsWith('<strong')) {
        return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
      }
      // Format quotes in the text part
      return <span key={i}>{formatQuotes(part)}</span>;
    });
  };

  // ============================================================
  // FORMAT QUOTES - Italicize text within quotes
  // ============================================================
  const formatQuotes = (text: string) => {
    // If no quotes, return text
    if (!text.includes('"') && !text.includes("'")) {
      return text;
    }
    
    // Process double quotes
    const parts = [];
    let remaining = text;
    let doubleQuoteIndex = remaining.indexOf('"');
    
    while (doubleQuoteIndex !== -1) {
      // Add text before the quote
      if (doubleQuoteIndex > 0) {
        parts.push(remaining.substring(0, doubleQuoteIndex));
      }
      
      // Find the closing quote
      const closeQuoteIndex = remaining.indexOf('"', doubleQuoteIndex + 1);
      if (closeQuoteIndex !== -1) {
        // Extract the quoted text (including the quotes)
        const quotedText = remaining.substring(doubleQuoteIndex, closeQuoteIndex + 1);
        // Italicize the quoted text
        parts.push(<em key={parts.length} className="italic text-gray-800 dark:text-gray-200">{quotedText}</em>);
        remaining = remaining.substring(closeQuoteIndex + 1);
      } else {
        // No closing quote, add the rest
        parts.push(remaining.substring(doubleQuoteIndex));
        break;
      }
      
      doubleQuoteIndex = remaining.indexOf('"');
    }
    
    if (remaining) {
      parts.push(remaining);
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
          
          {/* Tagline with proper line breaks */}
          <p className="text-base italic text-blue-600 dark:text-blue-400 mb-4 whitespace-pre-line">
            {formatTagline(tagline)}
          </p>

          {/* Scripture Box - Bold reference, italic quote */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              📖 {formatScripture(scripture)}
            </p>
          </div>

          {/* Content with bold scripture references and italic quotes */}
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