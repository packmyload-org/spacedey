import { LocalizedString } from './LocalizedString';
import { StoreganiseSiteAddress } from './StoreganiseSiteAddress';
import { StoreganiseUnitType } from './StoreganiseUnitType';
import { StoreganiseUnitTypeGroup } from './StoreganiseUnitTypeGroup';

export interface StoreganiseSite {
  id: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  code: string;
  image?: string;
  address?: StoreganiseSiteAddress;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  unitTypes?: StoreganiseUnitType[];
  unitTypeGroups?: StoreganiseUnitTypeGroup[];
  products?: any[];
  measure?: string;
  availability?: any;
}
