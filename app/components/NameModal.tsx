'use client';

import { useState, useEffect } from 'react';

interface NameModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
}

export default function NameModal({ isOpen, onSave }: NameModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/baptistry-logo.png" 
              alt="BAPTISTRY" 
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-500/20"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            👋 Welcome to BAPTISTRY!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            What should I call you?
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            autoFocus
          />
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Continue →
          </button>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
            Your name will be used to personalize your conversations.
          </p>
        </form>
      </div>
    </div>
  );
}'use client';

import { useState, useEffect } from 'react';

interface NameModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
}

export default function NameModal({ isOpen, onSave }: NameModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/baptistry-logo.png" 
              alt="BAPTISTRY" 
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-500/20"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            👋 Welcome to BAPTISTRY!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            What should I call you?
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            autoFocus
          />
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Continue →
          </button>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
            Your name will be used to personalize your conversations.
          </p>
        </form>
      </div>
    </div>
  );
}