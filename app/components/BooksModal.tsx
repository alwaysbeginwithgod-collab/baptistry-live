'use client';

import { useState, useRef, useEffect } from 'react';
import BookDetailModal from './BookDetailModal';
import EmailContactModal from './EmailContactModal';
// ✅ NEW: Import book data from admin folder
import { anchoredSeries, ignitedSeries, standaloneBooks } from '../admin/booksData';

interface BooksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BooksModal({ isOpen, onClose }: BooksModalProps) {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // ✅ Reset selectedBook when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedBook(null);
    }
  }, [isOpen]);

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // ✅ Only close if click is outside and NOT on BookDetailModal
      const target = event.target as HTMLElement;
      const isBookDetailModal = target.closest('.book-detail-modal');
      
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isBookDetailModal) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        // ✅ If BookDetailModal is open, close it first
        if (selectedBook !== null) {
          setSelectedBook(null);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, selectedBook]);

  if (!isOpen) return null;

  // ❌ REMOVED: anchoredSeries array (now imported from admin/booksData)
  // ❌ REMOVED: ignitedSeries array (now imported from admin/booksData)
  // ❌ REMOVED: standaloneBooks array (now imported from admin/booksData)

  const handleFlipbook = (flipbookLink: string, bookTitle: string) => {
    if (flipbookLink && flipbookLink !== "#") {
      window.open(flipbookLink, '_blank');
    } else {
      alert(`"${bookTitle}" preview is coming soon! Stay tuned.`);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div
          ref={modalRef}
          className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-7xl mx-4 max-h-[85vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">📚 BAPTISTRY Books</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            {/* Anchored Series */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-5 border-l-4 border-blue-500 pl-3">
                ⚓ The Anchored Series
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {anchoredSeries.map((book) => (
                  <div key={book.number} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center hover:shadow-lg transition-shadow">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full aspect-[2/3] object-contain rounded-lg mb-2 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedBook({
                        ...book,
                        series: "The Anchored Series",
                        author: "Dennis Lastimoso"
                      })}
                    />
                    <p className="text-xs font-medium text-gray-800 dark:text-white">Book {book.number}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{book.title}</p>
                    <button
                      onClick={() => handleFlipbook(book.flipbookLink, book.title)}
                      className="w-full text-xs bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition-colors"
                    >
                      📖 Preview
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ignited Series */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-5 border-l-4 border-blue-500 pl-3">
                🔥 The Ignited Series
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {ignitedSeries.map((book) => (
                  <div key={book.number} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center hover:shadow-lg transition-shadow">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full aspect-[2/3] object-contain rounded-lg mb-2 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedBook({
                        ...book,
                        series: "The Ignited Series",
                        author: "Dennis Lastimoso"
                      })}
                    />
                    <p className="text-xs font-medium text-gray-800 dark:text-white">Book {book.number}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{book.title}</p>
                    <button
                      onClick={() => handleFlipbook(book.flipbookLink, book.title)}
                      className="w-full text-xs bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition-colors"
                    >
                      📖 Preview
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Standalone Books */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-5 border-l-4 border-blue-500 pl-3">
                📘 Standalone Books
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {standaloneBooks.map((book) => (
                  <div key={book.title} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center hover:shadow-lg transition-shadow">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full aspect-[2/3] object-contain rounded-lg mb-2 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedBook({
                        ...book,
                        series: "Standalone",
                        author: "Dennis Lastimoso"
                      })}
                    />
                    <p className="text-xs font-medium text-gray-800 dark:text-white line-clamp-2 mb-2">{book.title}</p>
                    <button
                      onClick={() => handleFlipbook(book.flipbookLink, book.title)}
                      className="w-full text-xs bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition-colors"
                    >
                      📖 Preview
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Options Footer */}
            <div className="mt-8 p-5 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <p className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                📚 Grab your copy here:
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="https://www.amazon.com/author/dennislastimoso" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Amazon</a>
                <span className="text-gray-400">•</span>
                <span
                  onClick={() => setShowEmailModal(true)}
                  className="link-unified"
                >
                  Email us
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-3 italic">
                Thank you for supporting BAPTISTRY ministry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BookDetailModal - Rendered with a class for detection */}
      <div className="book-detail-modal">
        <BookDetailModal
          isOpen={selectedBook !== null}
          onClose={() => setSelectedBook(null)}
          book={selectedBook}
        />
      </div>

      <EmailContactModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        email="always.begin.with.god@gmail.com"
      />
    </>
  );
}