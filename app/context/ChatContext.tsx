'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

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

  // Convex mutations and queries
  const saveConversationsToCloud = useMutation(api.conversations.saveConversations);
  const loadConversationsFromCloud = useQuery(api.conversations.loadConversations, 
    userId ? { userId } : "skip"
  );

  // Load conversations from Convex when user signs in
  useEffect(() => {
    if (userId && loadConversationsFromCloud && loadConversationsFromCloud !== "skip") {
      const cloudConversations = loadConversationsFromCloud as Conversation[];
      if (cloudConversations && cloudConversations.length > 0) {
        setConversations(cloudConversations);
      } else {
        // No cloud conversations yet — check LocalStorage for guest data
        const guestKey = 'baptistry_conversations_guest';
        const guestData = localStorage.getItem(guestKey);
        if (guestData) {
          try {
            const parsed = JSON.parse(guestData);
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
            // Save guest data to cloud
            saveConversationsToCloud({ userId, conversations: withDates });
            localStorage.removeItem(guestKey);
          } catch (e) {
            console.error('Failed to merge guest conversations', e);
          }
        }
      }
    } else if (!userId) {
      // Guest user — load from LocalStorage
      const guestKey = 'baptistry_conversations_guest';
      const savedConversations = localStorage.getItem(guestKey);
      if (savedConversations) {
        try {
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
        } catch (e) {
          console.error('Failed to load guest conversations', e);
        }
      } else {
        setConversations([]);
      }
    }
  }, [userId, loadConversationsFromCloud]);

  // Save conversations to Convex (when signed in) or LocalStorage (guest)
  useEffect(() => {
    if (conversations.length === 0) return;
    
    if (userId) {
      // Save to cloud
      saveConversationsToCloud({ userId, conversations });
    } else {
      // Save to LocalStorage (guest)
      const guestKey = 'baptistry_conversations_guest';
      localStorage.setItem(guestKey, JSON.stringify(conversations));
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
    // This will be implemented later with AI
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