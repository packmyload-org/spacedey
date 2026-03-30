import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import LandlordInquiry from '@/lib/db/entities/LandlordInquiry';
import { initializeLandlordConversation } from '@/lib/services/landlordConversationService';
import { EMAIL_PATTERN } from '@/lib/types/constants';
import { normalizeEmail } from '@/lib/utils/email';

type LandlordInquiryRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  region?: string;
  squareFootage?: string;
  details?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as LandlordInquiryRequest | null;

    const firstName = String(body?.firstName || '').trim();
    const lastName = String(body?.lastName || '').trim();
    const email = normalizeEmail(body?.email || '');
    const phone = String(body?.phone || '').trim();
    const streetAddress = String(body?.streetAddress || '').trim();
    const region = String(body?.region || '').trim();
    const squareFootage = String(body?.squareFootage || '').trim();
    const details = String(body?.details || '').trim();

    if (!firstName || !lastName || !email || !streetAddress) {
      return NextResponse.json(
        { ok: false, error: 'First name, last name, email, and street address are required.' },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Enter a valid email address.' },
        { status: 400 }
      );
    }

    const dataSource = await connectTypeORM();
    const repo = dataSource.getRepository(LandlordInquiry);

    const inquiry = repo.create({
      firstName,
      lastName,
      email,
      phone: phone || null,
      streetAddress,
      region: region || null,
      squareFootage: squareFootage || null,
      details: details || null,
      status: 'new',
    });

    await repo.save(inquiry);

    const conversation = await initializeLandlordConversation(inquiry.id);

    return NextResponse.json({
      ok: true,
      inquiry: {
        id: inquiry.id,
        email: inquiry.email,
        status: conversation.status,
        createdAt: inquiry.createdAt.toISOString(),
      },
      conversation,
    });
  } catch (error: unknown) {
    console.error('API Route /api/landlord/inquiry Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
