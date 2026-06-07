'use client';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LibraryModal({ isOpen, onClose }: LibraryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">📖 Reference Library</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Doctrinal Defense */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">📖 Doctrinal Defense</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.wayoflife.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Way of Life Literature</a></li>
                <li><a href="https://www.independentbaptist.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Independent Baptist Portal</a></li>
              </ul>
            </div>

            {/* Word Studies */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">🔍 Word Studies</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.theword.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">The Word</a></li>
                <li><a href="https://blueletterbible.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Blue Letter Bible</a></li>
                <li><a href="https://webstersdictionary1828.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Webster's 1828 Dictionary</a></li>
                <li><a href="https://kingjamesbibledictionary.com/Dictionary/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">King James Bible Dictionary</a></li>
              </ul>
            </div>

            {/* Commentaries & Sermons */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">✝️ Commentaries & Sermons</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://spurgeongems.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Spurgeon Gems</a></li>
                <li><a href="https://www.sermonnotebook.org/ntsermons.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sermon Notebook</a></li>
                <li><a href="https://www.sermonindex.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sermon Index Library</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}