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
        url: `https://webstersdictionary1828.com/Home?word=${word}`
      });
    }
    
    const html = await response.text();

    // Extract the main content
    let content = '';
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>/i);
    if (contentMatch) {
      content = contentMatch[1];
    }

    if (content) {
      // Clean up HTML but preserve structure
      let cleanContent = content
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<p>/gi, '')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        // Format numbered items properly
        .replace(/(\d+\.)\s*/g, '\n$1 ')
        // Clean up excessive whitespace
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
      
      return NextResponse.json({
        word: word,
        definition: cleanContent,
        source: "Webster's Dictionary 1828"
      });
    } else {
      return NextResponse.json({
        word: word,
        definition: null,
        url: `https://webstersdictionary1828.com/Home?word=${word}`
      });
    }
  } catch (error) {
    console.error('Dictionary error:', error);
    return NextResponse.json({ 
      word: word,
      definition: null,
      error: 'Failed to fetch definition'
    }, { status: 500 });
  }
}