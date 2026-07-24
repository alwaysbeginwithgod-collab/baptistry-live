'use client';

import { useEffect } from 'react';

interface BookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    title: string;
    number?: number;
    series?: string;
    cover: string;
    flipbookLink: string;
    amazonLink?: string;
    description?: string;
    tagline?: string;
    author?: string;
  } | null;
}

export default function BookDetailModal({ isOpen, onClose, book }: BookDetailModalProps) {
  // ✅ Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      console.log('📖 BookDetailModal closed');
    }
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const handleFlipbook = () => {
    if (book.flipbookLink && book.flipbookLink !== "#") {
      window.open(book.flipbookLink, '_blank');
    } else {
      alert(`"${book.title}" preview is coming soon! Stay tuned.`);
    }
  };

  const handleAmazonLink = () => {
    if (book.amazonLink && book.amazonLink !== "https://www.amazon.com/dp/YOUR_AMAZON_LINK") {
      window.open(book.amazonLink, '_blank');
    } else {
      alert(`"${book.title}" Amazon link is coming soon! Stay tuned.`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {book.series ? `${book.series} - ` : ''}{book.title}
          </h2>
          {/* ✅ This calls onClose which sets selectedBook to null */}
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            aria-label="Close book details"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover - Large */}
            <div className="md:w-1/3">
              <img 
                src={book.cover} 
                alt={book.title}
                className="w-full aspect-[2/3] object-contain rounded-lg shadow-lg bg-gray-100 dark:bg-gray-900"
              />
            </div>

            {/* Book Details */}
            <div className="md:w-2/3 space-y-4">
              {book.number && (
                <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  Book {book.number}
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {book.title}
              </h3>
              
              {book.tagline && (
                <p className="text-md italic text-blue-600 dark:text-blue-400">
                  "{book.tagline}"
                </p>
              )}
              
              {book.description && (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {book.description}
                </p>
              )}
              
              {book.author && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Author: {book.author}
                </p>
              )}
              
              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={handleFlipbook}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📖 Preview Book
                </button>
                
                <button
                  onClick={handleAmazonLink}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>📚</span> Buy on Amazon
                </button>
                
                {/* ✅ This calls onClose which sets selectedBook to null */}
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}