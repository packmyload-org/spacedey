import { createAdminClient } from '@/lib/supabase/admin';
import { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';

export async function syncUnitTypeAvailability(unitTypeId: string) {
  const supabase = createAdminClient();

  const { count, error: countError } = await supabase
    .from('storage_units')
    .select('id', { count: 'exact', head: true })
    .eq('unitTypeId', unitTypeId)
    .eq('status', StorageUnitStatus.AVAILABLE);

  if (countError) {
    throw countError;
  }

  const availableCount = count ?? 0;

  const { error: updateError } = await supabase
    .from('unit_types')
    .update({ availableCount })
    .eq('id', unitTypeId);

  if (updateError) {
    throw updateError;
  }

  return availableCount;
}
