import { NextResponse } from 'next/server';
import { createUser, StoreganiseError } from '@/lib/integration/storeganise';
import { verifyRecaptchaToken, shouldSkipRecaptchaVerification } from '@/lib/integration/recaptcha';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = String(body?.firstName || '').trim();
    const lastName = String(body?.lastName || '').trim();
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '').trim();
    const recaptchaToken = String(body?.recaptchaResponse || '').trim();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'firstName, lastName, email, and password are required.' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token if provided
    let recaptchaResponse: string | undefined;

    if (recaptchaToken) {
      if (!shouldSkipRecaptchaVerification()) {
        try {
          const verification = await verifyRecaptchaToken(recaptchaToken, 'signup');

          if (!verification.success) {
            console.warn('[Signup] reCAPTCHA verification failed:', verification.error_codes);
            // Don't send invalid reCAPTCHA to Storeganise
            recaptchaResponse = undefined;
          } else if (verification.score !== undefined && verification.score > 0.5) {
            // Only include valid tokens with acceptable score
            recaptchaResponse = recaptchaToken;
          }
        } catch (error) {
          console.error('[Signup] reCAPTCHA verification error:', error);
          recaptchaResponse = undefined;
        }
      } else {
        // In development/skip mode, include token as-is if provided
        recaptchaResponse = recaptchaToken;
      }
    }

    // Attempt user creation
    try {
      const user = await createUser({
        firstName,
        lastName,
        email,
        password,
        recaptchaResponse,
      });
      return NextResponse.json({ ok: true, user });
    } catch (error) {
      if (error instanceof StoreganiseError) {
        // If we get an invalid-input-response error from Storeganise,
        // it means reCAPTCHA validation failed server-side
        if (
          error.status === 400 &&
          error.data &&
          typeof error.data === 'object' &&
          'error' in error.data
        ) {
          const storeganiseErrorData = error.data as { error?: { message?: string } };
          const errorMsg = storeganiseErrorData.error?.message || '';
          if (errorMsg.includes('Recaptcha') || errorMsg.includes('recaptcha')) {
            console.warn('[Signup] Storeganise rejected reCAPTCHA, retrying without it');
            // Retry without reCAPTCHA
            const retryUser = await createUser({
              firstName,
              lastName,
              email,
              password,
              // Don't send recaptcha
            });
            return NextResponse.json({ ok: true, user: retryUser });
          }
        }

        return NextResponse.json(
          { ok: false, error: error.message, data: error.data },
          { status: error.status }
        );
      }

      throw error;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
