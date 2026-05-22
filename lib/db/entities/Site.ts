import type { UnitType } from './UnitType';
import type { StorageUnit } from './StorageUnit';

export class Site {
  id!: string;
  name!: string;
  code!: string;
  address!: string;
  contactPhone!: string | null;
  contactEmail!: string | null;
  lat!: number | null;
  lng!: number | null;
  measuringUnit!: string;
  image!: string | null;
  about!: string | null;
  siteMapUrl!: string | null;
  registrationFee!: number;
  annualDues!: number;
  latitude!: number | null;
  longitude!: number | null;
  city!: string | null;
  state!: string | null;
  features!: string[] | null;
  unitTypes?: UnitType[];
  units?: StorageUnit[];
  createdAt!: Date;
  updatedAt!: Date;
}

export default Site;
