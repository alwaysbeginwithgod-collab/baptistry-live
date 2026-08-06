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

// ============================================================
// 📝 TYPE DEFINITIONS - What our data looks like
// ============================================================
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

// ============================================================
// 💡 SUGGESTIONS - Dynamic questions shown on welcome screen
// ============================================================
const SUGGESTIONS = [
  { text: "What is the Gospel?" },
  { text: "Explain John 3:16" },
  { text: "Explain the Trinity" },
  { text: "Explain the Lord's Prayer" },
  { text: "What is the fruit of the Spirit?" },
  { text: "What is the unpardonable sin?" },
  { text: "Explain the book of Revelation" },
  { text: "Create a preaching about love" },
  { text: "What is the meaning of baptism?" },
  { text: "Create a devotion about forgiveness" },
  { text: "Does the Bible forbid us to drink alcohol?" },
  { text: "What is the Gospel according to Paul?" },
  { text: "What does the Bible say about suffering?" },
  { text: "What do you believe about salvation?" },
  { text: "Create a devotion message about grace" },
  { text: "Create a preaching message about sin" },
  { text: "Does the Bible forbid us to pray to Mary?" },
  { text: "Who was created first, Satan or Adam?" },
  { text: "Is speaking in tongues still meant for today?" },
  { text: "What is the 'Mark of the Beast' in Revelation?" },
];

export default function MainContent() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;
  const { darkMode } = useTheme();

  // ============================================================
  // 🗄️ CONVEX HOOKS - For cloud database operations
  // ============================================================
  const saveConversationsToCloud = useMutation(api.conversations.saveConversationsClean);
  const loadConversationsFromCloud = useQuery(
    api.conversations.loadConversationsClean,
    userId ? { userId } : "skip"
  );

  // ============================================================
  // 📦 STATE VARIABLES - All the data we track
  // ============================================================
  const [messages, setMessages] = useState<Message[]>([]); // Current chat messages
  const [conversations, setConversations] = useState<Conversation[]>([]); // All saved chats
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null); // Active chat ID
  const [input, setInput] = useState(''); // Text input
  const [isGenerating, setIsGenerating] = useState(false); // Is BAPTISTRY typing?
  const [streamingText, setStreamingText] = useState(''); // Text being typed in real-time
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar visibility
  const [messageFeedback, setMessageFeedback] = useState<Record<string, 'helpful' | 'unhelpful' | null>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stopRequested = useRef(false); // For stopping generation
  
  // ============================================================
  // 🆔 DIFY CONVERSATION ID - For remembering user across sessions
  // ============================================================
  const [difyConversationId, setDifyConversationId] = useState<string | null>(null);
  
  // ============================================================
  // 🎯 DYNAMIC SUGGESTIONS - Rotating suggestions on welcome screen
  // ============================================================
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [updateIndex, setUpdateIndex] = useState<number>(0);
  const [slidingIndex, setSlidingIndex] = useState<number | null>(null);
  const [textKeys, setTextKeys] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================
  // 👤 NAME MODAL - For guest users to set their name
  // ============================================================
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState<string>('');

  // ============================================================
  // 🔄 FORCE REFRESH - For manual sync when tab becomes visible
  // ============================================================
  const [forceRefresh, setForceRefresh] = useState<number>(0);

  // ============================================================
  // 📜 SCROLL FUNCTIONS - Auto-scroll to bottom
  // ============================================================
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

  // ============================================================
  // 📝 TEXTAREA FUNCTIONS - Auto-resize input box
  // ============================================================
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
  // 👤 GET USER NAME - Always return a valid name
  // ============================================================
  const getUserName = (): string => {
    // 1. Use the state value
    if (userName) return userName;
    
    // 2. Try localStorage
    if (userId) {
      const savedName = localStorage.getItem(`baptistry_user_name_${userId}`);
      if (savedName) return savedName;
    }
    
    // 3. Try Clerk's user data
    const clerkName = user?.fullName || user?.firstName || user?.username;
    if (clerkName) return clerkName;
    
    // 4. Fallback
    return 'Friend';
  };

  // ============================================================
  // 🎯 DYNAMIC SUGGESTIONS - Rotating questions animation
  // ============================================================
  const getRandomSuggestions = useCallback(() => {
    const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4).map(s => s.text);
    return selected;
  }, []);

  const initializeTextKeys = useCallback((suggestions: string[]) => {
    const keys = suggestions.map((_, index) => `suggestion-${index}-${Date.now()}-${Math.random()}`);
    setTextKeys(keys);
  }, []);

  const updateSingleSuggestion = useCallback(() => {
    setCurrentSuggestions(prev => {
      if (prev.length === 0) {
        const newSuggestions = getRandomSuggestions();
        initializeTextKeys(newSuggestions);
        return newSuggestions;
      }
      
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
      
      const newSuggestions = [...prev];
      newSuggestions[updateIndex] = newSuggestion;
      
      setTextKeys(prevKeys => {
        const newKeys = [...prevKeys];
        newKeys[updateIndex] = `suggestion-${updateIndex}-${Date.now()}-${Math.random()}`;
        return newKeys;
      });
      
      setSlidingIndex(updateIndex);
      setTimeout(() => {
        setSlidingIndex(null);
      }, 350);
      
      return newSuggestions;
    });
    
    setUpdateIndex(prev => (prev + 1) % 4);
  }, [updateIndex, getRandomSuggestions, initializeTextKeys]);

  useEffect(() => {
    if (messages.length === 0 && !isGenerating) {
      if (currentSuggestions.length === 0) {
        const newSuggestions = getRandomSuggestions();
        setCurrentSuggestions(newSuggestions);
        initializeTextKeys(newSuggestions);
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(updateSingleSuggestion, 4000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setSlidingIndex(null);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [messages.length, isGenerating, currentSuggestions.length, getRandomSuggestions, initializeTextKeys, updateSingleSuggestion]);

  // ============================================================
  // 👤 LOAD USER NAME - From localStorage or Clerk
  // ============================================================
  useEffect(() => {
    if (userId && isLoaded) {
      const savedName = localStorage.getItem(`baptistry_user_name_${userId}`);
      console.log('🔍 userId:', userId);
      console.log('🔍 savedName from localStorage:', savedName);
      
      if (savedName) {
        setUserName(savedName);
        console.log('✅ User name loaded:', savedName);
        setShowNameModal(false);
      } else {
        const clerkName = user?.fullName || user?.firstName || user?.username;
        if (clerkName) {
          console.log('👤 Using Clerk name:', clerkName);
          setUserName(clerkName);
          localStorage.setItem(`baptistry_user_name_${userId}`, clerkName);
          setShowNameModal(false);
        } else {
          console.log('❌ No name found, showing name modal');
          setShowNameModal(true);
        }
      }
    }
  }, [userId, isLoaded, user]);

  // ============================================================
  // 💾 SAVE USER NAME - To localStorage
  // ============================================================
  const handleNameSave = (name: string) => {
    console.log('💾 Saving name:', name);
    setUserName(name);
    if (userId) {
      localStorage.setItem(`baptistry_user_name_${userId}`, name);
      console.log('✅ Name saved to localStorage for userId:', userId);
    }
    setShowNameModal(false);
  };

  // ============================================================
  // 🆔 LOAD DIFY CONVERSATION ID - From localStorage
  // ============================================================
  useEffect(() => {
    if (userId) {
      const savedConversationId = localStorage.getItem(`dify_conversation_${userId}`);
      if (savedConversationId) {
        console.log('🆔 Loaded Dify conversation ID from localStorage:', savedConversationId);
        setDifyConversationId(savedConversationId);
      }
    }
  }, [userId]);

  // ============================================================
  // 📥 LOAD CONVERSATIONS FROM CONVEX - Cloud sync
  // ============================================================
  useEffect(() => {
    console.log('🔵 LOAD EFFECT - userId:', userId, 'isLoaded:', isLoaded);
    
    if (!isLoaded) {
      console.log('⏳ Clerk still loading...');
      return;
    }
    
    if (!userId) {
      console.log('⚠️ No userId found (user not signed in)');
      setConversations([]);
      return;
    }
    
    if (loadConversationsFromCloud === undefined) {
      console.log('⏳ Waiting for Convex cloud data...');
      return;
    }
    
    const isValidCloudData = (data: any): data is Conversation[] => {
      return data !== null && data !== "skip" && Array.isArray(data);
    };
    
    if (isValidCloudData(loadConversationsFromCloud)) {
      console.log('✅ LOADING FROM CONVEX CLOUD:', loadConversationsFromCloud.length);
      
      // ✅ PROTECTION: If Convex returns empty but we have local conversations, keep local
      if (loadConversationsFromCloud.length === 0 && conversations.length > 0) {
        console.log('⚠️ Convex returned empty but we have local conversations - keeping local data');
        return;
      }
      
      // ✅ Convert numeric timestamps to Date objects
      const withDates = loadConversationsFromCloud.map((conv: any) => ({
        ...conv,
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
      }));
      
      // ✅ Update state with fresh data
      setConversations(withDates);
      
      // ✅ Update localStorage with fresh data (for backup)
      localStorage.setItem(`baptistry_conversations_${userId}`, JSON.stringify(withDates));
      console.log('✅ Updated localStorage with fresh Convex data');
      return;
    }
    
    // ✅ Fallback: If Convex returns empty, check localStorage
    console.log('🔵 Convex returned empty or undefined, checking localStorage...');
    const savedConversations = localStorage.getItem(`baptistry_conversations_${userId}`);
    if (savedConversations) {
      try {
        console.log('💾 LOADING FROM LOCALSTORAGE (fallback)');
        const parsed = JSON.parse(savedConversations);
        const withDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setConversations(withDates);
        
        // ✅ Backup to cloud (only if we have data)
        if (withDates.length > 0) {
          const conversationsForCloud = withDates.map(conv => ({
            ...conv,
            messages: conv.messages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp instanceof Date ? msg.timestamp.getTime() : msg.timestamp,
            })),
            createdAt: conv.createdAt instanceof Date ? conv.createdAt.getTime() : conv.createdAt,
            updatedAt: conv.updatedAt instanceof Date ? conv.updatedAt.getTime() : conv.updatedAt,
          }));
          saveConversationsToCloud({ userId, conversations: conversationsForCloud })
            .then(() => console.log('✅ Cloud backup successful'))
            .catch((err) => console.error('❌ Cloud backup failed:', err));
        }
      } catch (e) {
        console.error('Failed to load conversations', e);
      }
    } else {
      setConversations([]);
    }
  }, [userId, isLoaded, loadConversationsFromCloud, forceRefresh]);

  // ============================================================
  // 💾 SAVE CONVERSATIONS - To localStorage and Convex
  // ============================================================
  useEffect(() => {
    console.log('🔵 SAVE EFFECT - conversations:', conversations.length, 'userId:', userId);
    
    if (!userId) {
      console.log('⚠️ No userId, skipping save');
      return;
    }
    
    // ✅ ONLY save if there are conversations
    if (conversations.length === 0) {
      console.log('⚠️ No conversations to save, skipping Convex save');
      localStorage.setItem(`baptistry_conversations_${userId}`, JSON.stringify(conversations));
      return;
    }
    
    localStorage.setItem(`baptistry_conversations_${userId}`, JSON.stringify(conversations));
    console.log('💾 Saved to localStorage');
    
    const conversationsForCloud = conversations.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.getTime() : msg.timestamp,
      })),
      createdAt: conv.createdAt instanceof Date ? conv.createdAt.getTime() : conv.createdAt,
      updatedAt: conv.updatedAt instanceof Date ? conv.updatedAt.getTime() : conv.updatedAt,
    }));
    
    console.log('💾 Sending to Convex:', conversationsForCloud.length, 'conversations');
    
    saveConversationsToCloud({ userId, conversations: conversationsForCloud })
      .then(() => console.log('✅ Convex save successful'))
      .catch((err) => console.error('❌ Convex save failed:', err));
  }, [conversations, userId]);

  // ============================================================
  // 🔄 AUTO-REFRESH: When tab becomes visible
  // ============================================================
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && userId) {
        console.log('🔄 Tab became visible, refreshing conversations...');
        setForceRefresh(prev => prev + 1);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId]);

  // ============================================================
  // 🔄 AUTO-REFRESH: When user signs in
  // ============================================================
  useEffect(() => {
    if (userId && isLoaded) {
      console.log('🔄 User signed in, refreshing conversations...');
      setForceRefresh(prev => prev + 1);
    }
  }, [userId, isLoaded]);

  // ============================================================
  // 💾 SAVE CURRENT CONVERSATION - Save active chat
  // ============================================================
  const saveCurrentConversation = () => {
    if (!currentConversationId) return;
    if (messages.length === 0) return; // Don't save empty conversations
    
    const title = messages[0]?.content?.substring(0, 40) || 'New Chat';
    const updatedConversations = conversations.map(conv =>
      conv.id === currentConversationId
        ? { 
            ...conv, 
            title, 
            messages: [...messages], // Make a copy
            updatedAt: new Date() 
          }
        : conv
    );
    setConversations(updatedConversations);
    
    // Also save to localStorage immediately for backup
    if (userId) {
      localStorage.setItem(`baptistry_conversations_${userId}`, JSON.stringify(updatedConversations));
    }
  };

  // ============================================================
  // 🆕 START NEW CHAT - Create a fresh conversation
  // ============================================================
  const startNewChat = () => {
    if (messages.length > 0 && currentConversationId) {
      saveCurrentConversation();
    }
    
    const newConversationId = difyConversationId || Date.now().toString();
    
    const existingConversation = conversations.find(c => c.id === newConversationId);
    if (existingConversation) {
      setCurrentConversationId(newConversationId);
      setMessages(existingConversation.messages);
      return;
    }
    
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
    };
    
    setConversations(prev => {
      const withNew = [newConversation, ...prev];
      const sorted = [...withNew].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      return sorted;
    });
    setCurrentConversationId(newConversationId);
    setMessages([]);
    setInput('');
    
    setTimeout(autoResizeTextarea, 0);
  };

  // ============================================================
  // 📂 LOAD CONVERSATION - Load a saved chat when clicked
  // ============================================================
  const loadConversation = (conversationId: string) => {
    console.log('🔵 loadConversation called for:', conversationId);
    console.log('🔵 Current conversations count:', conversations.length);
    
    // ✅ Save current conversation first if any
    if (messages.length > 0 && currentConversationId) {
      saveCurrentConversation();
    }
    
    // ✅ Helper function to actually load the conversation
    const loadConversationData = (conversationData: Conversation | undefined) => {
      if (conversationData) {
        console.log('✅ Loading conversation:', conversationId);
        console.log('📝 Messages count:', conversationData.messages?.length || 0);
        
        if (conversationData.messages && conversationData.messages.length > 0) {
          setMessages(conversationData.messages);
          setCurrentConversationId(conversationId);
          
          // Update timestamp
          setConversations(prev => prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, updatedAt: new Date() }
              : conv
          ));
          
          setTimeout(() => {
            scrollToBottomImmediate();
          }, 100);
        } else {
          console.log('⚠️ Conversation has no messages');
          setMessages([]);
          setCurrentConversationId(conversationId);
        }
        return true;
      }
      return false;
    };
    
    // ✅ Step 1: Try to find in current state
    let conversation = conversations.find(c => c.id === conversationId);
    console.log('🔵 Found in state:', conversation ? 'Yes' : 'No');
    
    if (conversation) {
      loadConversationData(conversation);
      return;
    }
    
    // ✅ Step 2: Try localStorage
    if (userId) {
      console.log('🔵 Checking localStorage...');
      const saved = localStorage.getItem(`baptistry_conversations_${userId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const withDates = parsed.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }));
          
          conversation = withDates.find(c => c.id === conversationId);
          console.log('🔵 Found in localStorage:', conversation ? 'Yes' : 'No');
          
          if (conversation) {
            // ✅ Add to state if not already there
            setConversations(prev => {
              const exists = prev.some(c => c.id === conversationId);
              if (!exists) {
                return [conversation, ...prev];
              }
              return prev;
            });
            
            loadConversationData(conversation);
            return;
          }
        } catch (e) {
          console.error('Failed to load from localStorage', e);
        }
      }
    }
    
    // ✅ Step 3: Wait for Convex data (force refresh)
    console.log('🔄 Conversation not found, forcing refresh from Convex...');
    
    // Trigger a refresh
    setForceRefresh(prev => prev + 1);
    
    // ✅ Step 4: After refresh, try again
    setTimeout(() => {
      const refreshedConversations = conversations;
      const refreshedConv = refreshedConversations.find(c => c.id === conversationId);
      
      if (refreshedConv) {
        console.log('✅ Found after refresh, loading...');
        loadConversationData(refreshedConv);
      } else {
        console.log('❌ Conversation still not found after refresh');
        
        // ✅ Step 5: Create a placeholder conversation
        const newConversation: Conversation = {
          id: conversationId,
          title: 'Loading...',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          pinned: false,
        };
        
        setConversations(prev => {
          const exists = prev.some(c => c.id === conversationId);
          if (!exists) {
            return [newConversation, ...prev];
          }
          return prev;
        });
        
        setCurrentConversationId(conversationId);
        setMessages([]);
      }
    }, 500);
  };

  // ============================================================
  // ✏️ RENAME CONVERSATION - Change chat title
  // ============================================================
  const renameConversation = (conversationId: string, newTitle: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, title: newTitle, updatedAt: new Date() }
        : conv
    ));
  };

  // ============================================================
  // 🗑️ DELETE CONVERSATION - Remove a chat
  // ============================================================
  const deleteConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
    setConversations(updatedConversations);
    
    if (currentConversationId === conversationId) {
      setMessages([]);
      setCurrentConversationId(null);
      setInput('');
      setTimeout(autoResizeTextarea, 0);
    }
  };

  // ============================================================
  // 📌 PIN CONVERSATION - Pin important chats to top
  // ============================================================
  const pinConversation = (conversationId: string) => {
    setConversations(prevConversations => {
      const clickedConv = prevConversations.find(conv => conv.id === conversationId);
      const isCurrentlyPinned = clickedConv?.pinned || false;
      
      let updated;
      
      if (isCurrentlyPinned) {
        updated = prevConversations.map(conv =>
          conv.id === conversationId ? { ...conv, pinned: false, updatedAt: new Date() } : conv
        );
      } else {
        const unpinnedAll = prevConversations.map(conv => ({
          ...conv,
          pinned: false,
          updatedAt: conv.updatedAt
        }));
        updated = unpinnedAll.map(conv =>
          conv.id === conversationId ? { ...conv, pinned: true, updatedAt: new Date() } : conv
        );
      }
      
      const sorted = [...updated].sort((a, b) => {
        if (a.pinned === b.pinned) {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return a.pinned ? -1 : 1;
      });
      
      return sorted;
    });
  };

  // ============================================================
  // 🔍 SCROLL TO MESSAGE - Find and highlight a specific message
  // ============================================================
  const scrollToMessage = (messageId: string) => {
    setTimeout(() => {
      const messageElement = document.getElementById(messageId);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        messageElement.classList.add('bg-yellow-50', 'dark:bg-yellow-900/30', 'transition-colors', 'duration-500');
        setTimeout(() => {
          messageElement.classList.remove('bg-yellow-50', 'dark:bg-yellow-900/30');
        }, 2000);
      } else {
        console.log('Message element not found:', messageId);
      }
    }, 100);
  };

  // ============================================================
  // 👍👎 FEEDBACK - Helpful/Unhelpful buttons
  // ============================================================
  const handleFeedback = (messageId: string, feedback: 'helpful' | 'unhelpful' | null) => {
    setMessageFeedback(prev => ({ ...prev, [messageId]: feedback }));
    
    const savedFeedback = localStorage.getItem('baptistry_feedback');
    const feedbackLog = savedFeedback ? JSON.parse(savedFeedback) : [];
    
    const existingIndex = feedbackLog.findIndex((item: any) => item.messageId === messageId);
    if (feedback === null) {
      if (existingIndex !== -1) {
        feedbackLog.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        feedbackLog[existingIndex] = {
          messageId,
          feedback,
          timestamp: new Date().toISOString(),
          conversationId: currentConversationId,
        };
      } else {
        feedbackLog.push({
          messageId,
          feedback,
          timestamp: new Date().toISOString(),
          conversationId: currentConversationId,
        });
      }
    }
    localStorage.setItem('baptistry_feedback', JSON.stringify(feedbackLog));
  };

  // ============================================================
  // ✏️ EDIT MESSAGE - Edit a user message and resend
  // ============================================================
  const editMessage = (messageId: string, newContent: string) => {
    console.log('✏️ EDIT MESSAGE:', messageId, newContent);

    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const originalMessage = messages[messageIndex];
    if (originalMessage.role !== 'user') return;

    setIsGenerating(false);
    setStreamingText('');
    if (stopRequested.current) {
      stopRequested.current = false;
    }

    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);

    const sendEditedMessage = async () => {
      if (!newContent.trim()) return;

      if (!currentConversationId) {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: newContent.substring(0, 40),
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          pinned: false,
        };
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: newContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setIsGenerating(true);
      setStreamingText('');
      stopRequested.current = false;

      const finalUserName = getUserName();

      // ⭐ Use streaming fetch
      await handleStreamingResponse(newContent, newMessages, finalUserName);
    };

    setTimeout(() => {
      sendEditedMessage();
    }, 50);
  };

  // ============================================================
  // 🔄 REGENERATE MESSAGE - Get a new response for the same question
  // ============================================================
  const regenerateMessage = async (assistantMessageId: string) => {
    const assistantIndex = messages.findIndex(m => m.id === assistantMessageId);
    if (assistantIndex === -1) return;
    if (messages[assistantIndex].role !== 'assistant') return;
    
    let userMessageIndex = assistantIndex - 1;
    while (userMessageIndex >= 0 && messages[userMessageIndex].role !== 'user') {
      userMessageIndex--;
    }
    if (userMessageIndex < 0) return;
    
    const userMessageContent = messages[userMessageIndex].content;
    const newMessages = messages.slice(0, assistantIndex);
    setMessages(newMessages);
    
    setIsGenerating(true);
    setStreamingText('');
    stopRequested.current = false;
    
    const finalUserName = getUserName();

    // ⭐ Use streaming fetch
    await handleStreamingResponse(userMessageContent, newMessages, finalUserName);
  };

  // ============================================================
  // 📡 HANDLE STREAMING RESPONSE - Process real-time chunks from Dify
  // ============================================================
  const handleStreamingResponse = async (
    messageContent: string, 
    history: Message[], 
    userName: string
  ) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageContent,
          history: history,
          userName: userName,
          conversationId: difyConversationId,
        }),
      });

      // Check if response is a stream (check content type)
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('text/event-stream')) {
        // ✅ It's a stream! Process it as it arrives
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        let newConversationId = null;
        let isFirstChunk = true;

        if (!reader) {
          throw new Error('No reader available');
        }

        // Read the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                
                // Handle conversation ID
                if (data.event === 'conversation_id' && data.conversation_id) {
                  newConversationId = data.conversation_id;
                  console.log('🆔 Got conversation ID from stream:', newConversationId);
                }
                
                // Handle message chunks
                if (data.event === 'message' && data.answer) {
                  fullResponse += data.answer;
                  setStreamingText(fullResponse);
                  // Scroll to bottom as text streams in
                  scrollToBottomImmediate();
                }
                
                // Handle end of stream
                if (data.event === 'message_end') {
                  // Stream is complete
                  setIsGenerating(false);
                  setStreamingText('');
                  
                  // Save conversation ID
                  if (newConversationId) {
                    setDifyConversationId(newConversationId);
                    if (userId) {
                      localStorage.setItem(`dify_conversation_${userId}`, newConversationId);
                    }
                  }
                  
                  // Add the complete message to the chat
                  const cleanResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                  const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: cleanResponse || 'I apologize, but I encountered an error.',
                    timestamp: new Date(),
                  };
                  setMessages(prev => [...prev, assistantMessage]);
                  
                  // ✅ Save conversation after receiving response
                  if (currentConversationId) {
                    saveCurrentConversation();
                  }
                  
                  return;
                }
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      } else {
        // ✅ Not a stream - fallback to regular JSON (for backward compatibility)
        console.log('⚠️ Response is not a stream, using JSON fallback');
        const data = await response.json();
        
        if (data.conversation_id) {
          console.log('🆔 New Dify conversation ID:', data.conversation_id);
          setDifyConversationId(data.conversation_id);
          if (userId) {
            localStorage.setItem(`dify_conversation_${userId}`, data.conversation_id);
          }
        }
        
        let fullResponse = data.response || 'I apologize, but I encountered an error.';
        fullResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        // Use the existing typing animation - KEEP YOUR PREFERRED SPEED
        const chunkSize = 5;
        const delay = 20;
        for (let i = 0; i <= fullResponse.length; i += chunkSize) {
          if (stopRequested.current) {
            setIsGenerating(false);
            setStreamingText('');
            return;
          }
          setStreamingText(fullResponse.substring(0, i));
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setStreamingText('');
        setIsGenerating(false);
        
        // ✅ Save conversation after receiving response
        if (currentConversationId) {
          saveCurrentConversation();
        }
      }
    } catch (error) {
      console.error('Error in streaming response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I am unable to respond at this moment.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsGenerating(false);
      setStreamingText('');
    }
  };

  // ============================================================
  // 📤 SEND MESSAGE - Send user message and get response
  // ============================================================
  const sendMessage = async () => {
    if (!input.trim()) return;
    if (isGenerating) return;

    const finalUserName = getUserName();
    console.log('👤 Sending message with user name:', finalUserName);

    let convId = currentConversationId;
    
    if (!convId) {
      convId = difyConversationId || Date.now().toString();
      setCurrentConversationId(convId);
      
      const newConversation: Conversation = {
        id: convId,
        title: input.substring(0, 40),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        pinned: false,
      };
      setConversations(prev => {
        const exists = prev.some(conv => conv.id === convId);
        if (exists) {
          return prev;
        }
        const withNew = [newConversation, ...prev];
        const sorted = [...withNew].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        return sorted;
      });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const sentInput = input;
    setInput('');
    setIsGenerating(true);
    setStreamingText('');
    stopRequested.current = false;
    
    setTimeout(autoResizeTextarea, 0);

    // ⭐ Use the streaming handler
    await handleStreamingResponse(sentInput, messages, finalUserName);
  };

  // ============================================================
  // ⏹️ STOP RESPONSE - Stop BAPTISTRY from typing
  // ============================================================
  const stopResponse = () => {
    stopRequested.current = true;
    setIsGenerating(false);
    setStreamingText('');
    
    const stopMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "⏹️ You stopped me from responding. No worries! Feel free to **edit your message** and try again, or ask me something new. 🙏",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, stopMessage]);
  };

  // ============================================================
  // ⌨️ KEYBOARD SHORTCUTS - Enter to send, Shift+Enter for new line
  // ============================================================
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ============================================================
  // 🆕 NEW CHAT - Start fresh
  // ============================================================
  const handleNewChat = () => {
    startNewChat();
  };

  // ============================================================
  // 🏠 RETURN TO WELCOME - Clear messages
  // ============================================================
  const handleReturnToWelcome = () => {
    setMessages([]);
    setInput('');
    setTimeout(autoResizeTextarea, 0);
  };

  // ============================================================
  // ✏️ FILL INPUT - Click suggestion to fill input
  // ============================================================
  const fillInput = (text: string) => {
    if (textareaRef.current) {
      textareaRef.current.value = text;
      setInput(text);
      autoResizeTextarea();
      textareaRef.current.focus();
    }
  };

  // ============================================================
  // 📋 SIDEBAR CONVERSATIONS - Format for sidebar display
  // ============================================================
  const sidebarConversations = conversations.map(conv => ({
    id: conv.id,
    content: conv.title,
    timestamp: conv.updatedAt,
    pinned: conv.pinned || false,
  }));

  // ============================================================
  // 🎨 STYLES - CSS classes for components
  // ============================================================
  const tryAskingButtonClass = "block w-full text-left text-sm text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden";

  // Text animation class - slides up from bottom
  const textContainerClass = "relative inline-block w-full overflow-hidden";
  const textInnerClass = (isSliding: boolean) => `
    inline-block w-full
    transition-all duration-300 ease-in-out
    ${isSliding ? 'translate-y-[-100%] opacity-0' : 'translate-y-0 opacity-100'}
  `;

  // ============================================================
  // 🖥️ RENDER - The actual UI
  // ============================================================
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* 📂 SIDEBAR - Left navigation */}
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
        {/* 📋 HEADER - Top bar */}
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          messageCount={messages.length}
          messages={messages}
          onLoadMessage={scrollToMessage}
          onBooksClick={() => {
            // Trigger the Books modal via custom event
            const event = new CustomEvent('openBooks');
            window.dispatchEvent(event);
          }}
        />

        {/* 💬 MESSAGES AREA - Main chat */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isGenerating ? (
            // 🏠 WELCOME SCREEN - Show when no messages
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
                  Hi {userName ? `${userName},` : 'Friend,'}
                  <br />
                  I'm BAPTISTRY
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
                          key={textKeys[index] || `suggestion-${index}-${Date.now()}`}
                          onClick={() => fillInput(suggestion)}
                          className={tryAskingButtonClass}
                        >
                          <span className={textContainerClass}>
                            <span className={textInnerClass(slidingIndex === index)}>
                              • "{suggestion}"
                            </span>
                          </span>
                        </button>
                      ))
                    ) : (
                      // Fallback suggestions if dynamic ones aren't loaded
                      <>
                        <button 
                          onClick={() => fillInput("What do you believe about salvation?")}
                          className={tryAskingButtonClass}
                        >
                          • "What do you believe about salvation?"
                        </button>
                        <button 
                          onClick={() => fillInput("Create a devotion about grace")}
                          className={tryAskingButtonClass}
                        >
                          • "Create a devotion about grace"
                        </button>
                        <button 
                          onClick={() => fillInput("Create a preaching about sin")}
                          className={tryAskingButtonClass}
                        >
                          • "Create a preaching about sin"
                        </button>
                        <button 
                          onClick={() => fillInput("Explain John 3:16")}
                          className={tryAskingButtonClass}
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
            // 💬 CHAT MESSAGES - Show when there are messages
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
              {messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  onFeedback={handleFeedback}
                  onEdit={editMessage}
                  onRegenerate={message.role === 'assistant' ? regenerateMessage : undefined}
                  feedbackStatus={messageFeedback[message.id] || null}
                />
              ))}
              
              {/* ⏳ THINKING INDICATOR - Shows while BAPTISTRY is thinking */}
              {isGenerating && !streamingText && (
                <div className="flex justify-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
                      <img 
                        src="/baptistry-logo.png" 
                        alt="BAPTISTRY"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">BAPTISTRY is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* ⌨️ STREAMING TEXT - Shows real-time typing */}
              {streamingText && (
                <div className="flex justify-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
                      <img 
                        src="/baptistry-logo.png" 
                        alt="BAPTISTRY"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm max-w-3xl">
                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {streamingText}
                      <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ✏️ INPUT AREA - Bottom bar with text input */}
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
                // ⏹️ STOP BUTTON - Shows while generating
                <button
                  onClick={stopResponse}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium flex items-center gap-2 border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  ⏹️ Stop
                </button>
              ) : (
                // 📤 SEND BUTTON - Shows when not generating
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send
                </button>
              )}
            </div>
            
            {/* 📜 FOOTER QUOTES */}
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center italic mt-3">
              "A dose of God's Word a day, will keep you going all day."
            </p>
            <p className="text-xs text-blue-500 dark:text-blue-400 text-center mt-1">
              — ALWAYS BEGIN WITH GOD —
            </p>
          </div>
        </div>
      </div>
      
      {/* 📖 RIGHT SIDEBAR - Bible lookup and resources */}
      {messages.length > 0 && (
        <RightSidebar 
          messages={messages} 
          onScrollToMessage={scrollToMessage} 
        />
      )}
      
      {/* 👤 NAME MODAL - For guest users */}
      <NameModal 
        isOpen={showNameModal} 
        onSave={handleNameSave} 
      />
    </div>
  );
}