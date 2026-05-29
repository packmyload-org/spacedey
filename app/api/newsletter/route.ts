import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendNewsletterWelcomeEmail } from '@/lib/email/resend';
import { EMAIL_PATTERN } from '@/lib/types/constants';
import { normalizeEmail } from '@/lib/utils/email';

export async function POST(request: Request) {
  try {
    const appUrl = new URL(request.url).origin;
    const body = await request.json().catch(() => null);
    const email = normalizeEmail(body?.email || '');

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: existingSubscriber, error: lookupError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (existingSubscriber) {
      let shouldSendWelcomeEmail = false;

      if (!existingSubscriber.subscribedAt) {
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ subscribedAt: new Date().toISOString() })
          .eq('id', existingSubscriber.id);

        if (updateError) {
          throw updateError;
        }

        shouldSendWelcomeEmail = true;
      }

      if (shouldSendWelcomeEmail) {
        try {
          await sendNewsletterWelcomeEmail({ email, appUrl });
        } catch (error) {
          console.error('Newsletter welcome email failed:', error);
        }
      }

      return NextResponse.json({
        ok: true,
        alreadySubscribed: true,
        subscriber: {
          id: existingSubscriber.id,
          email: existingSubscriber.email,
          subscribedAt: existingSubscriber.subscribedAt ?? null,
        },
      });
    }

    const { data: subscriber, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        subscribedAt: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (insertError) {
      throw insertError;
    }

    try {
      await sendNewsletterWelcomeEmail({ email, appUrl });
    } catch (error) {
      console.error('Newsletter welcome email failed:', error);
    }

    return NextResponse.json(
      {
        ok: true,
        alreadySubscribed: false,
        subscriber: {
          id: subscriber.id,
          email: subscriber.email,
          subscribedAt: subscriber.subscribedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
