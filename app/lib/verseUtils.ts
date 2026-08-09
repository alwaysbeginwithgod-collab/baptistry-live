// Bible book name mapping (short to full)
const bookNames: { [key: string]: string } = {
  'gen': 'Genesis',
  'ex': 'Exodus',
  'exo': 'Exodus',
  'lev': 'Leviticus',
  'num': 'Numbers',
  'deut': 'Deuteronomy',
  'josh': 'Joshua',
  'judg': 'Judges',
  'ruth': 'Ruth',
  '1 sam': '1 Samuel',
  '2 sam': '2 Samuel',
  '1 kings': '1 Kings',
  '2 kings': '2 Kings',
  '1 chron': '1 Chronicles',
  '2 chron': '2 Chronicles',
  'ezra': 'Ezra',
  'neh': 'Nehemiah',
  'est': 'Esther',
  'job': 'Job',
  'ps': 'Psalms',
  'psalm': 'Psalms',
  'prov': 'Proverbs',
  'eccl': 'Ecclesiastes',
  'song': 'Song of Solomon',
  'isa': 'Isaiah',
  'jer': 'Jeremiah',
  'lam': 'Lamentations',
  'ezek': 'Ezekiel',
  'dan': 'Daniel',
  'hos': 'Hosea',
  'joel': 'Joel',
  'amos': 'Amos',
  'obad': 'Obadiah',
  'jonah': 'Jonah',
  'mic': 'Micah',
  'nah': 'Nahum',
  'hab': 'Habakkuk',
  'zeph': 'Zephaniah',
  'hag': 'Haggai',
  'zech': 'Zechariah',
  'mal': 'Malachi',
  'matt': 'Matthew',
  'mark': 'Mark',
  'luke': 'Luke',
  'john': 'John',
  'acts': 'Acts',
  'rom': 'Romans',
  '1 cor': '1 Corinthians',
  '2 cor': '2 Corinthians',
  'gal': 'Galatians',
  'eph': 'Ephesians',
  'phil': 'Philippians',
  'col': 'Colossians',
  '1 thes': '1 Thessalonians',
  '2 thes': '2 Thessalonians',
  '1 tim': '1 Timothy',
  '2 tim': '2 Timothy',
  'titus': 'Titus',
  'philem': 'Philemon',
  'heb': 'Hebrews',
  'james': 'James',
  '1 pet': '1 Peter',
  '2 pet': '2 Peter',
  '1 john': '1 John',
  '2 john': '2 John',
  '3 john': '3 John',
  'jude': 'Jude',
  'rev': 'Revelation',
};

// Full book names list for matching
const fullBookNames = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms',
  'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah',
  'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea',
  'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
  'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John',
  '3 John', 'Jude', 'Revelation'
];

// Build regex pattern for all books
const allBooksPattern = `(?:${fullBookNames.map(b => b.replace(/\s/g, '\\s?')).join('|')}|${Object.keys(bookNames).map(b => b.replace(/\s/g, '\\s?')).join('|')})`;

// Main regex for finding verse references
const verseRegex = new RegExp(
  `(?:^|[^A-Za-z])(${allBooksPattern})\\s+(\\d+):(\\d+)(?:-(\\d+))?`,
  'gi'
);

// Regex for parenthetical references: (Luke 1:2)
const parentheticalRegex = new RegExp(
  `\\((${allBooksPattern})\\s+(\\d+):(\\d+)(?:-(\\d+))?\\)`,
  'gi'
);

interface VerseReference {
  book: string;
  chapter: number;
  verse: number;
  verseEnd?: number;
  fullText: string;
  startIndex: number;
  endIndex: number;
  isParenthetical: boolean;
}

/**
 * Normalize a book name (short or full) to its full name
 */
function normalizeBookName(name: string): string | null {
  const lowerName = name.toLowerCase().trim();
  
  // Check if it's already a full book name
  for (const book of fullBookNames) {
    if (book.toLowerCase() === lowerName) {
      return book;
    }
  }
  
  // Check if it's a short name
  for (const [short, full] of Object.entries(bookNames)) {
    if (short.toLowerCase() === lowerName) {
      return full;
    }
  }
  
  return null;
}

/**
 * Find all Bible verse references in a text
 */
export function findVerseReferences(text: string): VerseReference[] {
  const results: VerseReference[] = [];
  
  // Find parenthetical references first
  let match;
  while ((match = parentheticalRegex.exec(text)) !== null) {
    const bookName = normalizeBookName(match[1]);
    if (bookName) {
      results.push({
        book: bookName,
        chapter: parseInt(match[2]),
        verse: parseInt(match[3]),
        verseEnd: match[4] ? parseInt(match[4]) : undefined,
        fullText: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        isParenthetical: true,
      });
    }
  }
  
  // Find regular references
  verseRegex.lastIndex = 0;
  while ((match = verseRegex.exec(text)) !== null) {
    // Skip if this match overlaps with a parenthetical reference
    const isOverlapping = results.some(r => 
      match.index >= r.startIndex && match.index < r.endIndex
    );
    if (isOverlapping) continue;
    
    const bookName = normalizeBookName(match[1]);
    if (bookName) {
      results.push({
        book: bookName,
        chapter: parseInt(match[2]),
        verse: parseInt(match[3]),
        verseEnd: match[4] ? parseInt(match[4]) : undefined,
        fullText: match[0].trim(),
        startIndex: match.index + (match[0].match(/^\s*[^A-Za-z]?/) ? 1 : 0),
        endIndex: match.index + match[0].length,
        isParenthetical: false,
      });
    }
  }
  
  // Sort by start index
  results.sort((a, b) => a.startIndex - b.startIndex);
  
  return results;
}

/**
 * Format a verse reference as a string
 */
export function formatVerseReference(book: string, chapter: number, verse: number, verseEnd?: number): string {
  return verseEnd ? `${book} ${chapter}:${verse}-${verseEnd}` : `${book} ${chapter}:${verse}`;
}

/**
 * Get the KJV verse text from the Bible API
 */
export async function getVerseText(reference: string): Promise<string> {
  try {
    // Use the Bible API
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`);
    if (!response.ok) throw new Error('Verse not found');
    const data = await response.json();
    return data.text || 'Verse not found';
  } catch (error) {
    console.error('Error fetching verse:', error);
    return 'Unable to load verse. Please try again.';
  }
}