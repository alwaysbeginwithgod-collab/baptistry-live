'use client';

import { useState, useEffect } from 'react';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    const savedFeedback = localStorage.getItem('baptistry_feedback');
    if (savedFeedback) {
      setFeedback(JSON.parse(savedFeedback));
    }
  }, []);

  const helpfulCount = feedback.filter(f => f.feedback === 'helpful').length;
  const unhelpfulCount = feedback.filter(f => f.feedback === 'unhelpful').length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">BAPTISTRY Feedback Dashboard</h1>
      
      <div className="flex gap-4 mb-8">
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{helpfulCount}</p>
          <p className="text-sm">Helpful responses</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{unhelpfulCount}</p>
          <p className="text-sm">Unhelpful responses</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{feedback.length}</p>
          <p className="text-sm">Total feedback</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold mb-3">Recent Feedback</h2>
        {feedback.slice().reverse().slice(0, 50).map((item, idx) => (
          <div key={idx} className="border p-3 rounded-lg">
            <p className="text-sm">
              <span className={`font-semibold ${item.feedback === 'helpful' ? 'text-green-600' : 'text-red-600'}`}>
                {item.feedback === 'helpful' ? '👍 Helpful' : '👎 Not helpful'}
              </span>
              <span className="text-gray-400 text-xs ml-3">{new Date(item.timestamp).toLocaleString()}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Message ID: {item.messageId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}