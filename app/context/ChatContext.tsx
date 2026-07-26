// app/context/ChatContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
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
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const userId = user?.id;
  const saveConversationsToCloud = useMutation(api.conversations.saveConversations);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // ============================================================
  // ✅ FIXED: Save conversations with proper Date → number conversion
  // ============================================================
  useEffect(() => {
    if (!conversations.length) return;
    
    const saveData = async () => {
      try {
        if (userId) {
          // ✅ Convert Date objects to numbers for Convex
          const conversationsForCloud = conversations.map(conv => ({
            ...conv,
            messages: conv.messages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp instanceof Date ? msg.timestamp.getTime() : msg.timestamp,
            })),
            createdAt: conv.createdAt instanceof Date ? conv.createdAt.getTime() : conv.createdAt,
            updatedAt: conv.updatedAt instanceof Date ? conv.updatedAt.getTime() : conv.updatedAt,
          }));
          
          await saveConversationsToCloud({ userId, conversations: conversationsForCloud });
          console.log('✅ Convex save successful');
        } else {
          // Save to LocalStorage (guest)
          const guestKey = 'baptistry_conversations_guest';
          localStorage.setItem(guestKey, JSON.stringify(conversations));
        }
      } catch (error) {
        console.error('❌ Failed to save conversations:', error);
      }
    };
    
    saveData();
  }, [conversations, userId, saveConversationsToCloud]);

  // ============================================================
  // Load conversations from localStorage (guest) or Convex (signed in)
  // ============================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        if (userId) {
          // ✅ Load from Convex (handled by parent component)
          // This is just a fallback - the parent component handles the main load
          const guestKey = 'baptistry_conversations_guest';
          const saved = localStorage.getItem(guestKey);
          if (saved && !conversations.length) {
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
            setConversations(withDates);
          }
        } else {
          // Guest: Load from localStorage
          const guestKey = 'baptistry_conversations_guest';
          const saved = localStorage.getItem(guestKey);
          if (saved) {
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
            setConversations(withDates);
          }
        }
      } catch (error) {
        console.error('❌ Failed to load conversations:', error);
      }
    };
    
    loadData();
  }, [userId]);

  return (
    <ChatContext.Provider value={{
      conversations,
      setConversations,
      messages,
      setMessages,
      currentConversationId,
      setCurrentConversationId,
    }}>
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