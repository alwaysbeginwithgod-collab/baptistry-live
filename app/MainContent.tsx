'use client';

import RightSidebar from './components/RightSidebar';
import { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import NameModal from './components/NameModal';
import { useTheme } from './context/ThemeContext';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  pinned?: boolean;
};

// Expanded list of dynamic suggestions
const SUGGESTIONS = [
  { text: "What do you believe about salvation?" },
  { text: "Give me a devotion about grace" },
  { text: "Create a preaching about sin" },
  { text: "Explain John 3:16" },
  { text: "Does the Bible forbid us to pray to Mary?" },
  { text: "What is the unpardonable sin?" },
  { text: "Who was created first, Satan or Adam?" },
  { text: "What is the fruit of the Spirit?" },
  { text: "Give me a devotion about forgiveness" },
  { text: "Does the Bible forbid us to drink alcohol?" },
  { text: "Explain the book of Revelation" },
  { text: "What is the Gospel according to Paul?" },
  { text: "Give me a preaching about love" },
  { text: "What does the Bible say about suffering?" },
  { text: "Explain the Trinity" },
  { text: "Give me a devotion about hope" },
  { text: "What is the meaning of baptism?" },
  { text: "Explain the Lord's Prayer" },
  { text: "What is the 'Mark of the Beast' in Revelation?" },
  { text: "Is speaking in tongues still meant for today?" },
];

export default function MainContent() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;
  const { darkMode } = useTheme();

  // Convex hooks
  const saveConversationsToCloud = useMutation(api.conversations.saveConversations);
  const loadConversationsFromCloud = useQuery(
    api.conversations.loadConversations,
    userId ? { userId } : "skip"
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messageFeedback, setMessageFeedback] = useState<Record<string, 'helpful' | 'unhelpful' | null>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stopRequested = useRef(false);
  
  // ============================================================
  // DYNAMIC SUGGESTIONS STATE - Staggered updates
  // ============================================================
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [updateIndex, setUpdateIndex] = useState<number>(0);
  const [fadingIndex, setFadingIndex] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================
  // NAME MODAL STATE
  // ============================================================
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottomImmediate = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    autoResizeTextarea();
  };

  // ============================================================
  // DYNAMIC SUGGESTIONS - Staggered updates one at a time with fade
  // ============================================================
  
  // Get 4 random suggestions
  const getRandomSuggestions = useCallback(() => {
    const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4).map(s => s.text);
  }, []);

  // Update a single suggestion at the current index with fade effect
  const updateSingleSuggestion = useCallback(() => {
    // First, trigger fade out on the current index
    setFadingIndex(updateIndex);
    
    // After a short delay, update the text and trigger fade in
    setTimeout(() => {
      setCurrentSuggestions(prev => {
        if (prev.length === 0) {
          return getRandomSuggestions();
        }
        
        // Get a new random suggestion not currently in the list
        const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
        let newSuggestion = '';
        
        for (const s of shuffled) {
          if (!prev.includes(s.text)) {
            newSuggestion = s.text;
            break;
          }
        }
        
        if (!newSuggestion) {
          newSuggestion = shuffled[0].text;
        }
        
        // Create new array with only the current index updated
        const newSuggestions = [...prev];
        newSuggestions[updateIndex] = newSuggestion;
        
        return newSuggestions;
      });
      
      // Clear the fading index after text update
      setFadingIndex(null);
    }, 300); // Half the duration of the CSS transition
    
    // Move to the next position (0, 1, 2, 3, then back to 0)
    setUpdateIndex(prev => (prev + 1) % 4);
  }, [updateIndex, getRandomSuggestions]);

  // Initialize and start cycling suggestions
  useEffect(() => {
    // Only run when there are no messages (welcome screen)
    if (messages.length === 0 && !isGenerating) {
      // Set initial suggestions
      if (currentSuggestions.length === 0) {
        setCurrentSuggestions(getRandomSuggestions());
      }
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set up interval to update ONE suggestion every 3 seconds
      intervalRef.current = setInterval(updateSingleSuggestion, 3000);
    } else {
      // Clear interval when not on welcome screen
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [messages.length, isGenerating, currentSuggestions.length, getRandomSuggestions, updateSingleSuggestion]);

  // ... (keep all your existing functions: load conversations, sendMessage, etc.)

  // UNIFORM button class for "Try asking" buttons - matching header style with fade transition
  const tryAskingButtonClass = (index: number) => {
    const isFading = fadingIndex === index;
    return `block w-full text-left text-sm text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      isFading ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
    }`;
  };

  // The return statement with the updated buttons
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onReturnToWelcome={handleReturnToWelcome}
        conversations={sidebarConversations}
        onLoadConversation={loadConversation}
        onRenameConversation={renameConversation}
        onDeleteConversation={deleteConversation}
        onPinConversation={pinConversation}
        currentConversationId={currentConversationId}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          messageCount={messages.length}
          messages={messages}
          onLoadMessage={scrollToMessage}
        />

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-6">
                <div className="flex justify-center mb-6">
                  <img 
                    src="/baptistry-logo.png" 
                    alt="BAPTISTRY"
                    className="w-40 h-40 object-cover rounded-full"
                  />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Hi, I'm BAPTISTRY
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-semibold">
                  Scriptures | Doctrines | Preachings | Devotions
                  <br />
                  Ask Me Anything
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 text-left border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mb-3">
                    Try asking:
                  </p>
                  <div className="space-y-2">
                    {currentSuggestions.length > 0 ? (
                      currentSuggestions.map((suggestion, index) => (
                        <button 
                          key={`${suggestion}-${index}`}
                          onClick={() => fillInput(suggestion)}
                          className={tryAskingButtonClass(index)}
                        >
                          • "{suggestion}"
                        </button>
                      ))
                    ) : (
                      // Fallback if suggestions haven't loaded yet
                      <>
                        <button 
                          onClick={() => fillInput("What do you believe about salvation?")}
                          className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          • "What do you believe about salvation?"
                        </button>
                        <button 
                          onClick={() => fillInput("Give me a devotion about grace")}
                          className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          • "Give me a devotion about grace"
                        </button>
                        <button 
                          onClick={() => fillInput("Create a preaching about sin")}
                          className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          • "Create a preaching about sin"
                        </button>
                        <button 
                          onClick={() => fillInput("Explain John 3:16")}
                          className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          • "Explain John 3:16"
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // ... rest of your message display code
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
              {/* Message display code */}
            </div>
          )}
        </div>

        {/* Footer with input */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Scripture, doctrine, or request a devotion..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isGenerating}
              />
              {isGenerating ? (
                <button
                  onClick={stopResponse}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium flex items-center gap-2 border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  ⏹️ Stop
                </button>
              ) : (
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send
                </button>
              )}
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center italic mt-3">
              "A dose of God's Word a day, will keep you going all day."
            </p>
            <p className="text-xs text-blue-500 dark:text-blue-400 text-center mt-1">
              — ALWAYS BEGIN WITH GOD —
            </p>
          </div>
        </div>
      </div>
      
      <RightSidebar />
      
      <NameModal 
        isOpen={showNameModal} 
        onSave={handleNameSave} 
      />
    </div>
  );
}