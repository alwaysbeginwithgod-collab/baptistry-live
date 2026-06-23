'use client';

import { useState, useEffect } from 'react';

export default function MaintenanceMode() {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    // Check if maintenance mode is enabled via environment variable
    const checkMaintenance = async () => {
      try {
        const response = await fetch('/api/maintenance');
        const data = await response.json();
        setIsMaintenance(data.isMaintenance);
      } catch (error) {
        // If API fails, assume no maintenance
        setIsMaintenance(false);
      }
    };

    checkMaintenance();
  }, []);

  if (!isMaintenance) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/baptistry-logo.png" 
            alt="BAPTISTRY" 
            className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-xl"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">🔧 Under Maintenance</h1>
        
        <p className="text-blue-100 text-lg mb-6">
          BAPTISTRY is currently being updated to serve you better.
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <p className="text-blue-200 text-sm">
            🙏 We appreciate your patience. Please check back soon!
          </p>
        </div>
        
        <p className="text-blue-300 text-sm">
          "A dose of God's Word a day, will keep you going all day."
        </p>
        <p className="text-blue-400 text-xs mt-2">
          — ALWAYS BEGIN WITH GOD —
        </p>
      </div>
    </div>
  );
}