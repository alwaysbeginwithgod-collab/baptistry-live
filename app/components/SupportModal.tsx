'use client';

import { useState } from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [showPaypalQR, setShowPaypalQR] = useState(false);
  const [showGcashQR, setShowGcashQR] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  if (!isOpen) return null;

  // ✅ Your PayPal.me link (same as MANUSTRY)
  const getPayPalUrl = (amount: number) => {
    return `https://paypal.me/PrimeStyleOutlet/${amount}`;
  };

  const donationAmounts = [5, 10, 20, 50];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Support BAPTISTRY</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Thank You Message */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Thank you for considering supporting this ministry.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your love gifts help keep BAPTISTRY free for everyone.
            </p>
          </div>

          {/* PayPal Option */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💙</span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">PayPal</p>
                  <p className="text-xs text-gray-500">Select amount to donate</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaypalQR(!showPaypalQR)}
                className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showPaypalQR ? 'Hide QR Code' : '📱 Show QR Code'}
              </button>
            </div>

            {/* Amount Selection */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select donation amount:</p>
              <div className="flex gap-2 flex-wrap">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border
                      ${selectedAmount === amount 
                        ? 'bg-[#0070ba] text-white border-[#0070ba]' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#0070ba]'}`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Donate Button */}
            <div className="mt-3">
              <a
                href={selectedAmount ? getPayPalUrl(selectedAmount) : "https://paypal.me/PrimeStyleOutlet"}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#0070ba] text-white rounded-lg hover:bg-[#003087] transition-colors font-medium
                  ${!selectedAmount ? 'opacity-70' : ''}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.067 8.478c.492.88.556 2.014.3 3.328-.74 3.806-3.276 5.12-6.514 5.12h-.001a5.24 5.24 0 0 1-1.418-.206l-.002.002-3.637 1.738.678-3.258c-1.622-1.134-2.628-2.666-2.628-4.468 0-4.036 2.622-6.894 6.986-6.894 2.445 0 4.3.848 5.4 2.004l.002-.002 1.934-1.854-1.264 2.39Z"/>
                </svg>
                {selectedAmount ? `Donate $${selectedAmount} via PayPal` : 'Select amount to donate'}
              </a>
              <p className="text-xs text-gray-400 text-center mt-2">
                No PayPal account? Credit card accepted via PayPal.
              </p>
              <p className="text-xs text-gray-400 text-center mt-1">
                PayPal.me: <span className="font-mono">PrimeStyleOutlet</span>
              </p>
            </div>

            {/* QR Code */}
            {showPaypalQR && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <img 
                  src="/paypal.png" 
                  alt="PayPal QR Code"
                  className="w-48 h-48 mx-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="text-center">
                          <p class="text-sm text-gray-700 dark:text-gray-300 font-medium">💙 PayPal</p>
                          <p class="text-xs text-gray-500 mt-2">Scan with PayPal app</p>
                          <p class="text-xs text-gray-500 mt-1">Send to: <span class="font-mono">@PrimeStyleOutlet</span></p>
                        </div>
                      `;
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">Scan with PayPal app</p>
                <p className="text-xs text-gray-400 mt-1">PayPal.me: <span className="font-mono">PrimeStyleOutlet</span></p>
              </div>
            )}
          </div>

          {/* GCash / PayMaya Combined Option */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="text-2xl">💚</span>
                  <span className="text-2xl">💜</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">GCash / PayMaya</p>
                  <p className="text-xs text-gray-500">Scan QR code to pay</p>
                  <p className="text-xs text-gray-400 mt-0.5">Number: 0915 598 3928</p>
                </div>
              </div>
              <button
                onClick={() => setShowGcashQR(!showGcashQR)}
                className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                {showGcashQR ? 'Hide QR Code' : '📱 Show QR Code'}
              </button>
            </div>
            {showGcashQR && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <img 
                  src="/gcash-paymaya.png" 
                  alt="GCash and PayMaya QR Code"
                  className="w-48 h-48 mx-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="text-center">
                          <p class="text-sm text-gray-700 dark:text-gray-300 font-medium">📱 GCash / PayMaya</p>
                          <p class="text-base font-bold text-gray-800 dark:text-white mt-2">0915 598 3928</p>
                          <p class="text-xs text-gray-500 mt-2">Send to this number via GCash or PayMaya</p>
                        </div>
                      `;
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">Scan with GCash or PayMaya app</p>
                <p className="text-xs text-gray-400 mt-1">Or send to: <span className="font-mono">0915 598 3928</span></p>
              </div>
            )}
          </div>

          {/* Scripture Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              "Freely ye have received, freely give." — Matthew 10:8 (KJV)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}