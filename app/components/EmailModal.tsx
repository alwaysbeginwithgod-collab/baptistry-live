'use client';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function EmailModal({ isOpen, onClose, email }: EmailModalProps) {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    alert('Email address copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📧 Contact Us</h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Click the button below to copy our email address:
        </p>
        
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <code className="text-blue-600 dark:text-blue-400 font-mono text-sm break-all">
            {email}
          </code>
        </div>
        
        <button
          onClick={handleCopy}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          📋 Copy Email Address
        </button>
        
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          Then paste it into your email app (Gmail, Outlook, etc.)
        </p>
      </div>
    </div>
  );
}