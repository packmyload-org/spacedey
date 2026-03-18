import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectTypeORM } from '@/lib/db';
import ReferralSubmission from '@/lib/db/entities/ReferralSubmission';
import { verifyToken } from '@/lib/auth/jwt';
import { initializeReferralConversation } from '@/lib/services/referralConversationService';
import { normalizeEmail } from '@/lib/utils/email';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const email = normalizeEmail(body?.email || '');
    const refereeFirstName = String(body?.refereeFirstName || '').trim();
    const refereeLastName = String(body?.refereeLastName || '').trim();
    const refereeEmail = normalizeEmail(body?.refereeEmail || '');
    const refereePhone = String(body?.refereePhone || '').trim();
    const refereeLocation = String(body?.refereeLocation || '').trim();

    if (!firstName || !lastName || !email || !refereeFirstName || !refereeEmail || !refereeLocation) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email;
    const normalizedRefereeEmail = refereeEmail;

    if (!EMAIL_PATTERN.test(normalizedEmail) || !EMAIL_PATTERN.test(normalizedRefereeEmail)) {
      return NextResponse.json(
        { ok: false, error: 'A valid email address is required for both people.' },
        { status: 400 }
      );
    }

    if (normalizedEmail === normalizedRefereeEmail) {
      return NextResponse.json(
        { ok: false, error: 'You cannot refer your own email address.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    const decoded = token ? verifyToken(token) : null;

    const dataSource = await connectTypeORM();
    const repo = dataSource.getRepository(ReferralSubmission);

    const existingSubmission = await repo.findOne({
      where: {
        email: normalizedEmail,
        refereeEmail: normalizedRefereeEmail,
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { ok: false, error: 'This referral has already been submitted.' },
        { status: 409 }
      );
    }

    const submission = repo.create({
      referrerUserId: decoded?.userId ?? null,
      firstName,
      lastName,
      email: normalizedEmail,
      refereeFirstName,
      refereeLastName: refereeLastName || null,
      refereeEmail: normalizedRefereeEmail,
      refereePhone: refereePhone || null,
      refereeLocation,
    });

    await repo.save(submission);

    const conversation = await initializeReferralConversation(submission.id);

    return NextResponse.json({
      ok: true,
      referral: {
        id: submission.id,
        email: submission.email,
        refereeEmail: submission.refereeEmail,
        createdAt: submission.createdAt.toISOString(),
      },
      conversation,
    });
  } catch (error: unknown) {
    console.error('API Route /api/referral Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
