'use client';

import { useState } from 'react';
import BookDetailModal from './BookDetailModal';
import EmailContactModal from './EmailContactModal';

interface BooksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BooksModal({ isOpen, onClose }: BooksModalProps) {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  if (!isOpen) return null;

  // ============================================
  // BOOK DATA
  // ============================================

  const anchoredSeries = [
    { 
      number: 1, 
      title: "Anchored in Identity", 
      cover: "/books/anchored-1-identity.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/ihaa/",
      amazonLink: "https://www.amazon.com/dp/6210632734",
      tagline: "Know who you are in Christ, and never question your worth again.",
      description: "A 30-day devotional journey to help you discover your true identity in Christ."
    },
    { 
      number: 2, 
      title: "Anchored in Battles", 
      cover: "/books/anchored-2-battles.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/dpwk/",
      amazonLink: "https://www.amazon.com/dp/6210634095",
      tagline: "Know your battles, be a conqueror, and never live defeated again.",
      description: "Learn to stand firm in spiritual warfare and emerge victorious through Christ."
    },
    { 
      number: 3, 
      title: "Anchored in Hope", 
      cover: "/books/anchored-3-hope.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/ucgn/",
      amazonLink: "https://www.amazon.com/dp/6210636713",
      tagline: "Drop your anchor in Christ alone, and never face hopelessness again.",
      description: "Find lasting hope that transcends circumstances and anchors your soul in God's promises."
    },
    { 
      number: 4, 
      title: "Anchored in Purpose", 
      cover: "/books/anchored-4-purpose.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/pokz/",
      amazonLink: "https://www.amazon.com/dp/6210639925",
      tagline: "Anchor your life to His greater plan, and never live wandering again.",
      description: "Discover God's unique calling for your life and walk confidently in His purpose."
    },
    { 
      number: 5, 
      title: "Anchored in Faithfulness", 
      cover: "/books/anchored-5-faithfulness.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/ypbi/",
      amazonLink: "https://www.amazon.com/dp/6210642268",
      tagline: "Hold fast to His faithfulness each day, and never doubt again.",
      description: "Build an unshakeable faith rooted in the person and work of Jesus Christ."
    },
    { 
      number: 6, 
      title: "Anchored in Christ", 
      cover: "/books/anchored-6-christ.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/nxfy/",
      amazonLink: "https://www.amazon.com/dp/6210647286",
      tagline: "Abide faithfully in the risen Christ, and never live in uncertainty again.",
      description: "Deepen your abiding relationship with Christ and experience His peace."
    },
  ];

  const ignitedSeries = [
    { 
      number: 1, 
      title: "Ignited By Grace", 
      cover: "/books/ignited-1-grace.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/Book-6---Anchored-in-Christ/",
      amazonLink: "https://www.amazon.com/dp/6210648185",
      tagline: "Be transformed by His grace, and never live unchanged again.",
      description: "Experience the life-transforming power of God's grace in your daily walk."
    },
    { 
      number: 2, 
      title: "Ignited By Truth", 
      cover: "/books/ignited-2-truth.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/Ignited-By-Grace/",
      amazonLink: "https://www.amazon.com/dp/6210649963",
      tagline: "Stand firm in God's truth, and never be troubled by lies again.",
      description: "Ground yourself in biblical truth and resist the deception of the enemy."
    },
    { 
      number: 3, 
      title: "Ignited By Prayer", 
      cover: "/books/ignited-3-prayer.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/Book-2---Ignited-By-Truth/",
      amazonLink: "https://www.amazon.com/dp/6210658334",
      tagline: "Seek God with burning hunger within, and never return to weak prayers again.",
      description: "Revitalize your prayer life and experience deeper communion with God."
    },
    { 
      number: 4, 
      title: "Ignited By Faith", 
      cover: "/books/ignited-4-faith.jpg", 
      flipbookLink: "#",
      amazonLink: "https://www.amazon.com/dp/6210660819",
      tagline: "Walk boldly with God, and never doubt His promises again.",
      description: "Cultivate bold, active faith that moves mountains and pleases God."
    },
    { 
      number: 5, 
      title: "Ignited By Promises", 
      cover: "/books/ignited-5-promises.jpg", 
      flipbookLink: "#",
      amazonLink: "https://www.amazon.com/dp/YOUR_AMAZON_LINK",
      tagline: "Claim God's promises, and never live in fear again.",
      description: "Stand on the solid ground of God's unfailing promises."
    },
    { 
      number: 6, 
      title: "Ignited For Mission", 
      cover: "/books/ignited-6-mission.jpg", 
      flipbookLink: "#",
      amazonLink: "https://www.amazon.com/dp/YOUR_AMAZON_LINK",
      tagline: "Go and make disciples, and never be silent again.",
      description: "Embrace your calling to share the gospel and make an eternal impact."
    },
  ];

  const standaloneBooks = [
    { 
      title: "FireProof Christian", 
      cover: "/books/standalone-fireproof.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/pmky/",
      amazonLink: "https://www.amazon.com/dp/6210645585",
      tagline: "Building a faith that endures every trial.",
      description: "A powerful guide to developing a resilient, unshakeable faith that withstands life's fiercest storms."
    },
    { 
      title: "The Worth Pace", 
      cover: "/books/standalone-worth-pace.jpg", 
      flipbookLink: "https://online.fliphtml5.com/xmsuz/ouak/",
      amazonLink: "https://www.amazon.com/dp/6210653464",
      tagline: "Understanding your true value in God's eyes.",
      description: "Discover your immeasurable worth as a child of God and live confidently in His love."
    },
    { 
      title: "The Shadows of Emmanuel", 
      cover: "/books/standalone-shadows-emmanuel.jpg", 
      flipbookLink: "#",
      amazonLink: "https://www.amazon.com/dp/YOUR_AMAZON_LINK",
      tagline: "Finding hope in the darkest valleys.",
      description: "Encounter God's presence in the midst of suffering and find light in the shadows."
    },
  ];

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
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-7xl mx-4 max-h-[85vh] overflow-y-auto">
          {/* Header */}
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
                        author: "Dennis Lastimoso",
                        amazonLink: book.amazonLink
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
                        author: "Dennis Lastimoso",
                        amazonLink: book.amazonLink
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
                        author: "Dennis Lastimoso",
                        amazonLink: book.amazonLink
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

      {/* Book Detail Modal */}
      <BookDetailModal 
        isOpen={selectedBook !== null} 
        onClose={() => setSelectedBook(null)} 
        book={selectedBook}
      />

      {/* Email Contact Modal */}
      <EmailContactModal 
        isOpen={showEmailModal} 
        onClose={() => setShowEmailModal(false)} 
        email="always.begin.with.god@gmail.com"
      />
    </>
  );
}