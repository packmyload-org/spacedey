import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapSite } from '@/lib/db/mappers';
import type { Database } from '@/lib/supabase/database.types';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const supabase = createAdminClient();
    const { data: row, error } = await supabase
      .from('sites')
      .select('*, unit_types(*), storage_units(*, unit_types(*))')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!row) {
      return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, site: mapSite(row) });
  } catch (error) {
    console.error('Get admin site error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const { data: existing, error: lookupError } = await supabase
      .from('sites')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
    }

    const updates: Database['public']['Tables']['sites']['Update'] = {
      registrationFee: 0,
      annualDues: 0,
    };

    if (body.name !== undefined) updates.name = body.name;
    if (body.code !== undefined) updates.code = body.code;
    if (body.city !== undefined) updates.city = body.city;
    if (body.state !== undefined) updates.state = body.state;
    if (body.address !== undefined) updates.address = body.address;
    if (body.contactPhone !== undefined) updates.contactPhone = body.contactPhone;
    if (body.contactEmail !== undefined) updates.contactEmail = body.contactEmail;
    if (body.lat !== undefined) {
      updates.lat = body.lat;
      updates.latitude = body.lat;
    }
    if (body.lng !== undefined) {
      updates.lng = body.lng;
      updates.longitude = body.lng;
    }
    if (body.measuringUnit !== undefined) updates.measuringUnit = body.measuringUnit;
    if (body.image !== undefined) updates.image = body.image;
    if (body.about !== undefined) updates.about = body.about;
    if (body.siteMapUrl !== undefined) updates.siteMapUrl = body.siteMapUrl;
    if (body.latitude !== undefined) {
      updates.latitude = body.latitude;
      if (body.lat === undefined) {
        updates.lat = body.latitude;
      }
    }
    if (body.longitude !== undefined) {
      updates.longitude = body.longitude;
      if (body.lng === undefined) {
        updates.lng = body.longitude;
      }
    }

    const { data: updatedRow, error: updateError } = await supabase
      .from('sites')
      .update(updates)
      .eq('id', id)
      .select('*, unit_types(*), storage_units(*)')
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ ok: true, site: mapSite(updatedRow) });
  } catch (error) {
    console.error('Update site error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const supabase = createAdminClient();

    const { data: existing, error: lookupError } = await supabase
      .from('sites')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
    }

    const { error: deleteError } = await supabase.from('sites').delete().eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ ok: true, message: 'Site deleted successfully' });
  } catch (error) {
    console.error('Delete site error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
