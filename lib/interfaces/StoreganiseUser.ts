export interface StoreganiseUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isAdmin?: boolean;
  // ... potentially more fields
}
