'use client';

import { useState, useRef, useEffect } from 'react';

type Tool = 'bible' | 'dictionary' | 'reference' | null;

interface RightSidebarProps {
  messages?: Array<{ id: string; role: string; content: string; timestamp: Date }>;
  onScrollToMessage?: (messageId: string) => void;
}

// ============================================================
// BIBLE BOOK SHORTCODES
// ============================================================
const bookShortcodes: { [key: string]: string } = {
  // Old Testament
  'gen': 'Genesis',
  'exo': 'Exodus',
  'lev': 'Leviticus',
  'num': 'Numbers',
  'deu': 'Deuteronomy',
  'jos': 'Joshua',
  'josh': 'Joshua',
  'jgs': 'Judges',
  'judg': 'Judges',
  'rut': 'Ruth',
  'rth': 'Ruth',
  '1sa': '1 Samuel',
  '1sam': '1 Samuel',
  '2sa': '2 Samuel',
  '2sam': '2 Samuel',
  '1ki': '1 Kings',
  '1kgs': '1 Kings',
  '2ki': '2 Kings',
  '2kgs': '2 Kings',
  '1ch': '1 Chronicles',
  '1chr': '1 Chronicles',
  '2ch': '2 Chronicles',
  '2chr': '2 Chronicles',
  'ezr': 'Ezra',
  'neh': 'Nehemiah',
  'est': 'Esther',
  'job': 'Job',
  'psa': 'Psalms',
  'ps': 'Psalms',
  'pss': 'Psalms',
  'pro': 'Proverbs',
  'prov': 'Proverbs',
  'ecc': 'Ecclesiastes',
  'eccl': 'Ecclesiastes',
  'sol': 'Song of Solomon',
  'song': 'Song of Solomon',
  'isa': 'Isaiah',
  'jer': 'Jeremiah',
  'lam': 'Lamentations',
  'ezk': 'Ezekiel',
  'dan': 'Daniel',
  'hos': 'Hosea',
  'joe': 'Joel',
  'amo': 'Amos',
  'oba': 'Obadiah',
  'jon': 'Jonah',
  'mic': 'Micah',
  'nah': 'Nahum',
  'hab': 'Habakkuk',
  'zep': 'Zephaniah',
  'hag': 'Haggai',
  'zac': 'Zechariah',
  'mal': 'Malachi',
  
  // New Testament
  'mat': 'Matthew',
  'matt': 'Matthew',
  'mar': 'Mark',
  'mrk': 'Mark',
  'luk': 'Luke',
  'joh': 'John',
  'jn': 'John',
  'acts': 'Acts',
  'rom': 'Romans',
  '1co': '1 Corinthians',
  '1cor': '1 Corinthians',
  '2co': '2 Corinthians',
  '2cor': '2 Corinthians',
  'gal': 'Galatians',
  'eph': 'Ephesians',
  'phi': 'Philippians',
  'phil': 'Philippians',
  'col': 'Colossians',
  '1th': '1 Thessalonians',
  '1thess': '1 Thessalonians',
  '2th': '2 Thessalonians',
  '2thess': '2 Thessalonians',
  '1ti': '1 Timothy',
  '1tim': '1 Timothy',
  '2ti': '2 Timothy',
  '2tim': '2 Timothy',
  'tit': 'Titus',
  'phm': 'Philemon',
  'heb': 'Hebrews',
  'jam': 'James',
  '1pe': '1 Peter',
  '1pet': '1 Peter',
  '2pe': '2 Peter',
  '2pet': '2 Peter',
  '1jo': '1 John',
  '1jn': '1 John',
  '2jo': '2 John',
  '2jn': '2 John',
  '3jo': '3 John',
  '3jn': '3 John',
  'jud': 'Jude',
  'rev': 'Revelation',
};

// ============================================================
// FUNCTION: Convert shortcode to full book name
// ============================================================
function expandBookName(input: string): string {
  const match = input.match(/^([a-zA-Z0-9]+)\s+(.+)$/);
  if (!match) return input;
  
  const bookPart = match[1].toLowerCase();
  const rest = match[2];
  
  const fullBook = bookShortcodes[bookPart];
  if (fullBook) {
    return `${fullBook} ${rest}`;
  }
  
  return input;
}

// ============================================================
// FUNCTION: Format Bible reference (adds colon if missing)
// ============================================================
function formatBibleReference(input: string): string {
  const expanded = expandBookName(input);
  
  const match = expanded.match(/^(.+?)\s+(\d+)\s+(\d+)$/);
  if (match) {
    const book = match[1];
    const chapter = match[2];
    const verse = match[3];
    return `${book} ${chapter}:${verse}`;
  }
  
  return expanded;
}

export default function RightSidebar({ messages = [], onScrollToMessage }: RightSidebarProps) {
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [bibleQuery, setBibleQuery] = useState('');
  const [bibleResult, setBibleResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dictionaryWord, setDictionaryWord] = useState('');
  const [dictionaryResult, setDictionaryResult] = useState('');
  const toolPanelRef = useRef<HTMLDivElement>(null);
  
  // TOC state
  const [isTocOpen, setIsTocOpen] = useState(false);
  const tocPanelRef = useRef<HTMLDivElement>(null);
  const tocButtonRef = useRef<HTMLButtonElement>(null);

  // Filter only user messages for TOC
  const userMessages = messages.filter(m => m.role === 'user');

  const searchBible = async () => {
    if (!bibleQuery.trim()) return;
    setIsLoading(true);
    setBibleResult('Searching...');

    try {
      const expandedQuery = expandBookName(bibleQuery.trim());
      const formattedQuery = formatBibleReference(expandedQuery);
      
      if (bibleQuery.trim() !== formattedQuery) {
        console.log('📖 Converted:', bibleQuery.trim(), '→', formattedQuery);
      }
      
      const encodedQuery = encodeURIComponent(formattedQuery.replace(/ /g, '+'));
      const apiUrl = `https://dailybible.ca/api/${encodedQuery}?translation=kjv`;

      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();

        if (data.verses && data.verses.length > 0) {
          const formattedVerses = data.verses.map((v: any) => {
            return `v${v.verse} - ${v.text}`;
          }).join('\n');

          setBibleResult(`${data.reference || formattedQuery} (KJV)\n\n${formattedVerses}`);
        } else if (data.text) {
          setBibleResult(`${data.reference || formattedQuery} (KJV)\n\n"${data.text}"`);
        } else {
          setBibleResult(`${formattedQuery} - Not found.`);
        }
      } else {
        setBibleResult(`${formattedQuery} - Not found.`);
      }
    } catch (error) {
      console.error('Bible API error:', error);
      setBibleResult(`Unable to fetch at this time.`);
    }
    setIsLoading(false);
  };

  const searchDictionary = async () => {
    if (!dictionaryWord.trim()) return;
    setIsLoading(true);
    setDictionaryResult('Searching Webster\'s 1828 Dictionary...');

    try {
      const response = await fetch(`/api/dictionary?word=${encodeURIComponent(dictionaryWord.trim())}`);
      const data = await response.json();
      
      if (response.ok && data.definition) {
        let displayText = data.definition;
        displayText = displayText.replace(/(\d+\.)/g, '\n$1');
        displayText = displayText.replace(/\n\s*\n/g, '\n').trim();
        setDictionaryResult(`${displayText}\n\n— ${data.source}`);
      } else {
        setDictionaryResult(`"${dictionaryWord}" - ${data.message || 'Definition not found in Webster\'s 1828 Dictionary.'}`);
      }
    } catch (error) {
      console.error('Dictionary API error:', error);
      setDictionaryResult(`Unable to fetch definition. Please try again later.`);
    }
    setIsLoading(false);
  };

  const closeTool = () => {
    setActiveTool(null);
    setBibleResult('');
    setDictionaryWord('');
    setDictionaryResult('');
  };

  // ============================================================
  // CLICK OUTSIDE HANDLER - Close TOC when clicking outside
  // ============================================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsidePanel = tocPanelRef.current && !tocPanelRef.current.contains(event.target as Node);
      const isOutsideButton = tocButtonRef.current && !tocButtonRef.current.contains(event.target as Node);
      
      if (isTocOpen && isOutsidePanel && isOutsideButton) {
        setIsTocOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isTocOpen) {
        setIsTocOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isTocOpen]);

  // Close tool panel when clicking outside
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

  // ============================================================
  // ✅ LISTEN FOR VERSE CLICKS FROM MessageBubble AND DevotionModal
  // ============================================================
  useEffect(() => {
    const handleBibleLookup = (event: CustomEvent) => {
      const reference = event.detail.reference;
      console.log('📖 RightSidebar received scripture:', reference);
      
      if (!reference) return;
      
      // ✅ Auto-open the Bible tool and load the verse
      setActiveTool('bible');
      setBibleQuery(reference);
      setBibleResult('');
      
      // ✅ Auto-search after a small delay
      setTimeout(() => {
        searchBible();
      }, 200);
    };

    window.addEventListener('bibleLookup' as any, handleBibleLookup);
    return () => {
      window.removeEventListener('bibleLookup' as any, handleBibleLookup);
    };
  }, []); // ✅ Empty dependency array - only runs once

  // ============================================================
  // TOC HANDLERS - Panel stays open when clicking messages
  // ============================================================
  const handleTocClick = (messageId: string) => {
    if (onScrollToMessage) {
      onScrollToMessage(messageId);
    }
  };

  const getPreview = (content: string) => {
    const cleanContent = content.replace(/["']/g, '').trim();
    return cleanContent.length > 40 ? cleanContent.substring(0, 40) + '...' : cleanContent;
  };

  // TooltipButton component
  const TooltipButton = ({ 
    onClick, 
    isActive, 
    icon, 
    tooltipText,
    isToc = false
  }: { 
    onClick: () => void; 
    isActive: boolean; 
    icon: React.ReactNode; 
    tooltipText: string;
    isToc?: boolean;
  }) => {
    return (
      <div className="relative group">
        <button
          onClick={onClick}
          className={`tool-icon-button p-2 rounded-lg transition-colors relative w-full ${
            isActive
              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          } ${isToc ? 'border-t border-gray-200 dark:border-gray-700 pt-4 mt-1' : ''}`}
        >
          {icon}
        </button>
        {/* Tooltip - positioned to the left */}
        <div className={`
          absolute right-full mr-2 top-1/2 -translate-y-1/2
          px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg 
          whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible 
          transition-all duration-200 pointer-events-none z-50
          shadow-lg
        `}>
          {tooltipText}
          <div className={`
            absolute -right-1 top-1/2 -translate-y-1/2
            w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45
          `}></div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Right Sidebar - Fixed position */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30">
        <div className="flex flex-col items-center gap-3 py-6 px-2 bg-white dark:bg-gray-800 rounded-l-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Tools */}
          <TooltipButton
            onClick={() => setActiveTool(activeTool === 'bible' ? null : 'bible')}
            isActive={activeTool === 'bible'}
            tooltipText="KJV Bible Lookup"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            }
          />

          <TooltipButton
            onClick={() => setActiveTool(activeTool === 'dictionary' ? null : 'dictionary')}
            isActive={activeTool === 'dictionary'}
            tooltipText="Webster's 1828 Dictionary"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7M16 18.5L19.5 15 17 12.5 13.5 16 16 19.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8l-2 4m0 0l-2-4m2 4v6" />
              </svg>
            }
          />

          <TooltipButton
            onClick={() => setActiveTool(activeTool === 'reference' ? null : 'reference')}
            isActive={activeTool === 'reference'}
            tooltipText="Baptistry Reference Library"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13v4m-4-4h8" />
              </svg>
            }
          />

          {/* Separator line and TOC Button */}
          {userMessages.length > 0 && (
            <>
              <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 my-1"></div>
              
              <div className="relative w-full group">
                <button
                  ref={tocButtonRef}
                  onClick={() => setIsTocOpen(!isTocOpen)}
                  className={`tool-icon-button p-2 rounded-lg transition-colors relative w-full ${
                    isTocOpen
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Conversation History"
                >
                  <span className="text-lg">📜</span>
                </button>
                {/* Tooltip - Only on hover, no panel opening */}
                <div className={`
                  absolute right-full mr-2 top-1/2 -translate-y-1/2
                  px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg 
                  whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                  transition-all duration-200 pointer-events-none z-50
                  shadow-lg
                `}>
                  Conversation History
                  <div className={`
                    absolute -right-1 top-1/2 -translate-y-1/2
                    w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45
                  `}></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tool Panel */}
      {activeTool && (
        <div
          ref={toolPanelRef}
          className="fixed right-12 top-1/2 transform -translate-y-1/2 z-20"
        >
          <div className="w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-[85vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {activeTool === 'bible' && '🕮 KJV Bible Lookup'}
                  {activeTool === 'dictionary' && '🔍 Webster\'s 1828 Dictionary'}
                  {activeTool === 'reference' && '📚 Baptistry Reference Library'}
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
                      placeholder="e.g., Gen 3:15, John 1, Ps 23"
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
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Resources for study and research.</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 border-l-2 border-blue-500 pl-2">📖 Doctrinal Defense</h4>
                    <div className="space-y-1 ml-2">
                      <a href="https://www.wayoflife.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">Way of Life Literature</a>
                      <a href="https://openthoumineeyes.com/" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">Doctrine Portal</a>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 border-l-2 border-blue-500 pl-2">🔍 Word Studies</h4>
                    <div className="space-y-1 ml-2">
                      <a href="https://www.theword.net" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">The Word</a>
                      <a href="https://blueletterbible.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">Blue Letter Bible</a>
                      <a href="https://kingjamesbibledictionary.com/Dictionary/" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">King James Bible Dictionary</a>
                      <a href="https://webstersdictionary1828.com/" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">Websters 1828 Dictionary</a>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 border-l-2 border-blue-500 pl-2">✝️ Commentaries & Sermons</h4>
                    <div className="space-y-1 ml-2">
                      <a href="https://spurgeongems.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">Spurgeon Gems</a>
                      <a href="https://www.sermonnotebook.org/ntsermons.htm" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">Sermon Notebook</a>
                      <a href="https://www.sermonindex.net" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">Sermon Index Library</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOC Panel - Only shows on click, overlays everything */}
      {isTocOpen && userMessages.length > 0 && (
        <div
          ref={tocPanelRef}
          className="fixed right-12 top-0 h-screen z-50 pointer-events-auto"
          style={{ width: '320px' }}
        >
          <div className="h-full w-full bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 overflow-y-auto animate-slideInRight">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="text-lg">📜</span>
                Conversation History
                <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-2">
                  {userMessages.length} {userMessages.length === 1 ? 'message' : 'messages'}
                </span>
              </h3>
              <button
                onClick={() => setIsTocOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message List */}
            <div className="p-3">
              {userMessages.map((msg, index) => (
                <button
                  key={msg.id}
                  onClick={() => handleTocClick(msg.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 group mb-1"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {getPreview(msg.content)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Click any message to jump to it in the conversation
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}