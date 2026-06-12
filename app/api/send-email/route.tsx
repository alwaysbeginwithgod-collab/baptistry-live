import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Only initialize Resend at runtime
    const { Resend } = await import('resend');
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }
    
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'always.begin.with.god@gmail.com',
      subject: `BAPTISTRY Message from ${name || 'Visitor'}`,
      html: `
        <h2>📧 New Message from BAPTISTRY</h2>
        <p><strong>From:</strong> ${name || 'Anonymous'}</p>
        <p><strong>Reply to:</strong> ${email || 'Not provided'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p><small>Sent from BAPTISTRY Bible Study Tool</small></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}