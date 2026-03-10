# Admin Portal Guide

## Overview

Spacedey now includes a role-based access control system with two user roles:

- **Admin**: Full access to manage users, sites, and settings
- **User**: Limited access to view storage locations and book units

## User Roles

### Admin Role
Admins have access to:
- User management (CRUD operations)
- View all users and their roles
- Create new users and assign roles
- Edit user details
- Delete users (except themselves)
- Admin dashboard at `/admin`

### User Role (Default)
Regular users have access to:
- View storage locations
- Browse storage units
- Book storage units
- View their reservations

## Initial Setup

### 1. Seed Default Users

After setting up Postgres and the application, seed the database with default users:

```bash
pnpm run seed:data
```

This creates two default users:
- **Admin User**: `admin@spacedey.com` / `admin123456`
- **Regular User**: `user@spacedey.com` / `user123456`

⚠️ **IMPORTANT**: Change these passwords in production!

### 2. Access the Admin Dashboard

1. Go to the app at `http://localhost:3000`
2. Sign in with admin credentials:
   - Email: `admin@spacedey.com`
   - Password: `admin123456`
3. You'll be redirected to the admin dashboard at `/admin`

## Admin Dashboard Features

### User Management

The admin dashboard allows you to:

#### View All Users
- See a list of all registered users
- View user roles, email, and registration date
- Quick statistics showing total users, admins, and regular users

#### Create New Users
- Click "Add New User" button
- Provide user details (name, email, password)
- Assign role (Admin or User)
- New user is created with the specified role

#### Edit User Details
- Click "Edit" on any user row
- Update name, email, phone, or role
- Changes are saved immediately

#### Delete Users
- Click "Edit" and delete the user
- Admins cannot delete their own account (prevents lockout)
- Deleted users are permanently removed

## API Documentation

### Authentication Endpoints

#### Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "recaptchaResponse": "token" // optional
}

Response:
{
  "ok": true,
  "accessToken": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Sign In
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "ok": true,
  "accessToken": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### Admin Endpoints (Requires Admin Token)

All admin endpoints require an `Authorization: Bearer <token>` header with a valid JWT token from an admin user.

#### Get All Users
```bash
GET /api/admin/users
Authorization: Bearer <admin_token>

Response:
{
  "ok": true,
  "users": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "createdAt": "2024-03-01T12:00:00Z"
    }
  ],
  "total": 2
}
```

#### Create New User (Admin Only)
```bash
POST /api/admin/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "securepass123",
  "role": "admin" // or "user"
}

Response:
{
  "ok": true,
  "user": {
    "id": "new_user_id",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "admin",
    "createdAt": "2024-03-01T12:00:00Z"
  }
}
```

#### Get Single User (Admin Only)
```bash
GET /api/admin/users/{user_id}
Authorization: Bearer <admin_token>

Response:
{
  "ok": true,
  "user": { ... }
}
```

#### Update User (Admin Only)
```bash
PATCH /api/admin/users/{user_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+234123456789",
  "role": "user"
}

Response:
{
  "ok": true,
  "user": { ... }
}
```

#### Delete User (Admin Only)
```bash
DELETE /api/admin/users/{user_id}
Authorization: Bearer <admin_token>

Response:
{
  "ok": true,
  "message": "User deleted successfully"
}
```

## Frontend Usage

### Check if User is Admin

In your React components, use the auth store:

```typescript
import { useAuthStore } from '@/lib/store/useAuthStore';

export function MyComponent() {
  const authStore = useAuthStore();
  
  if (authStore.isAdmin()) {
    return <AdminPanel />;
  }
  
  return <UserPortal />;
}
```

### Get User Role

```typescript
const authStore = useAuthStore();

console.log(authStore.user?.role); // 'admin' or 'user'
```

### Make Admin API Calls

```typescript
const response = await fetch('/api/admin/users', {
  headers: {
    Authorization: `Bearer ${authStore.accessToken}`,
  },
});
```

## Protected Routes

The following routes are protected for admin users:

- `/admin` - Admin dashboard
- `/api/admin/*` - All admin API endpoints

Non-admin users attempting to access these routes will be redirected to the home page.

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcryptjs (10 salt rounds)
2. **JWT Tokens**: Tokens expire after 7 days
3. **Role Verification**: All admin endpoints verify the user's role on the server
4. **Self-Deletion Prevention**: Admins cannot delete their own account
5. **Email Uniqueness**: Email addresses are unique and automatically lowercased

## Production Checklist

- [ ] Change default admin and user passwords
- [ ] Update `JWT_SECRET` to a strong, random value
- [ ] Update MongoDB credentials
- [ ] Enable HTTPS
- [ ] Setup proper email service for password reset
- [ ] Configure reCAPTCHA keys
- [ ] Review and customize user permissions
- [ ] Setup user activity logging
- [ ] Configure automated backups

## Troubleshooting

### Admin Redirect Loop
Ensure the admin user has `role: 'admin'` in the database, not just `isAdmin: true`.

### Token Expired
Users need to login again after 7 days (JWT expiration).

### Cannot Delete User
A user cannot delete their own account. Have another admin delete the account.

## Future Enhancements

- [ ] Email verification for new users
- [ ] Two-factor authentication (2FA)
- [ ] User activity logging and audit trail
- [ ] Role-based permissions customization
- [ ] User groups/organizations
- [ ] Password reset flow
- [ ] Email notifications
