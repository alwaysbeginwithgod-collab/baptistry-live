// Refresh: 2026-08-10

'use client';

import { useState, useEffect, useRef } from 'react';
import { getDailyPromise } from '../admin/biblePromises';
import BooksModal from './BooksModal';
import SupportModal from './SupportModal';
import AboutModal from './AboutModal';
import DevotionModal from './DevotionModal';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onReturnToWelcome: () => void;
  conversations: Array<{ id: string; content: string; timestamp: Date; pinned?: boolean }>;
  onLoadConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onPinConversation?: (id: string) => void;
  currentConversationId: string | null;
}

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  onNewChat, 
  onReturnToWelcome,
  conversations, 
  onLoadConversation,
  onRenameConversation,
  onDeleteConversation,
  onPinConversation,
  currentConversationId 
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBooksOpen, setIsBooksOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const [bibleVerse, setBibleVerse] = useState({ reference: '', text: '' });
  const [isDevotionOpen, setIsDevotionOpen] = useState(false);

  const { darkMode } = useTheme();
  const yellowColor = darkMode ? '#D4A017' : '#D4A017';
  const yellowGlow = darkMode ? 'rgba(212, 160, 23, 0.3)' : 'rgba(212, 160, 23, 0.3)';

  const buttonBaseClass = "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const supportButtonClass = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-blue-600 dark:border-blue-500 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full";
  const newChatButtonClass = "w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

  const filteredConversations = conversations.filter(conv =>
    conv.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setBibleVerse(getDailyPromise());
  }, []);

  // ✅ Listen for "openDevotion" event from NotificationBell
  useEffect(() => {
    const handleOpenDevotion = () => {
      console.log('📖 openDevotion event received in Sidebar');
      setIsDevotionOpen(true);
    };
    window.addEventListener('openDevotion' as any, handleOpenDevotion);
    return () => {
      window.removeEventListener('openDevotion' as any, handleOpenDevotion);
    };
  }, []);

  // ✅ Listen for "openBooks" event from MainContent
  useEffect(() => {
    const handleOpenBooks = () => {
      console.log('📚 openBooks event received in Sidebar');
      setIsBooksOpen(true);
    };
    window.addEventListener('openBooks' as any, handleOpenBooks);
    return () => {
      window.removeEventListener('openBooks' as any, handleOpenBooks);
    };
  }, []);

  // ✅ Menu escape and click outside handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpenId) {
        setMenuOpenId(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpenId && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };

    if (menuOpenId) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpenId]);

  const startRename = (conv: { id: string; content: string }) => {
    setEditingId(conv.id);
    setEditingTitle(conv.content);
    setMenuOpenId(null);
  };

  const saveRename = () => {
    if (editingId && editingTitle.trim()) {
      onRenameConversation(editingId, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveRename();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditingTitle('');
    }
  };

  const handleDelete = (id: string) => {
    onDeleteConversation(id);
    setMenuOpenId(null);
  };

  const handlePin = (id: string) => {
    if (onPinConversation) {
      onPinConversation(id);
    }
    setMenuOpenId(null);
  };

  const handleMenuToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  // ============================================================
  // ✅ IMPROVED: Handle conversation click with debugging
  // ============================================================
  const handleConversationClick = (convId: string) => {
    console.log('🖱️ Sidebar: Clicked conversation:', convId);
    console.log('🖱️ Current conversations in sidebar:', conversations.length);
    
    // Find the conversation to verify it exists
    const found = conversations.find(c => c.id === convId);
    console.log('🖱️ Found in sidebar state:', found ? 'Yes' : 'No');
    
    if (found) {
      console.log('🖱️ Conversation title:', found.content);
      // ✅ REMOVED: messages doesn't exist in sidebar conversations
      // console.log('🖱️ Messages count:', found.messages?.length || 'N/A');
    }
    
    // Call the parent's load function
    onLoadConversation(convId);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside 
        className={`
          fixed lg:relative z-30 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:translate-x-0
        `}
      >
        <div 
          onClick={onReturnToWelcome}
          className="p-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src="/baptistry-logo.png" 
                alt="BAPTISTRY Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 
                className="text-2xl font-bold transition-colors"
                style={{ 
                  color: yellowColor,
                  textShadow: `0 0 20px ${yellowGlow}`
                }}
              >
                BAPTISTRY
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your Bible Study Tool</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-2 pt-4">
          <div className="space-y-1">
            <button
              onClick={() => window.open('https://kingjamesbibleonline.org', '_blank')}
              className={buttonBaseClass}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span>Bible</span>
            </button>

            {/* About Button */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className={buttonBaseClass}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>About</span>
            </button>

            <button
              onClick={() => setIsBooksOpen(true)}
              className={buttonBaseClass}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h7c3.5 0 6-2.5 6-6m0 0h2a2 2 0 012 2v8a2 2 0 01-2 2h-2m-6-8h7c3.5 0 6-2.5 6-6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16h7c3.5 0 6 2.5 6 6m0 0h2a2 2 0 002-2v-8a2 2 0 00-2-2h-2" />
              </svg>
              <span>My Books</span>
            </button>
          </div>

          {/* Daily Devotion Button */}
          <button
            onClick={() => setIsDevotionOpen(true)}
            className={`${buttonBaseClass} mt-1`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span>Daily Devotion</span>
          </button>

          <div className="mt-2 text-center">
            <button
              onClick={() => setIsSupportOpen(true)}
              className={supportButtonClass}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" />
              </svg>
              Support BAPTISTRY
            </button>
          </div>
        </div>

        <div className="px-4 pb-4">
          <button onClick={onNewChat} className={newChatButtonClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Chat
          </button>
        </div>

        <div className="px-4 pb-4">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">CHAT HISTORY</div>
          {filteredConversations.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No conversations yet</div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conv) => {
                const isPinned = conv.pinned === true;
                return (
                  <div key={conv.id} className={`group relative rounded-lg transition-colors ${currentConversationId === conv.id ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    {isPinned && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <div className="bg-yellow-500 rounded-full p-0.5 shadow-sm">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {editingId === conv.id ? (
                      <input 
                        type="text" 
                        value={editingTitle} 
                        onChange={(e) => setEditingTitle(e.target.value)} 
                        onBlur={saveRename} 
                        onKeyDown={handleKeyDown} 
                        className="w-full px-3 py-2 text-sm border border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                        autoFocus 
                      />
                    ) : (
                      <div 
                        // ✅ IMPROVED: Use the new handler with debugging
                        onClick={() => handleConversationClick(conv.id)} 
                        className="flex items-center justify-between px-3 py-2 cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium group-hover:text-gray-900 dark:group-hover:text-white">
                            {conv.content}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 group-hover:text-gray-700 dark:group-hover:text-white">
                            {new Date(conv.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => handleMenuToggle(conv.id, e)} 
                          className="flex-shrink-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    {menuOpenId === conv.id && (
                      <div ref={menuRef} className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1 overflow-hidden">
                        <button onClick={() => startRename(conv)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Rename</span>
                        </button>
                        {onPinConversation && (
                          <button onClick={() => handlePin(conv.id)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {isPinned ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.5 3H5.5A1.5 1.5 0 004 4.5v15A1.5 1.5 0 005.5 21h9a1.5 1.5 0 001.5-1.5v-12L12 3z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              )}
                            </svg>
                            <span>{isPinned ? 'Unpin' : 'Pin'}</span>
                          </button>
                        )}
                        <button onClick={() => handleDelete(conv.id)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors duration-150">
                          <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {bibleVerse.text && (
            <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 text-center font-medium">📖 Daily Bible Promise</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center italic mt-1">"{bibleVerse.text}"</p>
              <p className="text-xs text-blue-500 dark:text-blue-500 text-center mt-1">— {bibleVerse.reference} (KJV)</p>
            </div>
          )}
        </div>
      </aside>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <BooksModal isOpen={isBooksOpen} onClose={() => setIsBooksOpen(false)} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      <DevotionModal isOpen={isDevotionOpen} onClose={() => setIsDevotionOpen(false)} />
    </>
  );
}