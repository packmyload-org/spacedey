import { StoreganiseUser } from './StoreganiseUser';

export interface StoreganiseAuthResponse {
  accessToken: string;
  user: StoreganiseUser;
}
