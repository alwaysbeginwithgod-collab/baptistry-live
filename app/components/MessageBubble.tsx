'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface MessageBubbleProps {
  message: Message;
  onFeedback?: (messageId: string, feedback: 'helpful' | 'unhelpful') => void;
}

export default function MessageBubble({ message, onFeedback }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [feedbackGiven, setFeedbackGiven] = useState<'helpful' | 'unhelpful' | null>(null);

  const cleanContent = (content: string) => {
    return content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  };

  const cleanedContent = cleanContent(message.content);

  const handleFeedback = (type: 'helpful' | 'unhelpful') => {
    if (feedbackGiven) return;
    setFeedbackGiven(type);
    if (onFeedback) {
      onFeedback(message.id, type);
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for BAPTISTRY only (assistant messages) */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
            <img 
              src="/baptistry-logo.png" 
              alt="BAPTISTRY"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div className={`max-w-3xl ${isUser ? 'order-1' : ''}`}>
        <div
          className={`
            rounded-2xl px-5 py-3 shadow-sm
            ${isUser 
              ? 'bg-blue-600 text-white rounded-br-sm' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200'
            }
          `}
        >
          {isUser ? (
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {cleanedContent}
            </div>
          ) : (
            <>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-3 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-md font-semibold mt-2 mb-1" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                    hr: ({node, ...props}) => <hr className="my-4 border-gray-300 dark:border-gray-700" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-400 pl-4 italic my-3" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  }}
                >
                  {cleanedContent}
                </ReactMarkdown>
              </div>

              {/* Footer Note */}
              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                  *AI-generated for educational purposes only. The Bible is the final authority in all our knowledge.
                </p>
              </div>

              {/* Feedback Buttons */}
              <div className="mt-2 flex justify-end gap-3">
                <button
                  onClick={() => handleFeedback('helpful')}
                  disabled={feedbackGiven !== null}
                  className={`text-xs flex items-center gap-1 transition-colors ${
                    feedbackGiven === 'helpful'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                  } ${feedbackGiven !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Helpful"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>Helpful</span>
                </button>
                <button
                  onClick={() => handleFeedback('unhelpful')}
                  disabled={feedbackGiven !== null}
                  className={`text-xs flex items-center gap-1 transition-colors ${
                    feedbackGiven === 'unhelpful'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                  } ${feedbackGiven !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Not helpful"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13v-9m-7 10h2M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                  <span>Not helpful</span>
                </button>
              </div>
            </>
          )}
          <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}