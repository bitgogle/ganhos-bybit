# Copilot Instructions for Ganhos Bybit

This document provides context and guidelines for GitHub Copilot when working with this repository.

## Project Overview

Ganhos Bybit is a cryptocurrency investment platform with an administrative panel. The user interface is in Portuguese (Brazilian), while the admin interface is in English.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context + TanStack React Query
- **Routing**: React Router DOM
- **Database**: Supabase
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── admin/        # Admin panel components
│   └── withdrawal/   # Withdrawal-related components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── integrations/     # External service integrations (Supabase)
├── lib/              # Utility functions
├── pages/            # Page components
└── assets/           # Static assets
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Code Style Guidelines

- Use TypeScript for all new files
- Use functional components with hooks
- Follow the existing file structure and naming conventions
- Use the `@/` path alias for imports (e.g., `@/components/ui/button`)
- Use shadcn/ui components from `@/components/ui/` for UI elements
- Apply Tailwind CSS classes for styling
- Use the Bybit color scheme defined in `tailwind.config.ts` (dark theme with `bybit-black`, `bybit-gold`, `bybit-card`, `bybit-border`, and `bybit-secondary` colors)

## Component Guidelines

- Place reusable components in `src/components/`
- Place page components in `src/pages/`
- Use shadcn/ui components as the base for UI elements
- Follow the existing pattern for form components using React Hook Form + Zod

## Internationalization

- User-facing content should be in Portuguese (Brazilian)
- Admin panel content should be in English
- Maintain consistency with existing language patterns in the codebase

## Best Practices

- Keep components small and focused
- Use TypeScript interfaces for props
- Handle loading and error states appropriately
- Use React Query for server state management
- Validate forms with Zod schemas
- Follow the existing dark theme design patterns
