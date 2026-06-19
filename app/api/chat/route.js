import { NextResponse } from 'next/server';

// ============================================================
// DICTIONARY HELPER FUNCTION
// ============================================================
async function getWebsterDefinition(word) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.baptistry.app';
    const url = `${baseUrl}/api/dictionary?word=${encodeURIComponent(word)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.definition) {
      return `${data.definition}\n\n— Webster's Dictionary 1828`;
    }
    return null;
  } catch (error) {
    console.error('Dictionary fetch error:', error);
    return null;
  }
}

// ============================================================
// DOCTRINAL DEFENSE LIBRARY (FALLBACK ONLY)
// ============================================================
const doctrinalLibrary = {
  salvation: {
    keywords: ['salvation', 'saved', 'save', 'born again', 'justified', 'redemption', 'forgiven', 'grace', 'faith'],
    title: "Salvation by Grace through Faith",
    explanation: `Salvation is the work of God alone, whereby He rescues sinners from the penalty and power of sin. It is entirely a gift of grace—not something we earn by good works or religious efforts. When a person places their faith in Jesus Christ as Lord and Saviour, they are born again, justified before God, and given eternal life.

The Bible clearly declares that all have sinned and fall short of God's glory (Romans 3:23 KJV). The penalty for sin is death, but God, in His rich mercy, provided a Saviour. Jesus Christ died on the cross for our sins, was buried, and rose again the third day (1 Corinthians 15:3-4 KJV). Through faith in Him, we receive forgiveness and the gift of everlasting life.

Salvation is not merely a decision or a prayer—it is a supernatural transformation. The moment a sinner trusts Christ, they are sealed by the Holy Spirit (Ephesians 1:13-14 KJV), adopted into God's family (Romans 8:15-16 KJV), and made a new creature (2 Corinthians 5:17 KJV). This salvation is secure forever because it rests on Christ's finished work, not our performance.`,
    bfmQuote: "Salvation involves the redemption of the whole man, and is offered freely to all who accept Jesus Christ as Lord and Saviour, who by His own blood obtained eternal redemption for the believer. (BFM 2000, IV)",
    theologianQuote: `"Justification is a forensic declaration of pardon, which Christ has won through His victory over sin, death, the law and the devil." - David S. Dockery`,
    scripture: [
      "John 3:16 (KJV): 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.'",
      "Ephesians 2:8-9 (KJV): 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.'",
      "Romans 10:9-10 (KJV): 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.'"
    ],
    resources: [
      { name: "Way of Life Literature", url: "https://www.wayoflife.org" },
      { name: "Spurgeon on Salvation", url: "https://spurgeongems.org" }
    ]
  },
  scriptures: {
    keywords: ['bible', 'scripture', 'word of god', 'kjv', 'king james', 'inspired', 'inerrancy', 'preserved'],
    title: "The Authority and Inspiration of Scripture",
    explanation: `The Bible is not merely a religious book—it is the very Word of God. Every word of Scripture was breathed out by God through holy men who were moved by the Holy Ghost (2 Peter 1:20-21 KJV). Because God is true and cannot lie, His Word is without error in the original manuscripts and is our final authority for faith and practice.

For BAPTISTRY, the King James Version is the infallible, inspired, preserved, perfect Word of God. It is not a translation among many—it is the standard by which all other Bibles are measured. The Scriptures are sufficient to make us wise unto salvation (2 Timothy 3:15 KJV) and profitable for doctrine, reproof, correction, and instruction in righteousness (2 Timothy 3:16-17 KJV).`,
    bfmQuote: "The Holy Bible was written by men divinely inspired and is God's revelation of Himself to man. It is a perfect treasure of divine instruction. (BFM 2000, I)",
    theologianQuote: `"Baptists have insisted that the Bible is the sole ultimate written authority for Christian faith and practice." - Baptist Distinctives`,
    scripture: [
      "2 Timothy 3:16-17 (KJV): 'All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: That the man of God may be perfect, throughly furnished unto all good works.'",
      "2 Peter 1:20-21 (KJV): 'Knowing this first, that no prophecy of the scripture is of any private interpretation. For the prophecy came not in old time by the will of man: but holy men of God spake as they were moved by the Holy Ghost.'",
      "Psalm 119:105 (KJV): 'Thy word is a lamp unto my feet, and a light unto my path.'"
    ],
    resources: [
      { name: "Blue Letter Bible (KJV Study)", url: "https://blueletterbible.org" },
      { name: "Way of Life - KJV Defense", url: "https://www.wayoflife.org" }
    ]
  },
  // ... (keep the rest of your doctrinalLibrary entries)
  // I'm omitting them for brevity - keep your existing god, baptism, church, secondComing entries
};

function isAskingForStatementOfFaith(message) {
  const lowerMsg = message.toLowerCase();
  return lowerMsg.includes('statement of faith') || 
         lowerMsg.includes('short statement of faith') ||
         lowerMsg.includes('what do you believe') ||
         lowerMsg.includes('your beliefs') ||
         lowerMsg.includes('doctrine summary') ||
         lowerMsg.includes('summary of beliefs');
}

function detectDoctrine(message) {
  const lowerMsg = message.toLowerCase();
  for (const [key, doctrine] of Object.entries(doctrinalLibrary)) {
    for (const keyword of doctrine.keywords) {
      if (lowerMsg.includes(keyword)) {
        return { key, doctrine };
      }
    }
  }
  return null;
}

function buildDoctrinalResponse(doctrine, userQuery) {
  const scriptureSection = doctrine.scripture.map(s => `- ${s}`).join('\n');
  let resourcesSection = '';
  if (doctrine.resources && doctrine.resources.length > 0) {
    const resourceLinks = doctrine.resources.map(r => `- [${r.name}](${r.url})`).join('\n');
    resourcesSection = `\n\n**For Further Study:**\n${resourceLinks}`;
  }
  return `${doctrine.explanation}\n\n**Scripture Foundation:**\n${scriptureSection}\n\n**From the Baptist Faith and Message:**\n${doctrine.bfmQuote}\n\n**Historic Baptist Teaching:**\n${doctrine.theologianQuote}${resourcesSection}\n\n*Sources: Baptist Faith and Message 2000, historic Baptist theologians*`;
}

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    // Check for dictionary definition request
    const dictionaryMatch = message.match(/^define\s+(\w+)/i) || 
                            message.match(/^what does\s+(\w+)\s+mean/i) ||
                            message.match(/^meaning of\s+(\w+)/i) ||
                            message.match(/^dictionary\s+(\w+)/i);

    if (dictionaryMatch) {
      const word = dictionaryMatch[1];
      const definition = await getWebsterDefinition(word);
      if (definition) {
        return NextResponse.json({ response: definition, source: 'webster-1828' });
      } else {
        return NextResponse.json({ 
          response: `I couldn't find "${word}" in Webster's 1828 Dictionary. Please check the spelling or try another word.\n\nYou can also search directly at: https://webstersdictionary1828.com/Dictionary/${word}` 
        });
      }
    }

    const DIFY_API_KEY = process.env.NEXT_PUBLIC_APP_KEY;
    const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

    if (!DIFY_API_KEY) {
      console.error('Missing API key');
      return NextResponse.json(
        { response: 'Configuration error: Missing API key' },
        { status: 500 }
      );
    }

    console.log('📤 Sending to Dify with streaming mode:', message);

    // STEP 1: Use STREAMING mode for faster responses
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'streaming',  // ✅ CHANGED FROM 'blocking' TO 'streaming'
        user: 'baptistry_user',
        // Pass conversation history for context
        conversation_history: history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
      }),
    });

    // If streaming mode is successful, Dify returns a stream
    if (response.ok && response.body) {
      console.log('✅ Streaming response received');
      // Return the stream directly to the client
      return new NextResponse(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Fallback: If streaming fails, try blocking mode
    console.log('⚠️ Streaming failed, trying blocking mode...');
    const blockingResponse = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        user: 'baptistry_user',
        conversation_history: history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
      }),
    });

    const data = await blockingResponse.json();
    console.log('📥 Blocking response received');

    if (blockingResponse.ok && data.answer) {
      let fullResponse = data.answer;
      fullResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      return NextResponse.json({ response: fullResponse, source: 'dify-blocking' });
    } else {
      console.log('⚠️ Dify returned no answer, using doctrinal library fallback');
      
      // Special case: Statement of Faith
      if (isAskingForStatementOfFaith(message)) {
        return NextResponse.json({ 
          response: "Here is the Short Statement of Faith...", 
          source: 'dify-fallback' 
        });
      }

      // Check doctrinal library
      const detectedDoctrine = detectDoctrine(message);
      if (detectedDoctrine) {
        const doctrinalResponse = buildDoctrinalResponse(detectedDoctrine.doctrine, message);
        return NextResponse.json({ 
          response: doctrinalResponse,
          source: 'doctrinal-library-fallback'
        });
      }

      return NextResponse.json({ 
        response: "I could not find an answer in my knowledge base. Please try asking a different question or contact support for assistance.",
        source: 'dify-only'
      });
    }

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      response: 'I apologize, but I am unable to respond at this moment. Please try again later.' 
    });
  }
}