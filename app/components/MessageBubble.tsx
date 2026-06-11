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
  onFeedback?: (messageId: string, feedback: 'helpful' | 'unhelpful' | null) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  feedbackStatus?: 'helpful' | 'unhelpful' | null;
}

export default function MessageBubble({ message, onFeedback, onEdit, onRegenerate, feedbackStatus }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.content);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  const cleanContent = (content: string) => {
    return content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  };

  const cleanedContent = cleanContent(message.content);

const handleFeedback = (type: 'helpful' | 'unhelpful') => {
  console.log('=== THUMBS CLICKED ===');
  console.log('Type clicked:', type);
  console.log('Current feedbackStatus from parent:', feedbackStatus);
  console.log('onFeedback exists?', !!onFeedback);
  
  if (!onFeedback) return;
  
  let newFeedback: 'helpful' | 'unhelpful' | null = type;
  if (feedbackStatus === type) {
    newFeedback = null;
    console.log('Unselecting - newFeedback will be null');
  }
  
  console.log('Calling onFeedback with:', message.id, newFeedback);
  onFeedback(message.id, newFeedback);
};

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedText.trim() && editedText !== message.content && onEdit) {
      onEdit(message.id, editedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(message.content);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanedContent);
      setCopySuccess(true);
      setShowCopyTooltip(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowCopyTooltip(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id);
    }
  };

  const isHelpfulSelected = feedbackStatus === 'helpful';
  const isUnhelpfulSelected = feedbackStatus === 'unhelpful';

  return (
    <div id={message.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
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
          {isUser && isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                rows={4}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  Save & Resend
                </button>
                <button onClick={handleCancel} className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {isUser ? (
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {cleanedContent}
                </div>
              ) : (
                <>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>
                      {cleanedContent}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                      *AI-generated for educational purposes only. The Bible is the final authority in all matters of our faith and practice.
                    </p>
                  </div>

                  <div className="mt-2 flex justify-end gap-3">
                    {/* Copy Button */}
                    <div className="relative">
                      <button
                        onClick={handleCopy}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded transition-colors"
                        title="Copy"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                      {showCopyTooltip && (
                        <span className="absolute bottom-full right-0 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap">
                          Copied!
                        </span>
                      )}
                    </div>

                    {/* Regenerate Button */}
                    <button
                      onClick={handleRegenerate}
                      className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded transition-colors"
                      title="Regenerate"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>

                    {/* Thumbs Up */}
                    <button
                      onClick={() => handleFeedback('helpful')}
                      className={`p-1 rounded transition-colors ${isHelpfulSelected ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      title="Helpful"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </button>

                    {/* Thumbs Down */}
                    <button
                      onClick={() => handleFeedback('unhelpful')}
                      className={`p-1 rounded transition-colors ${isUnhelpfulSelected ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      title="Not helpful"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13v-9m-7 10h2M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          <div className={`text-xs mt-1 text-right ${isUser ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}