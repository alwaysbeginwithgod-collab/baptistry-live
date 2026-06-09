'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';

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

interface ChatContextType {
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  isStreaming: boolean;
  streamingText: string;
  sendMessage: (content: string) => Promise<void>;
  startNewChat: () => void;
  loadConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  deleteConversation: (id: string) => void;
  pinConversation: (id: string) => void;
  setMessages: (messages: Message[]) => void;
  setCurrentConversationId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const userId = user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  // Get storage key based on user (guest or signed-in)
  const getStorageKey = () => {
    if (userId) {
      return `baptistry_conversations_${userId}`;
    }
    return 'baptistry_conversations_guest';
  };

  // Merge guest conversations into user account when signing in
  const mergeGuestConversations = () => {
    if (!userId) return;

    const guestKey = 'baptistry_conversations_guest';
    const guestData = localStorage.getItem(guestKey);
    
    if (!guestData) return;

    try {
      const guestConversations = JSON.parse(guestData);
      if (guestConversations.length === 0) return;

      // Convert date strings back to Date objects
      const parsedGuest = guestConversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));

      // Check if user already has conversations
      const userKey = getStorageKey();
      const userData = localStorage.getItem(userKey);
      let existingConversations: Conversation[] = [];
      
      if (userData) {
        existingConversations = JSON.parse(userData).map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      }

      // Merge: combine guest + existing, remove duplicates by ID
      const allConversations = [...parsedGuest, ...existingConversations];
      const uniqueConversations = allConversations.filter(
        (conv, index, self) => index === self.findIndex((c) => c.id === conv.id)
      );

      // Save merged conversations
      setConversations(uniqueConversations);
      localStorage.setItem(userKey, JSON.stringify(uniqueConversations));
      
      // Remove guest data after merge
      localStorage.removeItem(guestKey);
      
      console.log(`Merged ${parsedGuest.length} guest conversations into user account`);
    } catch (e) {
      console.error('Failed to merge guest conversations', e);
    }
  };

  // Load conversations from localStorage when user changes
  useEffect(() => {
    const storageKey = getStorageKey();
    const savedConversations = localStorage.getItem(storageKey);
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        // Convert date strings back to Date objects
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
      } catch (e) {
        console.error('Failed to load conversations', e);
      }
    } else {
      setConversations([]);
    }
    
    // If user is signed in, merge any guest conversations into their account
    if (userId) {
      mergeGuestConversations();
    }
  }, [userId]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(conversations));
    }
  }, [conversations, userId]);

  // Save current conversation when messages change
  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      saveCurrentConversation();
    }
  }, [messages]);

  const saveCurrentConversation = () => {
    if (!currentConversationId) return;
    
    const title = messages[0]?.content?.substring(0, 40) || 'New Chat';
    setConversations(prev =>
      prev.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, title, messages: [...messages], updatedAt: new Date() }
          : conv
      )
    );
  };

  const startNewChat = () => {
    if (messages.length > 0 && currentConversationId) {
      saveCurrentConversation();
    }
    
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
  };

  const loadConversation = (conversationId: string) => {
    if (messages.length > 0 && currentConversationId) {
      saveCurrentConversation();
    }
    
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(conversationId);
    }
  };

  const renameConversation = (conversationId: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, title: newTitle, updatedAt: new Date() }
          : conv
      )
    );
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    if (currentConversationId === conversationId) {
      setMessages([]);
      setCurrentConversationId(null);
    }
  };

  const pinConversation = (conversationId: string) => {
    setConversations(prev => {
      const updated = prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, pinned: !conv.pinned, updatedAt: new Date() }
          : conv
      );
      
      const sorted = [...updated].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      return sorted;
    });
  };

  const sendMessage = async (content: string) => {
    // This will be implemented with the API call
    console.log('Send message:', content);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversations,
        currentConversationId,
        isLoading,
        isStreaming,
        streamingText,
        sendMessage,
        startNewChat,
        loadConversation,
        renameConversation,
        deleteConversation,
        pinConversation,
        setMessages,
        setCurrentConversationId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}