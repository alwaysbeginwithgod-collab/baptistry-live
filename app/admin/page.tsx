'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [title, setTitle] = useState('🚀 New Feature');
  const [message, setMessage] = useState('A new feature or update is now available!');
  const [status, setStatus] = useState('');

  const addUpdate = () => {
    if (typeof window !== 'undefined' && (window as any).addBaptistryUpdate) {
      (window as any).addBaptistryUpdate(title, message);
      setStatus('✅ Update notification added! Check the bell icon.');
      setTimeout(() => setStatus(''), 3000);
    } else {
      setStatus('❌ Please go to the main page (http://localhost:3001) first, then come back.');
    }
  };

  const setPreset = (preset: string) => {
    if (preset === 'feature') {
      setTitle('🚀 New Feature');
      setMessage('An exciting new feature has been added to BAPTISTRY!');
    } else if (preset === 'books') {
      setTitle('📚 New Books Added');
      setMessage('New devotion books are now available in the Books Showroom.');
    } else if (preset === 'improvement') {
      setTitle('⚡ Improvement');
      setMessage('Performance and user experience improvements have been made.');
    } else if (preset === 'bug') {
      setTitle('🔧 Bug Fix');
      setMessage('Issues have been resolved for a smoother experience.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">🚀 Add BAPTISTRY Update</h1>
        
        {/* Quick Presets */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quick Templates
          </label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setPreset('feature')} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300">🚀 New Feature</button>
            <button onClick={() => setPreset('books')} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300">📚 New Books</button>
            <button onClick={() => setPreset('improvement')} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300">⚡ Improvement</button>
            <button onClick={() => setPreset('bug')} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300">🔧 Bug Fix</button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Update Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Update Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <button
            onClick={addUpdate}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🚀 Add Update Notification
          </button>
          
          {status && (
            <div className={`text-center text-sm p-2 rounded ${status.includes('✅') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {status}
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Main page: <strong>http://localhost:3001</strong>
        </p>
      </div>
    </div>
  );
}