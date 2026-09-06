// app/hooks/useVersionCheck.ts
'use client';

import { useEffect, useState, useRef } from 'react';

// Store the current version in localStorage to compare across sessions
const VERSION_KEY = 'baptistry_app_version';
const CHECK_INTERVAL = 30000; // Check every 30 seconds

export function useVersionCheck() {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get the current app version from the deploymentId
  const getCurrentVersion = () => {
    // This will be injected at build time
    const version = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 
                    document.querySelector('meta[name="app-version"]')?.getAttribute('content') ||
                    'unknown';
    return version;
  };

  // Get the stored version from localStorage
  const getStoredVersion = () => {
    try {
      return localStorage.getItem(VERSION_KEY);
    } catch {
      return null;
    }
  };

  // Store the current version
  const setStoredVersion = (version: string) => {
    try {
      localStorage.setItem(VERSION_KEY, version);
    } catch {
      // Ignore
    }
  };

  // Hard reset function - clears cache and reloads
  const hardReset = () => {
    console.log('🔄 Hard resetting...');
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }

    // Clear sessionStorage
    sessionStorage.clear();

    // Force hard reload with cache bypass
    window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
    window.location.reload(true);
  };

  // Check if update is available
  const checkForUpdate = async () => {
    if (isChecking) return;
    setIsChecking(true);

    try {
      const currentVersion = getCurrentVersion();
      const storedVersion = getStoredVersion();

      // If no stored version, store the current one
      if (!storedVersion) {
        setStoredVersion(currentVersion);
        setIsChecking(false);
        return;
      }

      // If versions don't match, there's an update
      if (currentVersion !== storedVersion && currentVersion !== 'unknown') {
        console.log('🔄 New version detected!', { storedVersion, currentVersion });
        setShowUpdateBanner(true);
      }
    } catch (error) {
      console.error('Error checking version:', error);
    }

    setIsChecking(false);
  };

  // Check on mount
  useEffect(() => {
    checkForUpdate();

    // Check periodically
    intervalRef.current = setInterval(checkForUpdate, CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle update
  const applyUpdate = () => {
    const currentVersion = getCurrentVersion();
    setStoredVersion(currentVersion);
    setShowUpdateBanner(false);
    hardReset();
  };

  const dismissUpdate = () => {
    setShowUpdateBanner(false);
  };

  return {
    showUpdateBanner,
    isChecking,
    applyUpdate,
    dismissUpdate,
  };
}