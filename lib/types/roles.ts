export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
    'manage:users',
    'manage:sites',
    'manage:units',
    'view:analytics',
    'manage:settings',
  ],
  [UserRole.USER]: [
    'view:sites',
    'view:units',
    'book:storage',
  ],
};
