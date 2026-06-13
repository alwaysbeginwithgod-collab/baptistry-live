import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'No word provided' }, { status: 400 });
  }

  try {
    // Fetch the definition from Webster's 1828 website
    const url = `https://webstersdictionary1828.com/Dictionary/${encodeURIComponent(word)}`;
    const response = await fetch(url);
    const html = await response.text();

    // Check if the page exists (not a 404)
    if (html.includes('404') || html.includes('Not Found')) {
      return NextResponse.json({
        word: word,
        definition: null,
        message: `"${word}" not found in Webster's 1828 Dictionary.`,
        source: "Webster's Dictionary 1828"
      });
    }

    // Extract the word/title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const wordTitle = titleMatch ? titleMatch[1].replace(' - Webster\'s Dictionary 1828', '') : word;

    // Extract the definition content - look for the main content area
    let definitionHtml = '';
    
    // Method 1: Get the main content div
    const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>/i);
    if (contentMatch) {
      definitionHtml = contentMatch[1];
    }
    
    // Method 2: If not found, try to get definition from paragraph sections
    if (!definitionHtml) {
      const definitionMatch = html.match(/<p><strong>\w+\.<\/strong>([\s\S]*?)<\/p>/gi);
      if (definitionMatch) {
        definitionHtml = definitionMatch.join('\n');
      }
    }

    // Method 3: Extract numbered definitions (1., 2., etc.)
    if (!definitionHtml || definitionHtml.length < 50) {
      const numberedMatch = html.match(/<p>(\d+\.\s*[\s\S]*?)<\/p>/gi);
      if (numberedMatch) {
        definitionHtml = numberedMatch.join('\n');
      }
    }

    // Clean up the definition
    if (definitionHtml) {
      // Remove HTML tags
      let cleanDefinition = definitionHtml.replace(/<[^>]*>/g, '');
      // Clean up whitespace
      cleanDefinition = cleanDefinition.replace(/\s+/g, ' ').trim();
      // Fix numbering format
      cleanDefinition = cleanDefinition.replace(/(\d+\.)\s*/g, '\n$1 ');
      // Remove empty lines
      cleanDefinition = cleanDefinition.replace(/\n\s*\n/g, '\n');
      
      // Format the response nicely
      const formattedDefinition = `**${wordTitle.toUpperCase()}** (Webster's Dictionary 1828)\n\n${cleanDefinition}\n\n*Source: https://webstersdictionary1828.com*`;
      
      return NextResponse.json({
        word: word,
        definition: cleanDefinition,
        formatted: formattedDefinition,
        source: "Webster's Dictionary 1828",
        url: url
      });
    } else {
      return NextResponse.json({
        word: word,
        definition: null,
        message: `Could not parse definition for "${word}". Visit the source directly.`,
        source: "Webster's Dictionary 1828",
        url: url
      });
    }
  } catch (error) {
    console.error('Dictionary error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch definition',
      message: 'Unable to reach the dictionary service. Please try again later.'
    }, { status: 500 });
  }
}