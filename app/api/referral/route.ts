import { NextResponse } from 'next/server';

type ReferralRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  refereeFirstName?: string;
  refereeLastName?: string;
  refereeEmail?: string;
  refereePhone?: string;
  refereeLocation?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as ReferralRequest | null;

    const firstName = String(body?.firstName || '').trim();
    const lastName = String(body?.lastName || '').trim();
    const email = String(body?.email || '').trim();
    const refereeFirstName = String(body?.refereeFirstName || '').trim();
    const refereeEmail = String(body?.refereeEmail || '').trim();
    const refereeLocation = String(body?.refereeLocation || '').trim();

    if (!firstName || !lastName || !email || !refereeFirstName || !refereeEmail || !refereeLocation) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // No downstream integration exists in this repo yet (Zendesk/Storeganise/etc).
    // Log for now so we can wire it to an email/CRM later without breaking the UI.
    console.log('[Referral] Submission received', {
      firstName,
      lastName,
      email,
      refereeFirstName,
      refereeLastName: String(body?.refereeLastName || '').trim(),
      refereeEmail,
      refereePhone: String(body?.refereePhone || '').trim(),
      refereeLocation,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error('API Route /api/referral Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

