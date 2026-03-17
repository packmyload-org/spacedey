import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import LandlordInquiry from '@/lib/db/entities/LandlordInquiry';
import {
  isLandlordInquiryChatConfigured,
  sendLandlordInquiryIntroEmail,
} from '@/lib/services/landlordInquiryChat';
import { normalizeEmail } from '@/lib/utils/email';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    let emailThreadStarted = false;

    if (isLandlordInquiryChatConfigured()) {
      try {
        inquiry.chatThreadId = await sendLandlordInquiryIntroEmail({
          inquiryId: inquiry.id,
          firstName: inquiry.firstName,
          email: inquiry.email,
          streetAddress: inquiry.streetAddress,
          region: inquiry.region,
          squareFootage: inquiry.squareFootage,
          details: inquiry.details,
        });
        inquiry.botReplyCount = 1;
        inquiry.lastOutboundAt = new Date();
        inquiry.status = 'contacted';
        await repo.save(inquiry);
        emailThreadStarted = true;
      } catch (error) {
        console.error('Landlord inquiry intro email failed', {
          inquiryId: inquiry.id,
          email: inquiry.email,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      ok: true,
      inquiry: {
        id: inquiry.id,
        email: inquiry.email,
        status: inquiry.status,
        createdAt: inquiry.createdAt.toISOString(),
      },
      emailThreadStarted,
    });
  } catch (error: unknown) {
    console.error('API Route /api/landlord/inquiry Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
