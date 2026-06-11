'use client';

import { useState } from 'react';

export default function TestThumbsPage() {
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(null);

  const handleClick = (type: 'helpful' | 'unhelpful') => {
    if (feedback === type) {
      setFeedback(null);
    } else {
      setFeedback(type);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Thumbs Test</h1>
      
      <div className="flex gap-4">
        <button
          onClick={() => handleClick('helpful')}
          className={`p-2 rounded ${feedback === 'helpful' ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </button>
        <button
          onClick={() => handleClick('unhelpful')}
          className={`p-2 rounded ${feedback === 'unhelpful' ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13v-9m-7 10h2M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
          </svg>
        </button>
      </div>
      
      <p className="mt-4">Current feedback: {feedback || 'none'}</p>
      <p>Click thumbs up - should turn yellow. Click again - should turn off.</p>
    </div>
  );
}