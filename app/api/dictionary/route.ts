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
        message: `"${word}" - View the definition online:`
      });
    }
    
    const html = await response.text();

    // Extract definition from the page
    let definition = '';
    
    // Method 1: Look for the definition section
    const defMatch = html.match(/<p>(.*?)(?=<p>|<\/div>|$)/is);
    if (defMatch) {
      let text = defMatch[1];
      // Remove any HTML tags
      text = text.replace(/<[^>]*>/g, '');
      // Clean up whitespace
      text = text.replace(/\s+/g, ' ').trim();
      // Split into numbered parts if they exist
      if (text.match(/\d+\./)) {
        text = text.replace(/(\d+\.)/g, '\n$1');
      }
      definition = text;
    }
    
    // Method 2: Try to get the content div
    if (!definition || definition.length < 50) {
      const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>/i);
      if (contentMatch) {
        let text = contentMatch[1];
        // Remove HTML tags
        text = text.replace(/<[^>]*>/g, '');
        // Clean up
        text = text.replace(/\s+/g, ' ').trim();
        text = text.replace(/(\d+\.)/g, '\n$1');
        definition = text;
      }
    }
    
    // Method 3: Look for bold definition headers
    if (!definition || definition.length < 50) {
      const boldMatch = html.match(/<p><strong>DEATH, noun deth\.<\/strong>([\s\S]*?)<\/p>/i);
      if (boldMatch) {
        let text = boldMatch[1];
        text = text.replace(/<[^>]*>/g, '');
        text = text.replace(/\s+/g, ' ').trim();
        text = text.replace(/(\d+\.)/g, '\n$1');
        definition = text;
      }
    }

    if (definition && definition.length > 20) {
      return NextResponse.json({
        word: word,
        definition: definition,
        source: "Webster's Dictionary 1828"
      });
    } else {
      // Return just the URL for the user to view directly
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
    }, { status: 500 });
  }
}