// app/lib/verseUtils.ts

// ============================================================
// SCRIPTURE REFERENCE DETECTION
// ============================================================

// Full book names mapping for validation
const bookNames = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah',
  'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

// Common abbreviations
const bookAbbreviations: { [key: string]: string } = {
  'Gen': 'Genesis', 'Ex': 'Exodus', 'Exo': 'Exodus', 'Lev': 'Leviticus',
  'Num': 'Numbers', 'Deut': 'Deuteronomy', 'Deu': 'Deuteronomy',
  'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth',
  '1 Sam': '1 Samuel', '1 Sam.': '1 Samuel', '1 Samuel': '1 Samuel',
  '2 Sam': '2 Samuel', '2 Sam.': '2 Samuel', '2 Samuel': '2 Samuel',
  '1 Kings': '1 Kings', '1 Kgs': '1 Kings', '2 Kings': '2 Kings',
  '2 Kgs': '2 Kings', '1 Chron': '1 Chronicles', '1 Chr': '1 Chronicles',
  '2 Chron': '2 Chronicles', '2 Chr': '2 Chronicles',
  'Ezra': 'Ezra', 'Neh': 'Nehemiah', 'Est': 'Esther', 'Job': 'Job',
  'Ps': 'Psalms', 'Psa': 'Psalms', 'Prov': 'Proverbs', 'Pro': 'Proverbs',
  'Eccl': 'Ecclesiastes', 'Ecc': 'Ecclesiastes',
  'Song': 'Song of Solomon', 'Isa': 'Isaiah', 'Jer': 'Jeremiah',
  'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
  'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah',
  'Jonah': 'Jonah', 'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk',
  'Zeph': 'Zephaniah', 'Hag': 'Haggai', 'Zech': 'Zechariah',
  'Mal': 'Malachi', 'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke',
  'John': 'John', 'Acts': 'Acts', 'Rom': 'Romans', 'Cor': 'Corinthians',
  'Gal': 'Galatians', 'Eph': 'Ephesians', 'Phil': 'Philippians',
  'Col': 'Colossians', 'Thess': 'Thessalonians', 'Tim': 'Timothy',
  'Titus': 'Titus', 'Philem': 'Philemon', 'Heb': 'Hebrews',
  'James': 'James', 'Pet': 'Peter', 'Jn': 'John', 'Rev': 'Revelation'
};

// ============================================================
// DETECT SCRIPTURE REFERENCES IN TEXT
// ============================================================
export interface ScriptureReference {
  text: string;        // The full matched text (e.g., "(John 3:16)")
  reference: string;   // The clean reference (e.g., "John 3:16")
  startIndex: number;  // Start position in the text
  endIndex: number;    // End position in the text
}

export function detectScriptureReferences(text: string): ScriptureReference[] {
  const references: ScriptureReference[] = [];
  
  // Pattern: (Book Chapter:Verse) or (Book Chapter:Verse-Verse)
  // Handles: (John 3:16), (Genesis 1:1-3), (1 Corinthians 13:2)
  const pattern = /\(((?:[1-3]?\s?[A-Za-z]+)\s+\d+:\d+(?:-\d+)?)\)/g;
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const fullMatch = match[0];
    const referenceText = match[1];
    const startIndex = match.index;
    const endIndex = match.index + fullMatch.length;
    
    // Validate if it's a real book name
    const bookPart = referenceText.replace(/\s*\d+:\d+(?:-\d+)?$/, '').trim();
    const isValidBook = isValidBookName(bookPart);
    
    if (isValidBook) {
      references.push({
        text: fullMatch,
        reference: referenceText,
        startIndex,
        endIndex
      });
    }
  }
  
  return references;
}

// ============================================================
// VALIDATE BOOK NAME
// ============================================================
function isValidBookName(book: string): boolean {
  // Check exact match
  if (bookNames.includes(book)) return true;
  
  // Check abbreviation
  if (bookAbbreviations[book]) return true;
  
  // Try case-insensitive check
  const lowerBook = book.toLowerCase();
  if (bookNames.some(name => name.toLowerCase() === lowerBook)) return true;
  
  // Check if it's in abbreviations (case-insensitive)
  if (Object.keys(bookAbbreviations).some(abbr => abbr.toLowerCase() === lowerBook)) return true;
  
  return false;
}

// ============================================================
// FORMAT REFERENCE FOR DISPLAY
// ============================================================
export function formatReferenceForDisplay(reference: string): string {
  // If it has parentheses, keep them
  if (reference.startsWith('(') && reference.endsWith(')')) {
    return reference;
  }
  return `(${reference})`;
}

// ============================================================
// GET VERSE REFERENCE FOR LOOKUP
// ============================================================
export function getVerseForLookup(reference: string): string {
  // Remove parentheses if present
  let cleanRef = reference.replace(/^\(|\)$/g, '');
  
  // Expand abbreviations (e.g., "Gen 3:16" → "Genesis 3:16")
  const parts = cleanRef.match(/^(.+?)\s+(\d+:\d+(?:-\d+)?)$/);
  if (parts) {
    const book = parts[1].trim();
    const verse = parts[2].trim();
    
    // Check if book is an abbreviation
    const expandedBook = bookAbbreviations[book] || book;
    return `${expandedBook} ${verse}`;
  }
  
  return cleanRef;
}