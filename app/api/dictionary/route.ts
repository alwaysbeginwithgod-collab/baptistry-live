import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'No word provided' }, { status: 400 });
  }

  try {
    // Try multiple URL patterns
    const urlsToTry = [
      `https://webstersdictionary1828.com/Dictionary/${encodeURIComponent(word)}`,
      `https://webstersdictionary1828.com/Dictionary/${encodeURIComponent(word.toLowerCase())}`,
      `https://webstersdictionary1828.com/Home?word=${encodeURIComponent(word)}`
    ];
    
    let html = '';
    let usedUrl = '';
    
    for (const url of urlsToTry) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          html = await response.text();
          usedUrl = url;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!html) {
      return NextResponse.json({
        word: word,
        definition: null,
        message: `"${word}" not found. Try searching directly:`,
        url: `https://webstersdictionary1828.com/Home?word=${word}`
      });
    }

    // Extract definition - look for content between <p> tags near the word
    let definition = '';
    
    // Look for the main content area
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>/i);
    if (contentMatch) {
      let text = contentMatch[1];
      // Remove HTML tags
      text = text.replace(/<[^>]*>/g, '');
      // Clean up whitespace
      text = text.replace(/\s+/g, ' ').trim();
      
      // If the text contains numbered definitions, preserve them
      if (text.match(/\d+\./)) {
        definition = text.replace(/(\d+\.)/g, '\n$1').trim();
      } else if (text.length > 20) {
        definition = text;
      }
    }
    
    // If no content div, try to find definition paragraphs directly
    if (!definition) {
      // Look for definition after the word heading
      const wordIndex = html.toLowerCase().indexOf(word.toLowerCase());
      if (wordIndex !== -1) {
        const snippet = html.substring(wordIndex, wordIndex + 2000);
        const defMatch = snippet.match(/<p>([\s\S]*?)<\/p>/i);
        if (defMatch && defMatch[1]) {
          let text = defMatch[1];
          text = text.replace(/<[^>]*>/g, '');
          text = text.replace(/\s+/g, ' ').trim();
          definition = text;
        }
      }
    }

    if (definition && definition.length > 10) {
      // Clean up the definition
      definition = definition
        .replace(/\s+/g, ' ')
        .replace(/(\d+\.)/g, '\n$1')
        .trim();
      
      return NextResponse.json({
        word: word,
        definition: definition,
        source: "Webster's Dictionary 1828"
      });
    } else {
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
      message: `Unable to fetch definition. Try searching directly:`,
      url: `https://webstersdictionary1828.com/Dictionary/${word}`
    });
  }
}