'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { findVerseReferences, formatVerseReference, getVerseText } from '../lib/verseUtils';
import VersePopup from './VersePopup';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTruncated?: boolean;
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
  const [versePopup, setVersePopup] = useState<{ isOpen: boolean; reference: string; verseText: string }>({
    isOpen: false,
    reference: '',
    verseText: '',
  });
  const [loadingVerse, setLoadingVerse] = useState(false);

  const cleanContent = (content: string) => {
    return content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  };

  const cleanedContent = cleanContent(message.content);

  // ============================================================
  // 📖 Handle verse click - fetch and show verse
  // ============================================================
  const handleVerseClick = async (book: string, chapter: number, verse: number, verseEnd?: number) => {
    const reference = formatVerseReference(book, chapter, verse, verseEnd);
    setLoadingVerse(true);
    
    try {
      const verseText = await getVerseText(reference);
      setVersePopup({
        isOpen: true,
        reference: reference,
        verseText: verseText,
      });
    } catch (error) {
      console.error('Error fetching verse:', error);
    } finally {
      setLoadingVerse(false);
    }
  };

  // ============================================================
  // 📝 Render message with verse hyperlinks
  // ============================================================
  const renderMessageWithLinks = (text: string) => {
    if (!text || isUser) return text;
    
    // Find all verse references
    const references = findVerseReferences(text);
    
    if (references.length === 0) {
      return text;
    }
    
    // Build the message with links
    const parts = [];
    let lastIndex = 0;
    
    for (const ref of references) {
      // Add text before the reference
      if (ref.startIndex > lastIndex) {
        parts.push(text.substring(lastIndex, ref.startIndex));
      }
      
      // Add the linked reference
      let displayText = ref.fullText;
      
      parts.push(
        <button
          key={`${ref.book}-${ref.chapter}-${ref.verse}-${ref.startIndex}`}
          onClick={() => handleVerseClick(ref.book, ref.chapter, ref.verse, ref.verseEnd)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium cursor-pointer transition-colors"
          title={`Open ${formatVerseReference(ref.book, ref.chapter, ref.verse, ref.verseEnd)} in Bible`}
        >
          {displayText}
        </button>
      );
      
      lastIndex = ref.endIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  };

  const handleFeedback = (type: 'helpful' | 'unhelpful') => {
    if (!onFeedback) return;
    let newFeedback: 'helpful' | 'unhelpful' | null = type;
    if (feedbackStatus === type) {
      newFeedback = null;
    }
    onFeedback(message.id, newFeedback);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (onEdit) {
      onEdit(message.id, editedText);
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedText(message.content);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanedContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
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
    <>
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
                  <button 
                    onClick={handleSaveClick} 
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Save & Resend
                  </button>
                  <button 
                    onClick={handleCancelClick} 
                    className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm"
                  >
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
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({node, ...props}) => (
                            <div className="overflow-x-auto my-4">
                              <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm" {...props} />
                            </div>
                          ),
                          thead: ({node, ...props}) => (
                            <thead className="bg-gray-100 dark:bg-gray-700" {...props} />
                          ),
                          tbody: ({node, ...props}) => (
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props} />
                          ),
                          th: ({node, ...props}) => (
                            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white" {...props} />
                          ),
                          td: ({node, ...props}) => (
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300" {...props} />
                          ),
                          tr: ({node, ...props}) => (
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" {...props} />
                          ),
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-3 mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-md font-semibold mt-2 mb-1" {...props} />,
                          h4: ({node, ...props}) => <h4 className="text-sm font-semibold mt-2 mb-1" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                          em: ({node, ...props}) => <em className="italic" {...props} />,
                          hr: ({node, ...props}) => <hr className="my-4 border-gray-300 dark:border-gray-700" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-400 pl-4 italic my-3" {...props} />,
                          a: ({node, ...props}) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                          // ✅ Override default paragraph to handle verse links (only one p definition)
                          p: ({node, children, ...props}) => {
                            // Get the text content from children
                            let textContent = '';
                            if (typeof children === 'string') {
                              textContent = children;
                            } else if (Array.isArray(children)) {
                              textContent = children.map(c => typeof c === 'string' ? c : '').join('');
                            }
                            
                            // If no text content or user message, render normally
                            if (!textContent || isUser) {
                              return <p className="mb-3 leading-relaxed" {...props}>{children}</p>;
                            }
                            
                            // Render with verse links
                            const linkedContent = renderMessageWithLinks(textContent);
                            return <p className="mb-3 leading-relaxed" {...props}>{linkedContent}</p>;
                          },
                        }}
                      >
                        {cleanedContent}
                      </ReactMarkdown>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                        *AI-generated for educational purposes only. The Bible is the final authority in all matters of our faith and practice.
                      </p>
                    </div>

                    <div className="mt-2 flex justify-start gap-3">
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
                        {copySuccess && (
                          <span className="absolute bottom-full right-0 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                      </div>

                      <button
                        onClick={handleRegenerate}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded transition-colors"
                        title="Regenerate"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleFeedback('helpful')}
                        className={`p-1 rounded transition-all ${
                          isHelpfulSelected 
                            ? 'ring-2 ring-yellow-500 bg-yellow-500/20 text-yellow-500' 
                            : 'text-gray-400 hover:ring-2 hover:ring-yellow-500 hover:bg-yellow-500/10'
                        }`}
                        title="Helpful"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleFeedback('unhelpful')}
                        className={`p-1 rounded transition-all ${
                          isUnhelpfulSelected 
                            ? 'ring-2 ring-yellow-500 bg-yellow-500/20 text-yellow-500'  
                            : 'text-gray-400 hover:ring-2 hover:ring-yellow-500 hover:bg-yellow-500/10'
                        }`}
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

            <div className={`text-xs mt-1 text-left ${isUser ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
              <span>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              {isUser && onEdit && !isEditing && (
                <div className="flex gap-2 items-center">
                  <div className="relative group">
                    <button
                      onClick={handleCopy}
                      className="text-blue-200 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-0.5 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      Copy
                    </span>
                    {copySuccess && (
                      <span className="absolute bottom-full right-0 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </div>

                  <div className="relative group">
                    <button
                      onClick={handleEditClick}
                      className="text-blue-200 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-0.5 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      Edit
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📖 Verse Popup */}
      <VersePopup
        isOpen={versePopup.isOpen}
        onClose={() => setVersePopup({ isOpen: false, reference: '', verseText: '' })}
        reference={versePopup.reference}
        verseText={versePopup.verseText}
      />

      {/* ⏳ Loading indicator for verse */}
      {loadingVerse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Loading verse...</span>
          </div>
        </div>
      )}
    </>
  );
}