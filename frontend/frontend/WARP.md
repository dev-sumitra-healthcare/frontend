# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **Doctor Portal Frontend** built with Next.js 15.5.2 and React 19. It provides authentication, dashboard, and management functionality for doctors and administrators. The application uses the App Router architecture and integrates with a backend API at `http://localhost:8000/api/v1`.

## Development Commands

### Core Development
- **Start development server**: `pnpm dev` (uses Turbopack for fast compilation)
- **Build for production**: `pnpm build` (also uses Turbopack)
- **Start production server**: `pnpm start`
- **Lint code**: `pnpm lint` (uses ESLint with Next.js configuration)

### Package Management
The project uses **pnpm** as the package manager. Always use `pnpm` commands instead of npm or yarn to maintain consistency with the lockfile.

## Architecture & Key Patterns

### API Layer (`lib/api.ts`)
- **Centralized HTTP client** using Axios with interceptors
- **Automatic JWT token management** with refresh token logic
- **Separate token handling** for doctors (`accessToken`) and admins (`adminAccessToken`)
- **Fallback mechanisms** for unimplemented backend endpoints (dashboard APIs)
- **Type-safe interfaces** for all API requests and responses

### Authentication Flow
1. **Doctor Registration** → `pending_verification` status → **Admin verification** → `active` status
2. **Separate login paths**: `/login` (doctors) and `/admin/login` (administrators)
3. **Token storage**: `localStorage` for access tokens, HTTP-only cookies for refresh tokens
4. **Auto-redirect logic** based on user type and authentication status

### Form Handling
- **React Hook Form** + **Zod** for validation (`lib/schemas.ts`)
- **Consistent error handling** matching backend API error structure
- **Loading states** implemented across all forms
- **Toast notifications** using Sonner for user feedback

### UI Components Structure
```
components/
├── ui/              # Shadcn/ui base components (Button, Card, Form, etc.)
├── dashboard/       # Dashboard-specific widgets (Appointments, Performance, etc.)
├── encounter/       # Patient encounter components (AI Assistant, Forms, etc.)
└── [Form]Form.tsx   # Authentication forms (Login, Registration, AdminLogin)
```

### Routing Structure
```
app/
├── page.tsx              # Root redirects to /login
├── login/                # Doctor login
├── register/             # Doctor registration
├── dashboard/            # Doctor dashboard (authenticated)
├── encounter/[id]/       # Patient encounter details
└── admin/
    ├── login/            # Admin login
    └── dashboard/        # Admin management interface
```

## Backend Integration Status

### ✅ Fully Integrated APIs
- Doctor authentication (register, login, logout, profile)
- Admin authentication and doctor management
- JWT token refresh mechanism

### ⚠️ Fallback Implementation
These APIs have fallback mock data if backend endpoints return 404:
- `GET /dashboard/appointments/today`
- `GET /dashboard/action-items`  
- `GET /dashboard/performance-stats`

## Key Technologies

### Core Stack
- **Next.js 15.5.2** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Radix UI** components for accessibility

### State & Data
- **React Hook Form** + **Zod** for form management
- **Axios** for HTTP requests with interceptors
- **js-cookie** for client-side cookie handling
- **localStorage** for token persistence

### UI Libraries
- **Lucide React** for icons
- **Sonner** for toast notifications
- **next-themes** for theme management
- **Shadcn/ui** component system

## Development Patterns

### Component Organization
- **UI components** are atomic and reusable (`components/ui/`)
- **Feature components** are grouped by domain (`dashboard/`, `encounter/`)
- **Form components** handle their own validation and API calls
- **Widget components** are self-contained with error boundaries

### API Integration
- All API calls go through the centralized `apiClient` in `lib/api.ts`
- Use TypeScript interfaces for all request/response types
- Handle loading states and errors consistently across components
- Implement fallback UI for unavailable backend features

### Authentication Context
- Check for appropriate token based on user type (doctor vs admin)
- Handle automatic logout on token expiration
- Redirect to correct login page based on context
- Preserve intended destination after login

### Error Handling
- API errors are structured as `{ success: false, message: string, errors?: Array<{field, message}> }`
- Form validation errors are displayed inline using react-hook-form
- Toast notifications for system-level messages
- Graceful degradation for missing backend endpoints

## File Locations

### Configuration
- TypeScript: `tsconfig.json` (uses `@/*` path mapping)
- ESLint: `eslint.config.mjs` (Next.js + TypeScript rules)
- Next.js: `next.config.ts`
- Tailwind: Uses Tailwind CSS v4 with `@tailwindcss/postcss`

### Key Source Files
- API layer: `lib/api.ts`
- Validation schemas: `lib/schemas.ts` 
- Type definitions: `lib/types.ts`
- Global styles: `app/globals.css`
- Root layout: `app/layout.tsx`

## Backend Dependencies

The frontend expects a backend server running at `http://localhost:8000/api/v1` with the following implemented endpoints:
- Authentication endpoints (`/register`, `/login`, `/logout`, `/refresh-token`)
- Admin endpoints (`/admin/*`)
- Profile endpoints (`/profile`)

Dashboard endpoints are optional and will use fallback data if not available.
