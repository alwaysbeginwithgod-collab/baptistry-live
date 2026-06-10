'use client';

import { useState, useRef } from 'react';

export default function TestPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [input, setInput] = useState('');
  const stopRequested = useRef(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (isGenerating) return;

    setIsGenerating(true);
    setDisplayText('');
    stopRequested.current = false;

    // Simulate API response
    const fakeResponse = "This is a test response. You should be able to stop me mid-sentence by clicking the Stop button.";

    for (let i = 0; i <= fakeResponse.length; i++) {
      if (stopRequested.current) {
        console.log('Stop requested - exiting');
        setIsGenerating(false);
        setDisplayText('');
        return;
      }
      setDisplayText(fakeResponse.substring(0, i));
      await new Promise(r => setTimeout(r, 30));
    }

    setIsGenerating(false);
  };

  const stopResponse = () => {
    console.log('Stop button clicked');
    stopRequested.current = true;
    setIsGenerating(false);
    setDisplayText('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Stop Button Test</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded-lg min-h-[100px]">
        {displayText || (isGenerating ? 'Generating...' : 'Ready')}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type something..."
        />
        {isGenerating ? (
          <button
            onClick={stopResponse}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Send
          </button>
        )}
      </div>
      
      <p className="mt-4 text-sm text-gray-500">
        Test: Type anything, click Send, then click Stop while it's typing.
      </p>
    </div>
  );
}