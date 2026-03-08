import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import SubscriptionPlan from '@/lib/db/entities/SubscriptionPlan';

export async function GET() {
    try {
        const dataSource = await connectTypeORM();
        const planRepo = dataSource.getRepository(SubscriptionPlan);

        const plans = await planRepo.find({
            where: { isActive: true },
            order: { durationMonths: 'ASC' }
        });

        // Seed default plans if none exist
        if (plans.length === 0) {
            const defaultPlans = [
                { name: 'Monthly', durationMonths: 1, discountPercent: 0 },
                { name: 'Quarterly', durationMonths: 3, discountPercent: 5 },
                { name: 'Yearly', durationMonths: 12, discountPercent: 15 },
            ];

            const created = await planRepo.save(defaultPlans);
            return NextResponse.json({ ok: true, plans: created });
        }

        return NextResponse.json({ ok: true, plans });
    } catch (error) {
        console.error('Fetch subscription plans error:', error);
        return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
    }
}
