# GEMINI.md

## Project Overview

This is a Next.js web application that serves as a frontend for a Doctor Portal. It allows doctors to register, log in, and manage their profiles. It also includes an admin section for managing doctors. The application is built with Next.js, React, TypeScript, and Tailwind CSS. It uses `react-hook-form` and `zod` for forms and validation, `axios` for API communication, and `sonner` for notifications.

## Building and Running

To get the development server running:

```bash
pnpm dev
```

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

To lint the code:

```bash
pnpm lint
```

## Development Conventions

*   **API Communication:** All API calls are centralized in `lib/api.ts`. An Axios client is configured with interceptors to handle JWT authentication (access and refresh tokens). The base URL for the API is `http://localhost:8000/api/v1`.
*   **State Management:** The application appears to manage state within components using React hooks. For global state, it relies on `localStorage` for storing the access token.
*   **Styling:** The project uses Tailwind CSS for styling. UI components are built using Radix UI and are located in the `components/ui` directory.
*   **Forms:** Forms are built using `react-hook-form` and validated with `zod`. Schemas for form validation are located in `lib/schemas.ts`.
*   **Routing:** The application uses the Next.js App Router. The main entry point redirects to the `/login` page. After a successful login, users are redirected to the `/dashboard`.
*   **Error Handling:** Errors from API calls are handled within the components, and user-friendly notifications are displayed using `sonner`.
