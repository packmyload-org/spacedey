import { LocalizedString } from './LocalizedString';

export interface StoreganiseUnitType {
  id: string;
  title: LocalizedString;
  code: string;
  price: number;
  width: number;
  depth: number;
  height: number;
  area: number;
  description?: LocalizedString;
  availableCount?: number; 
  unitTypeGroupId?: string;
}
