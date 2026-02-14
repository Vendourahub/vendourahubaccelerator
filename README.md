# Vendoura Hub Accelerator

A comprehensive platform management system for the Vendoura Hub founder acceleration program. This application provides tools for program management, founder tracking, and milestone reporting.

## Project Structure

This codebase is built from the [System Logic Blueprint](https://www.figma.com/design/yjNFYqqC19pCF6Ab574M5J/System-Logic-Blueprint) Figma design system.

### Core Features

- **Founder Management** - Track founder progress, commits, and reports
- **Admin Dashboard** - Comprehensive analytics and program oversight
- **Authentication** - Unified auth system for founders and admins (localStorage-based)
- **Program Tracking** - Weekly commits, revenue tracking, and milestone management
- **Cohort Management** - Organize and manage founder cohorts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm i

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`.

## Architecture

### Authentication System

The app uses a **unified authentication manager** (`src/lib/authManager.ts`) that handles both founder and admin logins:

- **Founders**: Sign in via `/login`, access `/founder/dashboard`
- **Admins**: Sign in via `/admin/login`, access role-specific dashboards

Authentication data is stored in **localStorage** (client-side only).

### Key Files

- `src/lib/authManager.ts` - Unified auth functions
- `src/pages/Login.tsx` - Founder login
- `src/pages/AdminLogin.tsx` - Admin login
- `src/components/ProtectedRoute.tsx` - Route protection wrapper
- `src/lib/localStorage.ts` - Client-side data persistence

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Recent Changes

- ✅ Created unified `authManager.ts` with separate founder/admin auth functions
- ✅ Removed exposed default credentials from login pages
- ✅ Fixed Figma asset imports to use proper relative paths
- ✅ Consolidated Supabase references (now localStorage only)
- ✅ Updated ProtectedRoute to use authManager instead of Supabase

## Technology Stack

- **React 18** - UI framework
- **React Router 7** - Routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Radix UI** - Component library

## Configuration

See `src/lib/config.ts` for app configuration including:
- OAuth settings
- Feature flags
- Currency and timezone settings
- Cohort configuration

## Contributing

When making changes:

1. Update imports to use the unified `authManager` for auth logic
2. Avoid direct localStorage access outside of `lib/localStorage.ts`
3. Use TypeScript for type safety
4. Follow the existing code style

## Support

For questions or issues, contact the Vendoura Hub team.
