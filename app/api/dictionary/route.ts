import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'No word provided' }, { status: 400 });
  }

  try {
    // Fetch from Webster's 1828 website
    const url = `https://webstersdictionary1828.com/Dictionary/${encodeURIComponent(word)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({
        word: word,
        definition: null,
        message: `"${word}" not found in Webster's 1828 Dictionary.`
      });
    }
    
    const html = await response.text();

    // Check if the page is a valid dictionary page
    if (html.includes('404') || html.includes('Not Found')) {
      return NextResponse.json({
        word: word,
        definition: null,
        message: `"${word}" not found in Webster's 1828 Dictionary.`
      });
    }

    // Extract the definition
    let definition = '';
    
    // Method 1: Look for the content div
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>/);
    if (contentMatch && contentMatch[1]) {
      let text = contentMatch[1];
      // Remove HTML tags
      text = text.replace(/<[^>]*>/g, '');
      // Clean up whitespace
      text = text.replace(/\s+/g, ' ').trim();
      // Format numbered definitions
      text = text.replace(/(\d+\.)/g, '\n$1');
      definition = text;
    }
    
    // Method 2: If no content div, try looking for paragraphs
    if (!definition || definition.length < 20) {
      const paraMatch = html.match(/<p>([\s\S]*?)<\/p>/);
      if (paraMatch && paraMatch[1]) {
        let text = paraMatch[1];
        text = text.replace(/<[^>]*>/g, '');
        text = text.replace(/\s+/g, ' ').trim();
        text = text.replace(/(\d+\.)/g, '\n$1');
        definition = text;
      }
    }

    // Method 3: Try to extract from the page title
    if (!definition || definition.length < 20) {
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      if (titleMatch) {
        const title = titleMatch[1].replace(' - Webster\'s Dictionary 1828', '');
        // Check if the page has the word in the title (indicates it's valid)
        if (title.toLowerCase().includes(word.toLowerCase())) {
          // Try to get any text after the title
          const textMatch = html.match(/<p>(.*?)<\/p>/g);
          if (textMatch) {
            let combined = textMatch.map(p => p.replace(/<[^>]*>/g, '').trim()).join('\n');
            combined = combined.replace(/(\d+\.)/g, '\n$1');
            definition = combined.substring(0, 1000);
          }
        }
      }
    }

    // If we found a definition
    if (definition && definition.length > 10) {
      // Clean up the definition
      definition = definition
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+/, '')
        .replace(/\s+$/, '')
        .trim();
      
      // Limit to a reasonable length
      if (definition.length > 3000) {
        definition = definition.substring(0, 3000);
      }
      
      return NextResponse.json({
        word: word,
        definition: definition,
        source: "Webster's Dictionary 1828"
      });
    } else {
      return NextResponse.json({
        word: word,
        definition: null,
        message: `"${word}" - Could not parse definition. View online:`,
        url: `https://webstersdictionary1828.com/Dictionary/${word}`
      });
    }
  } catch (error) {
    console.error('Dictionary error:', error);
    return NextResponse.json({ 
      word: word,
      definition: null,
      error: 'Failed to fetch definition',
      url: `https://webstersdictionary1828.com/Dictionary/${word}`
    });
  }
}