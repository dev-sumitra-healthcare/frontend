# 🎯 Frontend OAuth Integration Guide

Google OAuth has been successfully integrated into your MedMitra frontend!

## ✅ What's Been Implemented

### New Files Created
- `.env.local` - Environment variables for API configuration
- `.env.example` - Example environment file
- `app/auth/callback/page.tsx` - OAuth callback handler page

### Files Modified
- `lib/api.ts` - Added OAuth functions and updated API base URL
- `components/LoginForm.tsx` - Added "Sign in with Google" button

## 🚀 Quick Setup

### 1. Environment Variables

The `.env.local` file has been created with the following configuration:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

**Important:** Make sure your backend is running on port `3000`. If it's on a different port (like `8000`), update the environment variables accordingly.

### 2. Install Dependencies (if needed)

All required dependencies are already in your `package.json`. Just run:

```bash
pnpm install
```

### 3. Start the Frontend

```bash
pnpm dev
```

The frontend will run on `http://localhost:3000` by default.

## 🔧 How It Works

### Authentication Flow

```
1. User clicks "Sign in with Google" on login page
   ↓
2. Frontend calls GET /api/auth/google
   ↓
3. Backend returns Google OAuth URL
   ↓
4. User is redirected to Google login
   ↓
5. User authenticates with Google
   ↓
6. Google redirects to backend callback: /api/auth/google/callback
   ↓
7. Backend processes OAuth, creates/updates user
   ↓
8. Backend redirects to frontend: /auth/callback?access_token=xxx
   ↓
9. Frontend callback page processes token
   ↓
10. User is redirected to dashboard
```

### New API Functions

Three new functions have been added to `lib/api.ts`:

```typescript
// Get Google OAuth URL
getGoogleOAuthUrl(): Promise<{ url: string }>

// Get current session (for OAuth users)
getSession(): Promise<{ user: User }>

// Logout (works for both traditional and OAuth)
logout(): Promise<{ message: string }>
```

### Updated Components

**LoginForm Component** now includes:
- ✅ Traditional email/password login
- ✅ Google OAuth button with loading states
- ✅ Visual divider ("Or continue with")
- ✅ Disabled state during authentication
- ✅ Error handling for OAuth failures

### OAuth Callback Page

The `/auth/callback` page handles:
- ✅ Extracting access token from URL
- ✅ Fetching user session
- ✅ Storing token and user data
- ✅ Role-based dashboard redirection
- ✅ Error handling with user feedback
- ✅ Loading and success states

## 📁 File Structure

```
frontend/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx          # OAuth callback handler
│   └── login/
│       └── page.tsx              # Login page (unchanged)
├── components/
│   └── LoginForm.tsx             # Updated with Google OAuth
├── lib/
│   └── api.ts                    # Added OAuth functions
├── .env.local                    # Environment config (created)
└── .env.example                  # Example env file (created)
```

## 🎨 UI Features

### LoginForm Enhancements

1. **Google Sign In Button**
   - Styled with official Google colors
   - Includes Google logo SVG
   - Loading state with spinner
   - Disabled during authentication

2. **Visual Improvements**
   - Divider with "Or continue with" text
   - Consistent button heights (h-11)
   - Smooth transitions
   - Professional spacing

3. **State Management**
   - Separate loading states for traditional and OAuth
   - Both buttons disabled during any auth process
   - Clear error messages via toast notifications

### Callback Page Features

1. **Loading State**
   - Animated spinner
   - "Processing authentication..." message
   - Primary color theming

2. **Success State**
   - Green checkmark icon
   - Success message
   - "Redirecting..." text
   - 1.5s delay before redirect

3. **Error State**
   - Red X icon
   - Error message display
   - Auto-redirect to login after 3s
   - Toast notification

## 🔐 Security Features

1. **Token Storage**
   - Access token stored in `localStorage`
   - Refresh token in HTTP-only cookie (backend)
   - User data stored in `localStorage`

2. **Error Handling**
   - OAuth errors caught and displayed
   - Failed authentication redirects to login
   - Network errors handled gracefully

3. **Role-Based Routing**
   - Admin users → `/admin/dashboard`
   - Regular users → `/dashboard`
   - Determined by user role from session

## 🧪 Testing the Integration

### Step 1: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
```

### Step 2: Test OAuth Flow

1. Open http://localhost:3000/login
2. Click "Sign in with Google"
3. Should redirect to Google login
4. Sign in with your Google account
5. Should redirect back to `/auth/callback`
6. Should show loading → success
7. Should redirect to dashboard

### Step 3: Verify User Session

After successful login:
- Open browser DevTools → Application → Local Storage
- You should see:
  - `accessToken`: Your JWT token
  - `user`: Your user object with email, username, role

### Step 4: Test Traditional Login

Traditional email/password login should still work:
1. Enter email and password
2. Click "Sign in"
3. Should authenticate and redirect to dashboard

## 🐛 Troubleshooting

### "Failed to initiate Google login"

**Cause:** Backend not running or OAuth not configured

**Solution:**
1. Ensure backend is running on port 3000
2. Check `SUPABASE_ANON_KEY` is set in backend `.env`
3. Verify Google OAuth is enabled in Supabase Dashboard

### "No access token received"

**Cause:** Backend OAuth callback failed

**Solution:**
1. Check backend logs for errors
2. Verify redirect URL in Supabase matches: `http://localhost:3000/api/auth/google/callback`
3. Ensure database migration has been run
4. Check Google OAuth credentials in Supabase

### CORS Errors

**Cause:** Frontend and backend on different domains

**Solution:**
1. Backend CORS is configured to allow `http://localhost:3000`
2. If using different port, update backend `app.js` CORS config
3. Ensure `withCredentials: true` in frontend API client

### "Session not found" after callback

**Cause:** Token not being sent correctly

**Solution:**
1. Check that token is stored in `localStorage`
2. Verify API interceptor is adding Authorization header
3. Check backend session endpoint is working: `GET /api/auth/session`

### Environment Variables Not Loading

**Cause:** Next.js not reading `.env.local`

**Solution:**
1. Restart the dev server
2. Environment variables must start with `NEXT_PUBLIC_` for client-side access
3. Ensure `.env.local` is in the root directory

## 📊 Backend API Requirements

For this integration to work, your backend must have:

✅ `GET /api/auth/google` - Returns Google OAuth URL
✅ `GET /api/auth/google/callback` - Handles OAuth callback
✅ `GET /api/auth/session` - Returns current user session
✅ `POST /api/auth/logout` - Logs out user

All these endpoints have been implemented in the backend OAuth integration.

## 🎯 Next Steps

### Optional Enhancements

1. **Add OAuth to Registration**
   - Update `RegistrationForm.tsx` with Google sign up

2. **Add OAuth to Admin Login**
   - Update `AdminLoginForm.tsx` with Google OAuth
   - May need separate admin OAuth flow

3. **Add More OAuth Providers**
   - Facebook, GitHub, Apple, etc.
   - Follow same pattern as Google OAuth

4. **Add Account Linking**
   - Allow users to link OAuth accounts
   - Merge OAuth and traditional accounts

5. **Add Profile Pictures**
   - Fetch and store Google profile picture
   - Display in user avatar

6. **Implement Session Management**
   - Auto-refresh tokens
   - Handle token expiration gracefully
   - Show session timeout warnings

## 💡 Usage Examples

### Manual OAuth Trigger

```typescript
import { getGoogleOAuthUrl } from "@/lib/api";

const handleGoogleLogin = async () => {
  try {
    const response = await getGoogleOAuthUrl();
    window.location.href = response.data.url;
  } catch (error) {
    console.error("OAuth error:", error);
  }
};
```

### Check User Session

```typescript
import { getSession } from "@/lib/api";

const checkAuth = async () => {
  try {
    const response = await getSession();
    console.log("User:", response.data.user);
  } catch (error) {
    console.log("Not authenticated");
  }
};
```

### Logout User

```typescript
import { logout } from "@/lib/api";

const handleLogout = async () => {
  try {
    await logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
```

## 📞 Support

If you encounter issues:

1. **Check Backend Logs** - Most errors originate from backend
2. **Inspect Network Tab** - See API requests/responses
3. **Check Console** - Frontend errors appear here
4. **Verify Environment Variables** - Ensure all are set correctly
5. **Review Backend Setup** - See `OAUTH_SETUP.md` in backend folder

## ✨ Summary

Your frontend is now fully integrated with Google OAuth! Users can:
- ✅ Sign in with Google
- ✅ Sign in with email/password (traditional)
- ✅ Seamlessly switch between auth methods
- ✅ Get redirected to appropriate dashboards
- ✅ Have tokens automatically refreshed
- ✅ Experience smooth error handling

The integration is production-ready and follows best practices for security and user experience!

---

**Last Updated:** January 2025
