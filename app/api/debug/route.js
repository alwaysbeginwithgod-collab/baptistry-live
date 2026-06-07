import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    const DIFY_API_KEY = process.env.NEXT_PUBLIC_APP_KEY;
    const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';
    
    console.log('Debug: Sending to Dify:', message);
    
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        user: 'debug_user',
      }),
    });
    
    const data = await response.json();
    
    console.log('Debug: Dify response received');
    console.log('Debug: Answer length:', data.answer?.length);
    console.log('Debug: Answer preview:', data.answer?.substring(0, 500));
    
    // Return the RAW response exactly as received from Dify
    return NextResponse.json({ 
      rawResponse: data,
      answer: data.answer,
      answerLength: data.answer?.length || 0,
      hasHandwritingEmoji: data.answer?.includes('✍️') || false,
      hasBlockquote: data.answer?.includes('>') || false,
      hasSceneBreak: data.answer?.includes('---') || false,
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}