import { ApiUnitType } from './ApiUnitType';

export interface ApiSite {
  id: string;
  name: string;
  code: string;
  image: string;
  address: string;
  contact: {
    phone: string;
    email: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  unitTypes: ApiUnitType[];
}
