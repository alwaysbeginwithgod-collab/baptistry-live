import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'No word provided' }, { status: 400 });
  }

  try {
    // Use the direct dictionary URL
    const url = `https://webstersdictionary1828.com/Dictionary/${encodeURIComponent(word)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({
        word: word,
        definition: null,
        message: `Could not find "${word}" in Webster's 1828 Dictionary.`
      });
    }
    
    const html = await response.text();

    // Extract the definition using multiple methods
    let definition = '';
    
    // Method 1: Look for the definition in the content div
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>/);
    if (contentMatch && contentMatch[1]) {
      let text = contentMatch[1];
      // Remove HTML tags but preserve line breaks from <br> and <p>
      text = text.replace(/<br\s*\/?>/gi, '\n');
      text = text.replace(/<p>/gi, '\n');
      text = text.replace(/<\/p>/gi, '');
      text = text.replace(/<[^>]*>/g, '');
      // Clean up entities
      text = text.replace(/&nbsp;/g, ' ');
      text = text.replace(/&amp;/g, '&');
      text = text.replace(/&quot;/g, '"');
      // Clean up excessive whitespace
      text = text.replace(/\s+/g, ' ').trim();
      // Format numbered items
      text = text.replace(/(\d+\.)\s*/g, '\n$1 ');
      definition = text;
    }
    
    // Method 2: Look for the definition after the word heading
    if (!definition || definition.length < 30) {
      // Find the section after the word
      const wordPattern = new RegExp(`${word.toUpperCase()}[^<]*<\\/h\\d>[\\s\\S]*?<p>([\\s\\S]*?)<\\/p>`, 'i');
      const match = html.match(wordPattern);
      if (match && match[1]) {
        let text = match[1];
        text = text.replace(/<[^>]*>/g, '');
        text = text.replace(/\s+/g, ' ').trim();
        text = text.replace(/(\d+\.)/g, '\n$1');
        definition = text;
      }
    }
    
    // Method 3: Look for any paragraph with numbered content
    if (!definition || definition.length < 30) {
      const paraMatch = html.match(/<p>(\d+\..*?)<\/p>/i);
      if (paraMatch && paraMatch[1]) {
        definition = paraMatch[1].replace(/<[^>]*>/g, '').trim();
      }
    }

    if (definition && definition.length > 10) {
      // Clean up the definition
      definition = definition
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+/, '')
        .replace(/\s+$/, '')
        .trim();
      
      return NextResponse.json({
        word: word,
        definition: definition,
        source: "Webster's Dictionary 1828"
      });
    } else {
      // Return just the URL as fallback
      return NextResponse.json({
        word: word,
        definition: null,
        message: `"${word}" - View the full definition online:`,
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