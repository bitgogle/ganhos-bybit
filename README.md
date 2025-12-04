# Ganhos Bybit

A cryptocurrency investment platform with an administrative panel. The user interface is in Portuguese (Brazilian), while the admin interface is in English.

## Features

### User Features (Portuguese Interface)

- **Landing Page** - Attractive landing page with investment plan information
- **User Registration** - Account creation with administrative approval system
- **User Dashboard** - Complete dashboard with:
  - Balance and statistics visualization
  - Investment plans (Starter, Professional, Premium)
  - PIX deposit system
  - Withdrawal system with configurable fees
  - Complete transaction history
- **Account States**:
  - Pending approval
  - Approved/Active
  - Rejected

### Admin Features (English Interface)

- **Admin Dashboard** - Complete administrative panel with:
  - Real-time statistics
  - User management (approve/reject registrations)
  - Transaction management (approve/reject deposits and withdrawals)
  - User balance editing
  - Platform settings (PIX, fees, limits)

## Investment Plans

| Plan | Investment Range | Daily Return | Monthly Return |
|------|------------------|--------------|----------------|
| Starter | R$ 100 - R$ 999 | 1.5% | up to 45% |
| Professional | R$ 1,000 - R$ 4,999 | 2.0% | up to 60% |
| Premium | R$ 5,000+ | 2.5% | up to 75% |

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context + TanStack React Query
- **Routing**: React Router DOM
- **Database**: Supabase
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```bash
# Clone the repository
git clone https://github.com/bitgogle/ganhos-bybit.git

# Navigate to the project directory
cd ganhos-bybit

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Supabase Setup

This application requires a properly configured Supabase backend. See the **[complete Supabase setup guide](SUPABASE_SETUP.md)** for detailed instructions.

**Quick Setup:**
1. Create a Supabase project
2. Run all 5 migration files (in order)
3. Run `initialize-supabase.sql`
4. Create your first admin user
5. Configure environment variables

### Environment Configuration

The application requires environment variables to connect to Supabase. The repository includes a `.env` file with the Supabase configuration.

**Important**: The environment variables use the `VITE_` prefix, which is required by Vite to expose them to the client-side code:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

If you need to use different credentials:

1. Update the `.env` file with your Supabase credentials
2. Get your credentials from: `https://app.supabase.com/project/_/settings/api`
3. Only use the **anon/public key** (never commit service role keys to client-side code)

**Related Documentation:**
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Complete database setup guide
- [SUPABASE_CHECKLIST.md](SUPABASE_CHECKLIST.md) - Setup verification checklist
- [ADMIN_SETUP.md](ADMIN_SETUP.md) - First admin user creation

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Application Routes

| Route | Description |
|-------|-------------|
| `/` | Public landing page |
| `/login` | User and admin login |
| `/register` | New user registration |
| `/dashboard` | User dashboard (requires login) |
| `/pending-approval` | Approval waiting page |
| `/rejected` | Registration rejected page |
| `/admin` | Admin panel (requires admin login) |

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

## Design

- **Primary Colors**: Black (#0a0a0a) and Gold (#f7931a)
- **Theme**: Elegant and professional dark mode
- **Responsive**: Fully adaptable for mobile, tablet, and desktop
- **Animations**: Smooth transitions and modern visual effects

## User Flow

1. **Registration**: User registers with personal data
2. **Pending**: Account is pending administrative approval
3. **Approval**: Admin approves or rejects the registration
4. **Dashboard**: User accesses dashboard and views plans
5. **Deposit**: User requests deposit via PIX
6. **Deposit Approval**: Admin approves the deposit
7. **Active Investment**: Balance is credited and starts earning
8. **Withdrawal**: User can request withdrawal at any time
9. **Processing**: Admin processes and approves the withdrawal

## Deployment to Vercel

This project is configured for automatic deployment to Vercel.

### Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A Vercel project linked to this repository

### Environment Variables

Before deploying, set up the following environment variables in your Vercel project settings:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
```

You can find these values in your Supabase project settings at:
`https://app.supabase.com/project/_/settings/api`

### Automated Deployment with GitHub Actions

This repository includes GitHub Actions workflows for automated deployment:

- **Production Deployment**: Triggers on push to `main` or `master` branch
- **Preview Deployment**: Triggers on pull requests to `main` or `master` branch

#### Required GitHub Secrets

Add the following secrets to your GitHub repository (`Settings` → `Secrets and variables` → `Actions`):

- `VERCEL_TOKEN`: Your Vercel authentication token
  - Get it from: https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: Your Vercel organization ID
  - Run: `vercel whoami` or find it in your Vercel project settings
- `VERCEL_PROJECT_ID`: Your Vercel project ID
  - Find it in your Vercel project settings (`.vercel/project.json`)

### Manual Deployment

If you prefer to deploy manually using the Vercel CLI:

```bash
# Login to Vercel (no global installation needed)
npx vercel@latest login

# Deploy to preview
npx vercel@latest

# Deploy to production
npx vercel@latest --prod
```

### First Time Setup

1. Login: `npx vercel@latest login`
2. Link project: `npx vercel@latest link`
3. Set environment variables: `npx vercel@latest env add VITE_SUPABASE_URL production`
4. Deploy: `npx vercel@latest --prod`

### Vercel Configuration

The project includes a `vercel.json` file with the following configuration:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Rewrites**: All routes redirect to `/` for client-side routing

## License

This project is private and proprietary.
