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
        message: `Could not find "${word}" in Webster's 1828 Dictionary.`
      });
    }
    
    const html = await response.text();

    // Extract the numbered definitions
    let definitions = [];
    
    // Look for numbered list items (1., 2., 3., etc.)
    const numberedPattern = /<p>(\d+\.\s*[^<]+)<\/p>/gi;
    let match;
    while ((match = numberedPattern.exec(html)) !== null) {
      let text = match[1];
      // Clean up HTML entities
      text = text.replace(/&nbsp;/g, ' ');
      text = text.replace(/&amp;/g, '&');
      text = text.replace(/&quot;/g, '"');
      definitions.push(text.trim());
    }
    
    // If no numbered items, look for definitions in a different format
    if (definitions.length === 0) {
      const altPattern = /<p>([\d]+\.\s*[\s\S]*?)<\/p>/gi;
      while ((match = altPattern.exec(html)) !== null) {
        let text = match[1];
        text = text.replace(/<[^>]*>/g, '');
        text = text.replace(/\s+/g, ' ').trim();
        if (text.match(/^\d+\./)) {
          definitions.push(text);
        }
      }
    }
    
    // Also try to get the word's part of speech if available
    let partOfSpeech = '';
    const posMatch = html.match(/<p><strong>([^,<]+),?\s*([^<]+)?<\/strong>/i);
    if (posMatch) {
      partOfSpeech = posMatch[1] + (posMatch[2] ? ', ' + posMatch[2] : '');
    }

    if (definitions.length > 0) {
      let definitionText = '';
      if (partOfSpeech) {
        definitionText = partOfSpeech + '\n\n';
      }
      definitionText += definitions.map((def, i) => `${def}`).join('\n');
      
      return NextResponse.json({
        word: word,
        definition: definitionText,
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
      error: 'Failed to fetch definition'
    });
  }
}