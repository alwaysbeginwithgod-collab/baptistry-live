import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'No word provided' }, { status: 400 });
  }

  try {
    const url = `https://webstersdictionary1828.com/Dictionary/${encodeURIComponent(word)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({
        word: word,
        definition: null,
        error: 'Word not found'
      });
    }
    
    const html = await response.text();

    // Find the definition section
    let definition = '';
    
    // Look for the content after the word heading
    const patterns = [
      // Pattern 1: Look for numbered definitions in the content
      /<div class="content">([\s\S]*?)<\/div>/i,
      // Pattern 2: Look for the definition paragraphs
      /<p><strong>[\w\s,]+\.<\/strong>([\s\S]*?)<\/p>/i,
      // Pattern 3: Look for any paragraph with numbered content
      /<p>(\d+\..*?)<\/p>/gi
    ];
    
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let text = match[1];
        // Remove HTML tags
        text = text.replace(/<[^>]*>/g, '');
        // Clean up whitespace
        text = text.replace(/\s+/g, ' ').trim();
        if (text.length > 50) {
          definition = text;
          break;
        }
      }
    }
    
    // If still no definition, try a different approach - extract all text from the main area
    if (!definition || definition.length < 50) {
      const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        const bodyText = bodyMatch[1];
        // Remove scripts and styles
        const cleanText = bodyText.replace(/<script[\s\S]*?<\/script>/gi, '')
                                 .replace(/<style[\s\S]*?<\/style>/gi, '')
                                 .replace(/<[^>]*>/g, ' ')
                                 .replace(/\s+/g, ' ')
                                 .trim();
        
        // Look for the word and its definition
        const wordIndex = cleanText.toLowerCase().indexOf(word.toLowerCase());
        if (wordIndex !== -1) {
          // Get a chunk of text around the word
          definition = cleanText.substring(wordIndex, wordIndex + 1500);
          // Clean up
          definition = definition.replace(/\d+\./g, '\n$&').trim();
        }
      }
    }

    if (definition && definition.length > 30) {
      // Clean up the definition
      definition = definition
        .replace(/\s+/g, ' ')
        .replace(/(\d+\.)/g, '\n$1')
        .trim();
      
      // Limit to first 10 definitions
      const parts = definition.split(/\n(?=\d+\.)/);
      const truncated = parts.slice(0, 10).join('\n');
      
      return NextResponse.json({
        word: word,
        definition: truncated,
        source: "Webster's Dictionary 1828"
      });
    } else {
      return NextResponse.json({
        word: word,
        definition: null,
        message: `Could not parse definition for "${word}". The website has the definition here:`,
        url: `https://webstersdictionary1828.com/Dictionary/${word}`
      });
    }
  } catch (error) {
    console.error('Dictionary error:', error);
    return NextResponse.json({ 
      word: word,
      definition: null,
      error: 'Failed to fetch definition'
    });
  }
}