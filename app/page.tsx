'use client';

import RightSidebar from './components/RightSidebar';
import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';

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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('baptistry_conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed);
      } catch (e) {
        console.error('Failed to load conversations', e);
      }
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('baptistry_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save current conversation when messages change
  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      saveCurrentConversation();
    }
  }, [messages]);

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
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
    setInput('');
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
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId
        ? { ...conv, title: newTitle, updatedAt: new Date() }
        : conv
    );
    setConversations(updatedConversations);
  };

  const deleteConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
    setConversations(updatedConversations);
    
    if (currentConversationId === conversationId) {
      setMessages([]);
      setCurrentConversationId(null);
      setInput('');
    }
  };

  const pinConversation = (conversationId: string) => {
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId
        ? { ...conv, pinned: !conv.pinned, updatedAt: new Date() }
        : conv
    );
    
    const sorted = [...updatedConversations].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    setConversations(sorted);
  };

  const scrollToMessage = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add('bg-yellow-50', 'dark:bg-yellow-900/30', 'transition-colors', 'duration-500');
      setTimeout(() => {
        messageElement.classList.remove('bg-yellow-50', 'dark:bg-yellow-900/30');
      }, 2000);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'helpful' | 'unhelpful') => {
    const savedFeedback = localStorage.getItem('baptistry_feedback');
    const feedbackLog = savedFeedback ? JSON.parse(savedFeedback) : [];
    
    feedbackLog.push({
      messageId,
      feedback,
      timestamp: new Date().toISOString(),
      conversationId: currentConversationId,
    });
    
    localStorage.setItem('baptistry_feedback', JSON.stringify(feedbackLog));
    console.log('Feedback recorded:', { messageId, feedback });
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!currentConversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: input.substring(0, 40),
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
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(false);
    setStreamingText('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages }),
      });

      const data = await response.json();
      let fullResponse = data.response || 'I apologize, but I encountered an error. Please try again.';
      
      fullResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '');
      fullResponse = fullResponse.replace(/^We need to.*?\.\s*/i, '');
      fullResponse = fullResponse.replace(/^I need to.*?\.\s*/i, '');
      fullResponse = fullResponse.trim();

      setIsStreaming(true);
      setIsLoading(false);

      let currentIndex = 0;
      const chunkSize = 10;
      const typingSpeed = 5;
      
      const interval = setInterval(() => {
        if (currentIndex <= fullResponse.length) {
          setStreamingText(fullResponse.substring(0, currentIndex));
          currentIndex += chunkSize;
        } else {
          clearInterval(interval);
          setIsStreaming(false);
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setStreamingText('');
        }
      }, typingSpeed);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I am unable to respond at this moment. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      setIsStreaming(false);
    }
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
  };

  const fillInput = (text: string) => {
    if (textareaRef.current) {
      textareaRef.current.value = text;
      setInput(text);
      textareaRef.current.focus();
    }
  };

  const sidebarConversations = conversations.map(conv => ({
    id: conv.id,
    content: conv.title,
    timestamp: conv.updatedAt,
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
          {messages.length === 0 && !isStreaming ? (
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
                />
              ))}
              
              {isLoading && !isStreaming && (
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
              
              {isStreaming && streamingText && (
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Scripture, doctrine, or request a devotion..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Send
              </button>
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