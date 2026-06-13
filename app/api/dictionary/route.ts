import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'No word provided' }, { status: 400 });
  }

  try {
    // Try multiple URL patterns that the website might use
    const urlsToTry = [
      `https://webstersdictionary1828.com/Dictionary/${encodeURIComponent(word)}`,
      `https://webstersdictionary1828.com/Home?word=${encodeURIComponent(word)}`,
      `https://webstersdictionary1828.com/${encodeURIComponent(word)}`
    ];
    
    let html = '';
    let foundUrl = '';
    
    for (const url of urlsToTry) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          html = await response.text();
          foundUrl = url;
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
        message: `"${word}" not found in Webster's 1828 Dictionary.`,
        source: "Webster's Dictionary 1828",
        url: `https://webstersdictionary1828.com/Home?word=${word}`
      });
    }

    // Extract the definition content
    let definition = '';
    
    // Look for the main definition content
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>/i);
    if (contentMatch) {
      let content = contentMatch[1];
      // Remove HTML tags
      definition = content.replace(/<[^>]*>/g, '');
      // Clean up whitespace
      definition = definition.replace(/\s+/g, ' ').trim();
      // Format numbered definitions
      definition = definition.replace(/(\d+\.)\s*/g, '\n$1 ');
    }
    
    // If still empty, try other patterns
    if (!definition || definition.length < 20) {
      const definitionMatch = html.match(/<p><strong>\w+\.<\/strong>\s*([\s\S]*?)<\/p>/i);
      if (definitionMatch) {
        definition = definitionMatch[1].replace(/<[^>]*>/g, '').trim();
      }
    }

    if (definition && definition.length > 10) {
      return NextResponse.json({
        word: word,
        definition: definition,
        source: "Webster's Dictionary 1828",
        url: foundUrl
      });
    } else {
      // Word exists but couldn't parse - provide the URL
      return NextResponse.json({
        word: word,
        definition: null,
        message: `"${word}" is in Webster's 1828 Dictionary! View the full definition online:`,
        source: "Webster's Dictionary 1828",
        url: `https://webstersdictionary1828.com/Home?word=${word}`
      });
    }
  } catch (error) {
    console.error('Dictionary error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch definition',
      message: `Unable to reach the dictionary service. You can search directly at:\nhttps://webstersdictionary1828.com/Home?word=${word}`
    }, { status: 500 });
  }
}