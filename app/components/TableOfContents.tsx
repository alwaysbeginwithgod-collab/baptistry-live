'use client';

import { useState, useEffect, useRef } from 'react';

interface TableOfContentsProps {
  messages: Array<{ id: string; role: string; content: string; timestamp: Date }>;
  onScrollToMessage: (messageId: string) => void;
}

export default function TableOfContents({ messages, onScrollToMessage }: TableOfContentsProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter only user messages for the TOC
  const userMessages = messages.filter(m => m.role === 'user');

  // Get preview text (first 40 characters)
  const getPreview = (content: string) => {
    const cleanContent = content.replace(/["']/g, '').trim();
    return cleanContent.length > 40 ? cleanContent.substring(0, 40) + '...' : cleanContent;
  };

  // Handle mouse enter - show the panel with delay
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovering(true);
    const timeout = setTimeout(() => {
      setIsOpen(true);
    }, 150);
    setHoverTimeout(timeout);
  };

  // Handle mouse leave - hide the panel with delay
  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovering(false);
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 300);
    setHoverTimeout(timeout);
  };

  // Handle panel mouse leave
  const handlePanelMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    const timeout = setTimeout(() => {
      setIsOpen(false);
      setIsHovering(false);
    }, 200);
    setHoverTimeout(timeout);
  };

  // Handle panel mouse enter (keep it open)
  const handlePanelMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsOpen(true);
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Don't show anything if there are no user messages
  if (userMessages.length === 0) {
    return null;
  }

  return (
    <>
      {/* Dashed line indicator - RIGHT SIDE */}
      <div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`
          relative flex items-center
          transition-all duration-300 ease-in-out
          ${isHovering ? 'opacity-100' : 'opacity-80'}
        `}>
          {/* Dashed vertical line */}
          <div className="h-24 w-6 flex items-center justify-center">
            <div className={`
              h-20 w-0.5 border-r-2 border-dashed 
              ${isHovering || isOpen 
                ? 'border-blue-500 dark:border-blue-400' 
                : 'border-gray-400 dark:border-gray-500'
              }
              transition-all duration-300
            `}></div>
          </div>

          {/* "TOC" label - appears on hover */}
          <div className={`
            absolute right-3 top-1/2 -translate-y-1/2
            text-[10px] font-medium tracking-wider uppercase
            text-gray-400 dark:text-gray-500
            transition-all duration-300
            ${isHovering || isOpen ? 'opacity-100' : 'opacity-0'}
          `}>
            TOC
          </div>

          {/* Small indicator dots along the line */}
          <div className="absolute right-3 top-1/4 w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute right-3 top-2/4 w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
          <div className="absolute right-3 top-3/4 w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
        </div>
      </div>

      {/* Floating panel - slides out from RIGHT */}
      <div
        ref={panelRef}
        onMouseEnter={handlePanelMouseEnter}
        onMouseLeave={handlePanelMouseLeave}
        className={`
          fixed right-0 top-1/2 -translate-y-1/2
          w-80 max-h-[70vh] overflow-y-auto
          bg-white dark:bg-gray-800
          rounded-l-xl shadow-2xl
          border border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
        `}
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), -4px 0 20px rgba(0,0,0,0.05)'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Conversation Topics
            <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-auto">
              {userMessages.length} {userMessages.length === 1 ? 'topic' : 'topics'}
            </span>
          </h3>
        </div>

        {/* Message list */}
        <div className="p-2">
          {userMessages.map((msg, index) => (
            <button
              key={msg.id}
              onClick={() => {
                onScrollToMessage(msg.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 group"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {getPreview(msg.content)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Click any topic to jump to that message
          </p>
        </div>
      </div>
    </>
  );
}