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
        message: `"${word}" - View the definition online:`,
        url: `https://webstersdictionary1828.com/Dictionary/${word}`
      });
    }
    
    const html = await response.text();

    // Extract definition from the page using simpler methods
    let definition = '';
    
    // Method 1: Look for the content div
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>/);
    if (contentMatch && contentMatch[1]) {
      let text = contentMatch[1];
      // Remove HTML tags
      text = text.replace(/<[^>]*>/g, '');
      // Clean up whitespace
      text = text.replace(/\s+/g, ' ').trim();
      // Add line breaks for numbered items
      text = text.replace(/(\d+\.)/g, '\n$1');
      // Remove extra spaces after newlines
      text = text.replace(/\n\s+/g, '\n');
      definition = text;
    }
    
    // Method 2: Look for definition paragraphs
    if (!definition || definition.length < 50) {
      const paraMatch = html.match(/<p>([\s\S]*?)<\/p>/);
      if (paraMatch && paraMatch[1]) {
        let text = paraMatch[1];
        text = text.replace(/<[^>]*>/g, '');
        text = text.replace(/\s+/g, ' ').trim();
        text = text.replace(/(\d+\.)/g, '\n$1');
        definition = text;
      }
    }

    if (definition && definition.length > 30) {
      return NextResponse.json({
        word: word,
        definition: definition,
        source: "Webster's Dictionary 1828"
      });
    } else {
      // Return the URL for the user to view directly
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
      message: `Unable to fetch definition. View online:`,
      url: `https://webstersdictionary1828.com/Dictionary/${word}`
    });
  }
}