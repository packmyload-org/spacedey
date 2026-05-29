import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('isActive', true)
      .order('durationMonths', { ascending: true });

    if (error) {
      throw error;
    }

    if (!plans || plans.length === 0) {
      const defaultPlans = [
        { name: 'Monthly', durationMonths: 1, discountPercent: 0, isActive: true },
        { name: 'Quarterly', durationMonths: 3, discountPercent: 5, isActive: true },
        { name: 'Yearly', durationMonths: 12, discountPercent: 15, isActive: true },
      ];

      const { data: created, error: insertError } = await supabase
        .from('subscription_plans')
        .insert(defaultPlans)
        .select('*');

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({ ok: true, plans: created });
    }

    return NextResponse.json({ ok: true, plans });
  } catch (error) {
    console.error('Fetch subscription plans error:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
