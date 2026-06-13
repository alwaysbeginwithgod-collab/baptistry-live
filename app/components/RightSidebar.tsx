'use client';

import { useState, useRef, useEffect } from 'react';

type Tool = 'bible' | 'dictionary' | 'reference' | null;

export default function RightSidebar() {
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [bibleQuery, setBibleQuery] = useState('');
  const [bibleResult, setBibleResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dictionaryWord, setDictionaryWord] = useState('');
  const [dictionaryResult, setDictionaryResult] = useState('');
  const toolPanelRef = useRef<HTMLDivElement>(null);

  const searchBible = async () => {
    if (!bibleQuery.trim()) return;
    setIsLoading(true);
    setBibleResult('Searching...');

    try {
      const formattedQuery = encodeURIComponent(bibleQuery.trim().replace(/ /g, '+'));
      const apiUrl = `https://dailybible.ca/api/${formattedQuery}?translation=kjv`;

      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();

        if (data.verses && data.verses.length > 0) {
          const formattedVerses = data.verses.map((v: any) => {
            return `v${v.verse} - ${v.text}`;
          }).join('\n');

          setBibleResult(`${data.reference} (KJV)\n\n${formattedVerses}`);
        } else if (data.text) {
          setBibleResult(`${data.reference || bibleQuery} (KJV)\n\n"${data.text}"`);
        } else {
          setBibleResult(`${bibleQuery} - Not found.`);
        }
      } else {
        setBibleResult(`${bibleQuery} - Not found.`);
      }
    } catch (error) {
      console.error('Bible API error:', error);
      setBibleResult(`Unable to fetch at this time.`);
    }
    setIsLoading(false);
  };

  // Updated: Use BAPTISTRY's Webster's 1828 Dictionary API
const searchDictionary = async () => {
  if (!dictionaryWord.trim()) return;
  setIsLoading(true);
  
  const word = dictionaryWord.trim();
  const websterUrl = `https://webstersdictionary1828.com/Dictionary/${encodeURIComponent(word)}`;
  
  // Provide a direct link to the website
  setDictionaryResult(`**${word.toUpperCase()}**\n\n📚 View the complete definition from **Webster's 1828 Dictionary**:\n\n➡️ ${websterUrl}\n\n*The dictionary is best viewed directly on their site for the full formatting and scripture references.*`);
  
  setIsLoading(false);
};

  const closeTool = () => {
    setActiveTool(null);
    setBibleResult('');
    setDictionaryResult('');
  };

  // Close tool when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolPanelRef.current && !toolPanelRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('.tool-icon-button')) {
          setActiveTool(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Icon Bar - Fixed on right edge */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30">
        <div className="flex flex-col items-center gap-4 py-6 px-2 bg-white dark:bg-gray-800 rounded-l-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Bible Icon */}
          <button
            onClick={() => setActiveTool(activeTool === 'bible' ? null : 'bible')}
            className={`tool-icon-button p-2 rounded-lg transition-colors ${
              activeTool === 'bible'
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="KJV Bible Lookup"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </button>

          {/* Dictionary Icon */}
          <button
            onClick={() => setActiveTool(activeTool === 'dictionary' ? null : 'dictionary')}
            className={`tool-icon-button p-2 rounded-lg transition-colors ${
              activeTool === 'dictionary'
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Webster's 1828 Dictionary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7M16 18.5L19.5 15 17 12.5 13.5 16 16 19.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8l-2 4m0 0l-2-4m2 4v6" />
            </svg>
          </button>

          {/* Reference Library Icon */}
          <button
            onClick={() => setActiveTool(activeTool === 'reference' ? null : 'reference')}
            className={`tool-icon-button p-2 rounded-lg transition-colors ${
              activeTool === 'reference'
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Baptist Reference Library"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13v4m-4-4h8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tool Panel - Pop-up to the left of icons */}
      {activeTool && (
        <div
          ref={toolPanelRef}
          className="fixed right-12 top-1/2 transform -translate-y-1/2 z-20"
        >
          <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-[85vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {activeTool === 'bible' && '📖 KJV Bible Lookup'}
                  {activeTool === 'dictionary' && '📚 Webster\'s 1828 Dictionary'}
                  {activeTool === 'reference' && '📚 Baptist Reference Library'}
                </h3>
                <button onClick={closeTool} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {activeTool === 'bible' && (
                <div>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={bibleQuery}
                      onChange={(e) => setBibleQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchBible()}
                      placeholder="e.g., John 3:16, John 1"
                      className="flex-1 px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={searchBible}
                      disabled={isLoading}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? '...' : 'Search'}
                    </button>
                  </div>
                  {bibleResult && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-96 overflow-y-auto">
                      <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                        {bibleResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTool === 'dictionary' && (
                <div>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={dictionaryWord}
                      onChange={(e) => setDictionaryWord(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchDictionary()}
                      placeholder="Enter a word (e.g., grace, faith, calvary)"
                      className="flex-1 px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={searchDictionary}
                      disabled={isLoading}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? '...' : 'Define'}
                    </button>
                  </div>
                  {dictionaryResult && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-96 overflow-y-auto">
                      <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                        {dictionaryResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTool === 'reference' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Resources for study and research.
                  </p>

                  {/* Doctrinal Defense */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 border-l-2 border-blue-500 pl-2">
                      📖 Doctrinal Defense
                    </h4>
                    <div className="space-y-1 ml-2">
                      <a href="https://www.wayoflife.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Way of Life Literature
                      </a>
                      <a href="https://www.independentbaptist.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Independent Baptist Portal
                      </a>
                    </div>
                  </div>

                  {/* Word Studies */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 border-l-2 border-blue-500 pl-2">
                      🔍 Word Studies
                    </h4>
                    <div className="space-y-1 ml-2">
                      <a href="https://www.theword.net" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        The Word
                      </a>
                      <a href="https://blueletterbible.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Blue Letter Bible
                      </a>
                      <a href="https://kingjamesbibledictionary.com/Dictionary/" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        King James Bible Dictionary
                      </a>
                      <a href="https://webstersdictionary1828.com/" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Websters 1828 Dictionary
                      </a>
                    </div>
                  </div>

                  {/* Commentaries & Sermons */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 border-l-2 border-blue-500 pl-2">
                      ✝️ Commentaries & Sermons
                    </h4>
                    <div className="space-y-1 ml-2">
                      <a href="https://spurgeongems.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Spurgeon Gems
                      </a>
                      <a href="https://www.sermonnotebook.org/ntsermons.htm" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Sermon Notebook
                      </a>
                      <a href="https://www.sermonindex.net" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Sermon Index Library
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}