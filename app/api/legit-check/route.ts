// app/api/legit-check/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isValidEmail } from '@/lib/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email } = body;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'GenZ Consulting <noreply@genzconsulting.cz>',
    to: 'adam.dalecky@genzconsulting.cz',
    subject: `Nový lead: Legit Check — ${email}`,
    text: `Někdo stáhl Legit Check:\n\nE-mail: ${email}\nDatum: ${new Date().toISOString()}`,
  });

  if (error) console.error('[legit-check] Resend error:', error);

  return NextResponse.json({ downloadUrl: '/downloads/legit-check.pdf' });
}
