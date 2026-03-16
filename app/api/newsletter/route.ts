import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import NewsletterSubscriber from '@/lib/db/entities/NewsletterSubscriber';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = String(body?.email || '').trim().toLowerCase();

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const dataSource = await connectTypeORM();
    const repo = dataSource.getRepository(NewsletterSubscriber);

    const existingSubscriber = await repo.findOne({ where: { email } });

    if (existingSubscriber) {
      if (!existingSubscriber.subscribedAt) {
        existingSubscriber.subscribedAt = new Date();
        await repo.save(existingSubscriber);
      }

      return NextResponse.json({
        ok: true,
        alreadySubscribed: true,
        subscriber: {
          id: existingSubscriber.id,
          email: existingSubscriber.email,
          subscribedAt: existingSubscriber.subscribedAt?.toISOString() ?? null,
        },
      });
    }

    const subscriber = repo.create({
      email,
      subscribedAt: new Date(),
    });

    await repo.save(subscriber);

    return NextResponse.json(
      {
        ok: true,
        alreadySubscribed: false,
        subscriber: {
          id: subscriber.id,
          email: subscriber.email,
          subscribedAt: subscriber.subscribedAt?.toISOString() ?? null,
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
