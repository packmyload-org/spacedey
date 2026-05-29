import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapSite } from '@/lib/db/mappers';
import { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const supabase = createAdminClient();
    const { data: rows, error } = await supabase
      .from('sites')
      .select('*, unit_types(*), storage_units(*)')
      .order('createdAt', { ascending: false });

    if (error) {
      throw error;
    }

    const sites = (rows ?? []).map(mapSite);

    return NextResponse.json({
      ok: true,
      sites,
    });
  } catch (error) {
    console.error('Get admin sites error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      code,
      city,
      state,
      address,
      contactPhone,
      contactEmail,
      lat,
      lng,
      measuringUnit,
      image,
      about,
      siteMapUrl,
      unitTypes = [],
    } = body;

    if (
      !name ||
      !code ||
      !city ||
      !state ||
      !address ||
      !contactPhone ||
      !contactEmail ||
      lat === undefined ||
      lng === undefined
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Name, code, city, state, address, contact phone/email, and coordinates are required.',
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('sites')
      .select('id')
      .eq('code', code)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'Site with this unique code already exists.' },
        { status: 409 }
      );
    }

    const { data: newSiteRow, error: siteError } = await supabase
      .from('sites')
      .insert({
        name,
        code,
        city,
        state,
        address,
        contactPhone,
        contactEmail,
        lat,
        lng,
        latitude: lat,
        longitude: lng,
        measuringUnit: measuringUnit || 'ft',
        image,
        about,
        siteMapUrl,
        registrationFee: 0,
        annualDues: 0,
      })
      .select('*')
      .single();

    if (siteError) {
      throw siteError;
    }

    const siteId = newSiteRow.id;

    if (Array.isArray(unitTypes) && unitTypes.length > 0) {
      const sitePrefix = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4) || 'UNIT';

      for (const [index, unitType] of unitTypes.entries()) {
        if (
          !unitType?.name ||
          unitType.width === undefined ||
          unitType.depth === undefined ||
          unitType.priceAmount === undefined
        ) {
          continue;
        }

        const { data: savedUnitTypeRow, error: unitTypeError } = await supabase
          .from('unit_types')
          .insert({
            name: unitType.name,
            width: unitType.width,
            depth: unitType.depth,
            unit: unitType.unit || 'ft',
            priceAmount: unitType.priceAmount,
            priceCurrency: unitType.priceCurrency || 'NGN',
            priceOriginalAmount: unitType.priceOriginalAmount,
            description: unitType.description,
            availableCount: unitType.availableCount || 0,
            siteId,
          })
          .select('*')
          .single();

        if (unitTypeError) {
          throw unitTypeError;
        }

        const blockStart = index * 100 + 1;
        const count = unitType.availableCount || 0;

        if (count > 0) {
          const storageUnits = Array.from({ length: count }, (_, unitIndex) => ({
            unitNumber: `${sitePrefix}${String(blockStart + unitIndex).padStart(3, '0')}`,
            status: StorageUnitStatus.AVAILABLE,
            siteId,
            unitTypeId: savedUnitTypeRow.id,
          }));

          const { error: unitsError } = await supabase.from('storage_units').insert(storageUnits);

          if (unitsError) {
            throw unitsError;
          }
        }
      }
    }

    const { data: fullSiteRow, error: fetchError } = await supabase
      .from('sites')
      .select('*, unit_types(*), storage_units(*)')
      .eq('id', siteId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    return NextResponse.json(
      { ok: true, site: mapSite(fullSiteRow) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create site error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
