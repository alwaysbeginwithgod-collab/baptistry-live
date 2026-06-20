'use client';

import RightSidebar from './components/RightSidebar';
import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import { useUser } from '@clerk/nextjs';
// import { useMutation, useQuery } from 'convex/react';
// import { api } from '../convex/_generated/api';

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

export default function MainContent() {
  const { user } = useUser();
  const userId = user?.id;

// Convex hooks - safe to use even if not configured
//   const saveConversationsToCloud = useMutation(api.conversations.saveConversations);
//   const loadConversationsFromCloud = useQuery(
//    api.conversations.loadConversations,
//    userId ? { userId } : "skip"
//  );

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

  // Load conversations from localStorage only (Convex temporarily disabled)
  useEffect(() => {
    if (!userId) {
      setConversations([]);
      return;
    }
    
    // Load from localStorage only
    const savedConversations = localStorage.getItem(`baptistry_conversations_${userId}`);
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
        console.error('Failed to load conversations', e);
      }
    } else {
      setConversations([]);
    }
  }, [userId]);

  // Save conversations to localStorage only (Convex temporarily disabled)
  useEffect(() => {
    if (conversations.length > 0 && userId) {
      localStorage.setItem(`baptistry_conversations_${userId}`, JSON.stringify(conversations));
    }
  }, [conversations, userId]);

  const saveCurrentConversation = () => {
    if (!currentConversationId) return;
    
    const title = messages[0]?.content?.substring(0, 40) || 'New Chat';
    const updatedConversations = conversations.map(conv =>
      conv.id === currentConversationId
        ? { ...conv, title, messages: [...messages], updatedAt: new Date() }
        : conv
    );
    setConversations(updatedConversations);
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
    
    setConversations(prev => {
      const withNew = [newConversation, ...prev];
      const sorted = [...withNew].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      return sorted;
    });
    setCurrentConversationId(newConversation.id);
    setMessages([]);
    setInput('');
    
    setTimeout(autoResizeTextarea, 0);
  };

  const loadConversation = (conversationId: string) => {
    if (messages.length > 0 && currentConversationId) {
      saveCurrentConversation();
    }
    
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setConversations(prev => prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, updatedAt: new Date() }
          : conv
      ));
      
      setMessages(conversation.messages);
      setCurrentConversationId(conversationId);
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToBottomImmediate();
        }, 50);
      });
    } else {
      console.log('Conversation not found:', conversationId);
    }
  };

  const renameConversation = (conversationId: string, newTitle: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, title: newTitle, updatedAt: new Date() }
        : conv
    ));
  };

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
  // SIMPLE EDIT FUNCTION - WORKS DIRECTLY
  // ============================================================
  const editMessage = async (messageId: string, newContent: string) => {
    console.log('🔥 EDIT MESSAGE TRIGGERED');
    
    // Find the message to edit
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const originalMessage = messages[messageIndex];
    if (originalMessage.role !== 'user') return;
    
    // Remove this message and all messages after it
    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);
    
    // Reset states
    setIsGenerating(true);
    setStreamingText('');
    stopRequested.current = false;
    
    // Create conversation if needed
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

    // Add the edited user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newContent,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      // Call the API directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newContent, history: newMessages }),
      });

      const data = await response.json();
      let fullResponse = data.response || 'I apologize, but I encountered an error.';
      fullResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      // Type the response
      const chunkSize = 15;
      for (let i = 0; i <= fullResponse.length; i += chunkSize) {
        if (stopRequested.current) {
          setIsGenerating(false);
          setStreamingText('');
          return;
        }
        setStreamingText(fullResponse.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 3));
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
      console.log('✅ EDIT COMPLETE');

    } catch (error) {
      console.error('Edit error:', error);
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
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageContent, history: newMessages }),
      });

      const data = await response.json();
      let fullResponse = data.response || 'I apologize, but I encountered an error.';
      fullResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      const chunkSize = 4;
      for (let i = 0; i <= fullResponse.length; i += chunkSize) {
        if (stopRequested.current) {
          setIsGenerating(false);
          setStreamingText('');
          return;
        }
        setStreamingText(fullResponse.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 5));
      }

      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newAssistantMessage]);
      setStreamingText('');
      setIsGenerating(false);
    } catch (error) {
      console.error('Regeneration error:', error);
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

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (isGenerating) return;

    if (!currentConversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: input.substring(0, 40),
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
      setCurrentConversationId(newConversation.id);
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

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sentInput, history: messages }),
      });

      const data = await response.json();
      let fullResponse = data.response || 'I apologize, but I encountered an error.';
      fullResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      const chunkSize = 4;
      for (let i = 0; i <= fullResponse.length; i += chunkSize) {
        if (stopRequested.current) {
          setIsGenerating(false);
          setStreamingText('');
          return;
        }
        setStreamingText(fullResponse.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 5));
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

    } catch (error) {
      console.error('Error:', error);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleNewChat = () => {
    startNewChat();
  };

  const handleReturnToWelcome = () => {
    setMessages([]);
    setInput('');
    setTimeout(autoResizeTextarea, 0);
  };

  const fillInput = (text: string) => {
    if (textareaRef.current) {
      textareaRef.current.value = text;
      setInput(text);
      autoResizeTextarea();
      textareaRef.current.focus();
    }
  };

  const sidebarConversations = conversations.map(conv => ({
    id: conv.id,
    content: conv.title,
    timestamp: conv.updatedAt,
    pinned: conv.pinned || false,
  }));

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
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 text-left">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mb-3">
                    Try asking:
                  </p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => fillInput("What do you believe about salvation?")}
                      className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg transition-colors"
                    >
                      • "What do you believe about salvation?"
                    </button>
                    <button 
                      onClick={() => fillInput("Give me a devotion about grace")}
                      className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg transition-colors"
                    >
                      • "Give me a devotion about grace"
                    </button>
                    <button 
                      onClick={() => fillInput("Create a preaching about sin")}
                      className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg transition-colors"
                    >
                      • "Create a preaching about sin"
                    </button>
                    <button 
                      onClick={() => fillInput("Explain John 3:16")}
                      className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg transition-colors"
                    >
                      • "Explain John 3:16"
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
                >
                  ⏹️ Stop
                </button>
              ) : (
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
    </div>
  );
}