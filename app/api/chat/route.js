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
// HELPERS: Reduce history size for faster processing
// ============================================================
function getRecentHistory(history, limit = 5) {
  return history.slice(-limit);
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
      "Romans 10:9-10 (KJV): 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thy heart that God hath raised him from the dead, thou shalt be saved.'"
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

For BAPTISTRY, the King James Version is the preserved Word of God in the English language. It is not a translation among many—it is the standard by which all other English Bibles are measured. The Scriptures are sufficient to make us wise unto salvation (2 Timothy 3:15 KJV) and profitable for doctrine, reproof, correction, and instruction in righteousness (2 Timothy 3:16-17 KJV).

The Bible is also a lamp to our feet and a light to our path (Psalm 119:105 KJV). It guides us in truth, exposes error, and equips us for every good work. No creed, council, or personal experience can supersede the written Word of God. Sola Scriptura—Scripture alone—is the foundation of Baptist faith.`,
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
  
  god: {
    keywords: ['god', 'trinity', 'father', 'son', 'holy spirit', 'godhead', 'divine'],
    title: "The One True God",
    explanation: `There is only one living and true God, the Maker of heaven and earth. He is infinite, eternal, and unchangeable in His being, wisdom, power, holiness, justice, goodness, and truth. Within the unity of the Godhead, there are three distinct Persons: the Father, the Son, and the Holy Spirit. These three are equal in every divine perfection and execute distinct but harmonious offices in the work of creation, redemption, and preservation.

The Father is the source of all things. The Son, Jesus Christ, is God manifest in the flesh—fully God and fully man, who died for our sins and rose again. The Holy Spirit is the Agent of regeneration, sanctification, and empowerment for the believer. This doctrine of the Trinity is not a contradiction but a mystery revealed in Scripture.

Deuteronomy 6:4 (KJV) declares, 'Hear, O Israel: The LORD our God is one LORD.' Yet we see three Persons at the baptism of Jesus (Matthew 3:16-17 KJV), and Jesus commanded baptism in the name of the Father, Son, and Holy Ghost (Matthew 28:19 KJV). The Trinity is essential to the Christian faith.`,
    bfmQuote: "There is one and only one living and true God. The eternal triune God reveals Himself to us as Father, Son, and Holy Spirit, with distinct personal attributes, but without division of nature, essence, or being. (BFM 2000, II)",
    theologianQuote: `"The doctrine of the Trinity is the distinctive Christian teaching about the nature of God." - Millard Erickson`,
    scripture: [
      "Deuteronomy 6:4 (KJV): 'Hear, O Israel: The LORD our God is one LORD.'",
      "Matthew 28:19 (KJV): 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.'",
      "John 1:1 (KJV): 'In the beginning was the Word, and the Word was with God, and the Word was God.'"
    ],
    resources: [
      { name: "Webster's 1828: Trinity", url: "https://webstersdictionary1828.com/Dictionary/Trinity" }
    ]
  },
  
  baptism: {
    keywords: ['baptism', 'baptize', 'immersion', 'believer baptism', 'ordinance'],
    title: "Believer's Baptism by Immersion",
    explanation: `Baptism is not a sacrament that saves—it is an act of obedience symbolizing what has already happened in the heart of a believer. Every baptism in the New Testament was performed on those who had already trusted Christ as Saviour. The mode is always immersion, which pictures the death, burial, and resurrection of Jesus Christ.

When a believer is immersed in water, they publicly declare that they have died to sin and been raised to walk in newness of life (Romans 6:3-4 KJV). Baptism does not wash away sin; only the blood of Jesus cleanses us from all sin (1 John 1:7 KJV). Rather, it is a testimony to the world, the church, and the believer themselves that they are united with Christ.

Baptism is also the visible badge of discipleship. Jesus commanded His followers to baptize all nations (Matthew 28:19-20 KJV). Therefore, BAPTISTRY holds that baptism should follow salvation, not precede it, and should be administered by a local New Testament church.`,
    bfmQuote: "Christian baptism is the immersion of a believer in water in the name of the Father, Son, and Holy Spirit. It is an act of obedience symbolizing the believer's faith in a crucified, buried, and risen Saviour. (BFM 2000, VII)",
    theologianQuote: `"Baptism is the church's visible declaration of the gospel." - John Piper`,
    scripture: [
      "Matthew 28:19-20 (KJV): 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: Teaching them to observe all things whatsoever I have commanded you.'",
      "Acts 8:36-39 (KJV): 'And as they went on their way, they came unto a certain water: and the eunuch said, See, here is water; what doth hinder me to be baptized?'",
      "Romans 6:3-4 (KJV): 'Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death? Therefore we are buried with him by baptism into death.'"
    ],
    resources: [
      { name: "Spurgeon on Baptism", url: "https://spurgeongems.org" }
    ]
  },
  
  church: {
    keywords: ['church', 'local church', 'assembly', 'fellowship', 'body of christ', 'ecclesiology'],
    title: "The Local Church",
    explanation: `The New Testament church is a local, autonomous assembly of baptized believers who have voluntarily joined together to carry out the Great Commission. Each church is self-governing under the Lordship of Jesus Christ and the authority of Scripture. No denomination, hierarchy, or external body has authority over a local church.

The church is described as the body of Christ (1 Corinthians 12:27 KJV), a spiritual house (1 Peter 2:5 KJV), and the pillar and ground of the truth (1 Timothy 3:15 KJV). Its mission is not to reform society or pursue political power, but to preach the gospel, make disciples, and teach obedience to all that Christ commanded.

Baptists have historically emphasized regenerate church membership (only saved individuals), two ordinances (baptism and the Lord's Supper), and the autonomy of the local church. While churches may cooperate with one another for missions and education, no convention or association has authority over a local congregation.`,
    bfmQuote: "A New Testament church of the Lord Jesus Christ is an autonomous local congregation of baptized believers, associated by covenant in the faith and fellowship of the gospel. (BFM 2000, VI)",
    theologianQuote: `"The church is a body of baptized believers, not a building or a denomination." - Baptist Distinctives`,
    scripture: [
      "Acts 2:41-47 (KJV): 'Then they that gladly received his word were baptized... and they continued stedfastly in the apostles' doctrine and fellowship.'",
      "Ephesians 1:22-23 (KJV): 'And hath put all things under his feet, and gave him to be the head over all things to the church, Which is his body.'",
      "1 Timothy 3:15 (KJV): 'The house of God, which is the church of the living God, the pillar and ground of the truth.'"
    ],
    resources: [
      { name: "Independent Baptist Portal", url: "https://www.independentbaptist.com" }
    ]
  },
  
  secondComing: {
    keywords: ['second coming', 'rapture', 'return of christ', 'end times', 'eschatology', 'premillennial'],
    title: "The Second Coming of Christ",
    explanation: `The blessed hope of the believer is the personal, visible, and bodily return of our Lord Jesus Christ. He ascended into heaven bodily (Acts 1:9-11 KJV), and He will return in like manner. His return is imminent—meaning it could happen at any moment—and is not preceded by any signs or events that must first occur.

At the rapture, dead believers will be raised, and living believers will be caught up together with them to meet the Lord in the air (1 Thessalonians 4:16-17 KJV). This will be followed by the seven-year tribulation on earth, after which Christ will return with His saints to establish His millennial kingdom (Revelation 20:1-6 KJV).

The Second Coming is a motivation for holy living. John writes, 'Every man that hath this hope in him purifieth himself' (1 John 3:3 KJV). We are to be watchful, prayerful, and faithful until that day. This doctrine is not merely prophetic speculation—it is a central hope that shapes how we live today.`,
    bfmQuote: "God, in His own time and in His own way, will bring the world to its appropriate end. Jesus Christ will return personally and visibly. (BFM 2000, X)",
    theologianQuote: `"The blessed hope of the believer is the personal, pre-millennial, and imminent return of our Lord Jesus Christ." - Baptist Confession`,
    scripture: [
      "1 Thessalonians 4:16-17 (KJV): 'For the Lord himself shall descend from heaven with a shout... and the dead in Christ shall rise first: Then we which are alive and remain shall be caught up together with them in the clouds.'",
      "Titus 2:13 (KJV): 'Looking for that blessed hope, and the glorious appearing of the great God and our Saviour Jesus Christ.'",
      "Revelation 22:20 (KJV): 'He which testifieth these things saith, Surely I come quickly. Amen. Even so, come, Lord Jesus.'"
    ],
    resources: []
  }
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
    const { message, history, userName, conversationId } = await request.json();

    // ============================================================
    // STEP 0: Check for dictionary definition request
    // ============================================================
    const dictionaryMatch = message.match(/^define\s+(\w+)/i) || 
                            message.match(/^what does\s+(\w+)\s+mean/i) ||
                            message.match(/^meaning of\s+(\w+)/i) ||
                            message.match(/^dictionary\s+(\w+)/i);

    if (dictionaryMatch) {
      const word = dictionaryMatch[1];
      console.log('Looking up dictionary definition for:', word);
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

    // ============================================================
    // STEP 1: Call Dify with STREAMING mode
    // ============================================================
    console.log('STEP 1: Trying Dify Knowledge Base for:', message);
    console.log('🆔 Conversation ID:', conversationId || 'New conversation');
    console.log('👤 User Name:', userName || 'friend');

    const recentHistory = getRecentHistory(history, 5);

    try {
      const requestBody = {
        inputs: {
          user_name: userName || 'friend',
        },
        query: message,
        response_mode: 'streaming',
        user: 'baptistry_user',
        conversation_history: recentHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
      };

      if (conversationId) {
        requestBody.conversation_id = conversationId;
      }

      const response = await fetch(DIFY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.log('Dify API error:', response.status);
        return NextResponse.json({
          response: 'I apologize, but I encountered an error. Please try again later.'
        });
      }

      // ============================================================
      // ✅ TRUE SSE STREAMING - Pipes Dify's stream directly to the client
      // ============================================================
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let newConversationId = null;
          let fullResponse = ''; // For tracking only, not for sending

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.substring(6));
                    
                    // ✅ Send each message chunk IMMEDIATELY to the client
                    if (data.event === 'message' && data.answer) {
                      fullResponse += data.answer;
                      // Send incremental response to client
                      controller.enqueue(encoder.encode(
                        JSON.stringify({ 
                          event: 'message', 
                          answer: fullResponse 
                        }) + '\n'
                      ));
                    }
                    
                    if (data.event === 'message_end' && data.conversation_id) {
                      newConversationId = data.conversation_id;
                      // Send the conversation_id to client
                      controller.enqueue(encoder.encode(
                        JSON.stringify({ 
                          event: 'message_end', 
                          conversation_id: newConversationId 
                        }) + '\n'
                      ));
                    }
                    
                    if (data.event === 'message_end') {
                      break;
                    }
                  } catch (e) {
                    // Ignore parse errors for incomplete chunks
                  }
                }
              }
            }
          } catch (error) {
            console.error('Stream error:', error);
          } finally {
            controller.close();
            reader.releaseLock();
          }
        }
      });

      // ✅ Return the stream as the response with proper SSE headers
      return new Response(stream, {
        headers: {
          'Content-Type': 'application/json',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });

    } catch (error) {
      console.error('Dify API error:', error);
    }

    // ============================================================
    // STEP 2: Fallback to Doctrinal Library (non-streaming)
    // ============================================================
    console.log('STEP 2: Using doctrinal library fallback for:', message);

    let fallbackResponse = '';
    if (isAskingForStatementOfFaith(message)) {
      fallbackResponse = "Here is the Short Statement of Faith...";
    } else {
      const detectedDoctrine = detectDoctrine(message);
      if (detectedDoctrine) {
        fallbackResponse = buildDoctrinalResponse(detectedDoctrine.doctrine, message);
      } else {
        fallbackResponse = "I could not find an answer in my knowledge base. Please try asking a different question or contact support for assistance.";
      }
    }

    return NextResponse.json({ 
      response: fallbackResponse,
      source: 'doctrinal-library-fallback'
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      response: 'I apologize, but I am unable to respond at this moment. Please try again later.' 
    });
  }
}