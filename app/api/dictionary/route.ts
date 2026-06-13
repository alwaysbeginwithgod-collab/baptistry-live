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

    // Extract the definition using regex
    const definitionMatch = html.match(/<div class="definition">([\s\S]*?)<\/div>/i);
    let definition = definitionMatch ? definitionMatch[1].trim() : null;

    if (!definition) {
      // Try alternative parsing
      const altMatch = html.match(/<p><strong>\w+\.<\/strong> ([\s\S]*?)<\/p>/i);
      definition = altMatch ? altMatch[1].trim() : null;
    }

    if (definition) {
      // Clean up HTML tags
      definition = definition.replace(/<[^>]*>/g, '');
      // Clean up extra whitespace
      definition = definition.replace(/\s+/g, ' ').trim();
      
      return NextResponse.json({
        word: word,
        definition: definition,
        source: "Webster's Dictionary 1828",
        url: url
      });
    } else {
      return NextResponse.json({
        word: word,
        definition: null,
        message: `Definition for "${word}" not found in Webster's 1828 Dictionary.`,
        source: "Webster's Dictionary 1828"
      });
    }
  } catch (error) {
    console.error('Dictionary error:', error);
    return NextResponse.json({ error: 'Failed to fetch definition' }, { status: 500 });
  }
}