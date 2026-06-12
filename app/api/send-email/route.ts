import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // Resend's testing sender (will change after domain verification)
      to: 'always.begin.with.god@gmail.com',
      subject: `BAPTISTRY Message from ${name || 'Visitor'}`,
      html: `
        <h2>📧 New Message from BAPTISTRY</h2>
        <p><strong>From:</strong> ${name || 'Anonymous'}</p>
        <p><strong>Reply to:</strong> ${email || 'Not provided'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr/>
        <p><small>Sent from BAPTISTRY Bible Study Tool</small></p>
      `,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}