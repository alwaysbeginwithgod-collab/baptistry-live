'use client';

import { useState, useEffect, useRef } from 'react';
import { getDailyEncouragement } from '../lib/dailyEncouragements';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'encouragement' | 'devotion';
  link?: string;
  date: Date;
  read: boolean;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('baptistry_notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      const withDates = parsed.map((n: any) => ({ ...n, date: new Date(n.date) }));
      setNotifications(withDates);
      setUnreadCount(withDates.filter((n: Notification) => !n.read).length);
    } else {
      // Sample BAPTISTRY updates
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          title: '🚀 Books Showroom Launched',
          message: 'Browse and preview all devotion books in the new Books Showroom!',
          type: 'update',
          link: '#',
          date: new Date(),
          read: false,
        },
        {
          id: '2',
          title: '✨ New Feature: Bible Lookup',
          message: 'Search any Bible verse directly from the right sidebar.',
          type: 'update',
          link: '#',
          date: new Date(Date.now() - 86400000),
          read: false,
        },
        {
          id: '3',
          title: '📖 30-Day Devotions Added',
          message: 'The Anchored Series and Ignited Series are now available.',
          type: 'update',
          link: '#',
          date: new Date(Date.now() - 172800000),
          read: true,
        },
      ];
      setNotifications(sampleNotifications);
      setUnreadCount(sampleNotifications.filter(n => !n.read).length);
      localStorage.setItem('baptistry_notifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  // Add daily encouragement notification (once per day)
  useEffect(() => {
    const today = new Date().toDateString();
    const lastEncouragementDate = localStorage.getItem('last_encouragement_date');
    const encouragement = getDailyEncouragement();
    
    if (lastEncouragementDate !== today) {
      // Remove any previous daily encouragement to avoid duplicates
      const filtered = notifications.filter(n => !n.id.startsWith('daily-enc-'));
      
      const newEncouragement: Notification = {
        id: `daily-enc-${Date.now()}`,
        title: '☀️ Daily Encouragement',
        message: encouragement.message,
        type: 'encouragement',
        link: '#',
        date: new Date(),
        read: false,
      };
      
      const updated = [newEncouragement, ...filtered];
      setNotifications(updated);
      setUnreadCount(updated.filter(n => !n.read).length);
      localStorage.setItem('baptistry_notifications', JSON.stringify(updated));
      localStorage.setItem('last_encouragement_date', today);
    }
  }, [notifications]);

  // ============================================================
  // DAILY DEVOTION NOTIFICATION
  // ============================================================
  useEffect(() => {
    const today = new Date().toDateString();
    const lastDevotionDate = localStorage.getItem('last_devotion_date');

    if (lastDevotionDate !== today) {
      // Remove any previous daily devotion to avoid duplicates
      const filtered = notifications.filter(n => !n.id.startsWith('daily-devotion-'));

      const newDevotion: Notification = {
        id: `daily-devotion-${Date.now()}`,
        title: '📖 Daily Devotion',
        message: 'A new daily devotion is ready! Tap to read.',
        type: 'devotion',
        link: '#',
        date: new Date(),
        read: false,
      };

      const updated = [newDevotion, ...filtered];
      setNotifications(updated);
      setUnreadCount(updated.filter(n => !n.read).length);
      localStorage.setItem('baptistry_notifications', JSON.stringify(updated));
      localStorage.setItem('last_devotion_date', today);
    }
  }, [notifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    localStorage.setItem('baptistry_notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem('baptistry_notifications', JSON.stringify(updated));
  };

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id);
    
    // If it's a devotion notification, open the devotion modal
    if (notif.type === 'devotion') {
      window.dispatchEvent(new CustomEvent('openDevotion'));
    } else if (notif.link && notif.link !== '#') {
      window.open(notif.link, '_blank');
    }
    setIsOpen(false);
  };

  // Function to add a new BAPTISTRY update notification
  const addUpdateNotification = (title: string, message: string, link?: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type: 'update',
      link: link || '#',
      date: new Date(),
      read: false,
    };
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    localStorage.setItem('baptistry_notifications', JSON.stringify(updated));
  };

  // Expose addUpdateNotification to window for admin page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).addBaptistryUpdate = addUpdateNotification;
    }
  }, [notifications]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const getIcon = (type: string) => {
    if (type === 'encouragement') return '☀️';
    if (type === 'devotion') return '📖';
    return '🚀';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                    !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {getIcon(notif.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatDate(new Date(notif.date))}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Stay tuned for future BAPTISTRY updates
            </p>
            <a
              href="https://www.facebook.com/BeginWithGod"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline block"
            >
              Visit our Facebook Page →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}