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

    // Extract the word title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const wordTitle = titleMatch ? titleMatch[1].replace(' - Webster\'s Dictionary 1828', '') : word;

    // Extract the main content
    let content = '';
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>/i);
    if (contentMatch) {
      content = contentMatch[1];
    } else {
      // Fallback: look for definition paragraphs
      const defMatch = html.match(/<p><strong>\w+\.<\/strong>([\s\S]*?)<\/p>/i);
      if (defMatch) {
        content = defMatch[1];
      }
    }

    if (content) {
      // Clean but preserve structure
      let cleanContent = content
        // Remove HTML tags but keep line breaks
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<p>/gi, '\n')
        .replace(/<\/p>/gi, '')
        .replace(/<[^>]*>/g, '')
        // Clean up special characters
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        // Clean up excessive whitespace
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
      
      // Add back the word header if needed
      let formattedDefinition = cleanContent;
      
      // If the definition doesn't start with the word, add it
      if (!cleanContent.toLowerCase().startsWith(word.toLowerCase())) {
        formattedDefinition = `${wordTitle.toUpperCase()}\n\n${cleanContent}`;
      }
      
      return NextResponse.json({
        word: word,
        definition: cleanContent,
        formatted: formattedDefinition,
        source: "Webster's Dictionary 1828",
        url: foundUrl
      });
    } else {
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