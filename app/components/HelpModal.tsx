'use client';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">How to Use BAPTISTRY</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">💬 Ask Questions</h3>
            <p className="text-gray-600 dark:text-gray-400">Type your question about Scripture, doctrine, or Christian living in the chat box. BAPTISTRY will respond with biblical answers from the King James Version.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">📖 Request Devotions</h3>
            <p className="text-gray-600 dark:text-gray-400">Ask for a devotion on any topic (e.g., "Give me a devotion about grace"). BAPTISTRY will create a new devotion following the 8-section structure.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">📝 Create Sermon Outlines</h3>
            <p className="text-gray-600 dark:text-gray-400">Request a sermon outline (e.g., "Create a preaching about sin") to get a structured expository sermon outline.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">📚 Study Tools</h3>
            <p className="text-gray-600 dark:text-gray-400">Use the right sidebar to access Bible lookup, dictionary, and reference library.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">🔄 Chat History</h3>
            <p className="text-gray-600 dark:text-gray-400">Your conversations are saved in the left sidebar. You can rename, delete, or pin important chats using the three-dot menu.</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">📖 All answers are based on the King James Version (KJV) and historic Baptist doctrine.</p>
          </div>
        </div>
      </div>
    </div>
  );
}