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
        message: `"${word}" not found.`
      });
    }
    
    const html = await response.text();

    // Get the main content area
    const contentStart = html.indexOf('<div class="content">');
    const contentEnd = html.indexOf('</div>', contentStart);
    
    if (contentStart === -1 || contentEnd === -1) {
      return NextResponse.json({
        word: word,
        definition: null,
        message: `"${word}" - View online:`,
        url: url
      });
    }
    
    let content = html.substring(contentStart, contentEnd);
    
    // Remove HTML tags but preserve structure
    content = content.replace(/<br\s*\/?>/gi, '\n');
    content = content.replace(/<p>/gi, '\n');
    content = content.replace(/<\/p>/gi, '');
    content = content.replace(/<strong>/gi, '');
    content = content.replace(/<\/strong>/gi, '');
    content = content.replace(/<[^>]*>/g, '');
    
    // Clean up entities
    content = content.replace(/&nbsp;/g, ' ');
    content = content.replace(/&amp;/g, '&');
    content = content.replace(/&quot;/g, '"');
    content = content.replace(/&#39;/g, "'");
    
    // Split into lines and clean
    const lines = content.split('\n');
    const cleanedLines = lines
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Extract numbered definitions (starting with 1., 2., etc.)
    const numberedDefs = [];
    let currentDef = '';
    
    for (const line of cleanedLines) {
      if (line.match(/^\d+\./)) {
        if (currentDef) numberedDefs.push(currentDef);
        currentDef = line;
      } else if (currentDef && line.length > 0) {
        currentDef += ' ' + line;
      }
    }
    if (currentDef) numberedDefs.push(currentDef);
    
    // Also look for the part of speech (first line before numbers)
    let partOfSpeech = '';
    for (const line of cleanedLines) {
      if (line.includes(',') && line.length < 100 && !line.match(/^\d+\./)) {
        partOfSpeech = line;
        break;
      }
    }
    
    if (numberedDefs.length > 0) {
      let definitionText = '';
      if (partOfSpeech) {
        definitionText = partOfSpeech + '\n\n';
      }
      definitionText += numberedDefs.join('\n');
      
      return NextResponse.json({
        word: word,
        definition: definitionText,
        source: "Webster's Dictionary 1828"
      });
    } else {
      // If no numbered definitions, return the first few lines of content
      const firstFew = cleanedLines.slice(0, 5).join('\n');
      if (firstFew.length > 20) {
        return NextResponse.json({
          word: word,
          definition: firstFew,
          source: "Webster's Dictionary 1828"
        });
      }
      
      return NextResponse.json({
        word: word,
        definition: null,
        message: `"${word}" - View the full definition:`,
        url: url
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