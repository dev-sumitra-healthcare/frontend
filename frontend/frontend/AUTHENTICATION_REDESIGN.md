# Frontend Authentication System - Complete Redesign

## Overview
This document describes the completely redesigned authentication system for the MedMitra frontend application. The new system provides a robust, secure, and user-friendly authentication flow for doctors.

## Architecture

### 1. **AuthContext Provider** (`contexts/AuthContext.tsx`)
- **Centralized Authentication State Management**
  - User data (doctor profile)
  - Access token
  - Authentication status
  - Loading states
  - Error handling

- **Key Functions:**
  - `login(email, password)` - Authenticates doctor and redirects to dashboard
  - `register(data)` - Registers new doctor and auto-logs them in
  - `logout()` - Logs out doctor and clears all auth data
  - `refreshUser()` - Refreshes user profile data
  - `clearError()` - Clears error messages

- **Features:**
  - Automatic localStorage synchronization
  - Persistent authentication across page reloads
  - Automatic redirect after login/logout
  - Error state management

### 2. **ProtectedRoute Component** (`components/ProtectedRoute.tsx`)
- Wraps protected pages (like dashboard)
- Automatically redirects unauthenticated users to login
- Shows loading spinner while checking auth status
- Prevents flash of unauthorized content

### 3. **Login System** (`components/LoginForm.tsx`)
- Clean, modern UI with shadcn/ui components
- Form validation using zod and react-hook-form
- Error display with helpful messages
- Password visibility toggle
- Automatic redirect if already authenticated
- Integration with AuthContext for seamless auth flow

### 4. **Registration System** (`components/RegisterForm.tsx`)
- Comprehensive registration form with all required doctor fields:
  - Full Name
  - Email
  - Medical Registration ID
  - Specialty
  - Password with confirmation
- Client-side validation with immediate feedback
- Password strength requirements
- Automatic login after successful registration
- Error handling with user-friendly messages

### 5. **Dashboard Integration** (`app/dashboard/page.tsx`)
- Wrapped with ProtectedRoute component
- Automatically checks authentication
- No manual localStorage checks needed
- Clean separation of concerns

### 6. **Header Component** (`components/dashboard/Header.tsx`)
- Uses AuthContext for user data
- Displays doctor's name from context
- Logout button integrated with AuthContext
- Theme toggle support

## Authentication Flow

### Registration Flow
1. User fills out registration form
2. Form validates input client-side
3. Registration request sent to backend (`POST /api/v1/register`)
4. On success, automatically calls login with same credentials
5. User redirected to dashboard with active session

### Login Flow
1. User enters email and password
2. Form validates input
3. Login request sent to backend (`POST /api/v1/login`)
4. Backend returns accessToken and doctor profile
5. Token and profile stored in localStorage
6. AuthContext state updated
7. User redirected to dashboard using `router.replace()`

### Dashboard Access
1. User navigates to `/dashboard`
2. ProtectedRoute checks auth status from AuthContext
3. If authenticated: Dashboard renders
4. If not authenticated: Redirect to `/login`
5. Loading spinner shown during check

### Logout Flow
1. User clicks logout button
2. Logout request sent to backend (`POST /api/v1/logout`)
3. localStorage cleared (token and user data)
4. AuthContext state cleared
5. User redirected to login page

## API Integration

### Endpoints Used
- `POST /api/v1/register` - Doctor registration
- `POST /api/v1/login` - Doctor login
- `POST /api/v1/logout` - Doctor logout
- `GET /api/v1/profile` - Get doctor profile
- `POST /api/v1/refresh-token` - Refresh access token (via interceptor)

### Response Structures

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "doctor": {
      "_id": "uuid",
      "fullName": "Dr. John Smith",
      "email": "john@example.com",
      "medicalRegistrationId": "MED123456",
      "specialty": "Cardiology",
      "roles": ["practitioner"],
      "accountStatus": "active"
    },
    "accessToken": "jwt_token_here"
  }
}
```

**Registration Response:**
```json
{
  "success": true,
  "message": "Doctor registration successful",
  "data": {
    "doctor": {
      "_id": "uuid",
      "fullName": "Dr. John Smith",
      "email": "john@example.com",
      "medicalRegistrationId": "MED123456",
      "specialty": "Cardiology",
      "roles": ["practitioner"],
      "accountStatus": "pending_verification"
    }
  }
}
```

## State Management

### LocalStorage Keys
- `accessToken` - JWT access token for API requests
- `user` - Serialized doctor profile object

### AuthContext State
```typescript
{
  user: Doctor | null,           // Current doctor profile
  accessToken: string | null,    // JWT token
  isAuthenticated: boolean,      // Auth status
  isLoading: boolean,           // Loading state
  error: string | null          // Error message
}
```

## Security Features

1. **JWT Token Management**
   - Access tokens stored in localStorage
   - Refresh tokens stored in HTTP-only cookies (backend)
   - Automatic token refresh via axios interceptor

2. **Password Requirements**
   - Minimum 6 characters
   - Must contain uppercase letter
   - Must contain lowercase letter
   - Must contain number

3. **Protected Routes**
   - Dashboard and all sub-routes protected
   - Automatic redirect for unauthenticated users
   - No manual checks needed in components

4. **Error Handling**
   - All API errors caught and displayed
   - User-friendly error messages
   - Automatic logout on 401 errors

## User Experience Improvements

1. **No Flash of Content**
   - Loading states prevent unauthorized content from showing
   - Smooth transitions between auth states

2. **Persistent Sessions**
   - Users stay logged in across page refreshes
   - Automatic auth check on app mount

3. **Clear Feedback**
   - Loading indicators during auth operations
   - Success/error toasts for all operations
   - Inline form validation errors

4. **Navigation History**
   - `router.replace()` used to prevent back button issues
   - Users can't navigate back to login after successful auth

## Components Structure

```
frontend/
├── app/
│   ├── layout.tsx                 # Root layout with AuthProvider
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Registration page
│   └── dashboard/
│       └── page.tsx              # Protected dashboard page
├── components/
│   ├── LoginForm.tsx             # Login form component
│   ├── RegisterForm.tsx          # Registration form component
│   ├── ProtectedRoute.tsx        # Route protection wrapper
│   └── dashboard/
│       └── Header.tsx            # Dashboard header with logout
└── contexts/
    └── AuthContext.tsx           # Authentication context provider
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

## Testing the System

### Manual Testing Steps

1. **Registration Flow**
   ```
   1. Navigate to /register
   2. Fill in all required fields
   3. Click "Create Account"
   4. Verify automatic login
   5. Verify redirect to dashboard
   ```

2. **Login Flow**
   ```
   1. Navigate to /login
   2. Enter valid credentials
   3. Click "Sign in"
   4. Verify redirect to dashboard
   5. Check localStorage has token and user
   ```

3. **Protected Route Access**
   ```
   1. Without logging in, navigate to /dashboard
   2. Verify redirect to /login
   3. Log in
   4. Verify access to dashboard
   ```

4. **Logout Flow**
   ```
   1. From dashboard, click user menu
   2. Click "Log out"
   3. Verify redirect to /login
   4. Verify localStorage is cleared
   5. Try accessing /dashboard
   6. Verify redirect to /login
   ```

5. **Persistent Session**
   ```
   1. Log in
   2. Refresh the page
   3. Verify user stays logged in
   4. Navigate away and back
   5. Verify session persists
   ```

## Known Limitations

1. **Google OAuth**
   - Backend has OAuth support
   - Frontend button disabled temporarily
   - Will be enabled in future update

2. **Token Refresh**
   - Axios interceptor handles 401 errors
   - Refresh token flow via HTTP-only cookies
   - May need testing with real backend

3. **Remember Me**
   - Currently not implemented
   - All sessions persist until logout
   - Could add in future iteration

## Future Enhancements

1. **Google OAuth Integration**
   - Implement OAuth callback page
   - Handle OAuth registration completion
   - Add OAuth error handling

2. **Profile Management**
   - Add profile editing page
   - Update profile photo
   - Change password functionality

3. **Session Management**
   - Add "Remember Me" checkbox
   - Implement session timeout
   - Add multiple device management

4. **Enhanced Security**
   - Add 2FA support
   - Implement account lockout
   - Add security audit log

## Troubleshooting

### Issue: User redirected to login after successful login
**Solution:** Check that AuthProvider is wrapped around the entire app in layout.tsx

### Issue: "useAuth must be used within an AuthProvider" error
**Solution:** Ensure AuthProvider is in root layout and component is client-side

### Issue: Token not being sent with API requests
**Solution:** Check axios interceptor in lib/api.ts is reading from localStorage

### Issue: Registration succeeds but login fails
**Solution:** Verify backend password hashing and comparison logic

### Issue: Dashboard shows briefly before redirect
**Solution:** Ensure ProtectedRoute is properly wrapping the dashboard page

## Migration Notes

### Changes from Old System
1. Removed manual localStorage checks from components
2. Centralized auth logic in AuthContext
3. Simplified login/register forms
4. Added ProtectedRoute wrapper
5. Updated Header to use AuthContext
6. Removed redundant auth state in components

### Breaking Changes
- Components must now use `useAuth()` hook instead of direct localStorage access
- Dashboard requires ProtectedRoute wrapper
- Old auth functions in components removed

## Conclusion

This redesigned authentication system provides a solid foundation for the MedMitra application. It follows React best practices, provides excellent UX, and is secure and maintainable. The centralized AuthContext makes it easy to manage authentication state across the entire application.
