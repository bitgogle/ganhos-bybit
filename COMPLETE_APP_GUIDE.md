# 🚀 GANHOS BYBIT - COMPLETE APPLICATION GUIDE
# EVERY SINGLE DETAIL FOR BUILDING THE COMPLETE APP FROM SCRATCH TO DEPLOYMENT

**📅 Last Updated**: December 6, 2024  
**📝 Version**: 1.0.0  
**📄 Total Lines of Code**: ~9,232 lines (TypeScript/TSX)  
**📦 Dependencies**: 367 npm packages  
**⏱️ Build Time**: ~4.5 seconds  
**🚀 Deployment**: Vercel with GitHub Actions  
**💾 Database**: PostgreSQL via Supabase

---

## 📖 ABOUT THIS DOCUMENT

This is a **COMPREHENSIVE, ALL-IN-ONE GUIDE** that contains absolutely EVERYTHING you need to build the Ganhos Bybit cryptocurrency investment platform from scratch to production deployment.

**What's Included:**
✅ Complete project architecture and design
✅ Every single technology with versions
✅ Full database schema with all tables and relationships
✅ Complete source code examples for all major components
✅ Step-by-step setup instructions
✅ Environment configuration
✅ Build and deployment procedures
✅ Security best practices
✅ Testing procedures
✅ Troubleshooting guides
✅ Complete code examples

**Who This Guide Is For:**
- Developers building from scratch
- Teams deploying to production
- Developers maintaining the application
- Anyone needing to understand the complete system

**How to Use This Guide:**
1. Read sections 1-3 for overview
2. Follow section 4 for environment setup
3. Use section 6-7 for database and code understanding
4. Follow section 8 for building step-by-step
5. Use section 9 for deployment
6. Reference sections 10-12 for maintenance
7. Use section 13 for code examples
8. Keep section 15 as quick reference

**Prerequisites Knowledge:**
- Basic TypeScript/JavaScript
- React fundamentals
- Understanding of REST APIs
- Basic SQL knowledge
- Command line familiarity
- Git basics

**Estimated Time to Build:**
- Environment Setup: 30 minutes
- Database Setup: 1 hour
- Code Implementation: Varies (code already exists)
- Testing: 1 hour
- Deployment: 30 minutes
- **Total**: ~3-4 hours (for fresh deployment)

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Complete Technology Stack](#2-complete-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Prerequisites & Environment Setup](#4-prerequisites--environment-setup)
5. [Complete Project Structure](#5-complete-project-structure)
6. [Database Schema & Setup](#6-database-schema--setup)
7. [Core Application Code](#7-core-application-code)
8. [Step-by-Step Build Instructions](#8-step-by-step-build-instructions)
9. [Deployment Guide](#9-deployment-guide)
10. [Security & Best Practices](#10-security--best-practices)
11. [Testing & Validation](#11-testing--validation)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. PROJECT OVERVIEW

### 1.1 What is Ganhos Bybit?

Ganhos Bybit is a **cryptocurrency investment platform** with a complete administrative panel. It's a full-stack web application that allows users to invest in cryptocurrency and earn returns, while administrators manage users, transactions, and platform settings.

**Key Features:**
- User registration and authentication
- Investment plans with daily returns
- Deposit system via PIX (Brazilian payment method)
- Withdrawal system with configurable fees
- Complete transaction history
- Administrative panel for user and transaction management
- Real-time balance updates
- Notification system
- Multi-language support (Portuguese for users, English for admins)

### 1.2 Business Model

The platform operates on an investment model where:
- Users deposit funds via PIX
- They can invest in predefined plans (R$ 200 to R$ 5,000 in R$ 100 increments)
- Investments generate R$ 20 profit for every R$ 100 invested every 3 hours
- Users can choose investment duration (1-7 days)
- Users can withdraw their balance at any time
- Administrators manage and approve all transactions

### 1.3 Target Audience

- **Primary Users**: Brazilian cryptocurrency investors
- **Admin Users**: Platform operators and managers
- **Language**: Portuguese (BR) for user interface, English for admin interface

---

## 2. COMPLETE TECHNOLOGY STACK

### 2.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **TypeScript** | 5.8.3 | Type-safe JavaScript |
| **Vite** | 5.4.19 | Build tool & dev server |
| **React Router DOM** | 6.30.1 | Client-side routing |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **shadcn/ui** | Latest | Component library |
| **Radix UI** | Various | Headless UI primitives |
| **Lucide React** | 0.462.0 | Icon library |

### 2.2 Backend & Database

| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service |
| **PostgreSQL** | Database (via Supabase) |
| **Supabase Auth** | Authentication |
| **Supabase Storage** | File storage |
| **Row Level Security** | Data security |

### 2.3 State Management & Data Fetching

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Context** | Built-in | Global state |
| **TanStack React Query** | 5.83.0 | Server state management |
| **React Hook Form** | 7.61.1 | Form handling |
| **Zod** | 3.25.76 | Schema validation |

### 2.4 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **TypeScript ESLint** | TypeScript linting |
| **PostCSS** | CSS processing |
| **Autoprefixer** | CSS vendor prefixes |

### 2.5 Deployment

| Service | Purpose |
|---------|---------|
| **Vercel** | Hosting & CI/CD |
| **GitHub Actions** | Automated deployments |
| **Vercel Analytics** | Usage tracking |

---

## 3. SYSTEM ARCHITECTURE

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT BROWSER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │   Landing    │  │  Dashboard   │  │   Admin    │  │  │
│  │  │    Page      │  │    (User)    │  │   Panel    │  │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         React Router (Client-Side Routing)      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │    Context Providers (Auth, App State)          │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS API Calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Supabase API Layer                        │  │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │  │
│  │  │   Auth   │  │  Realtime │  │     Storage      │  │  │
│  │  │  Service │  │  Updates  │  │  (File Uploads)  │  │  │
│  │  └──────────┘  └───────────┘  └──────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 PostgreSQL Database                    │  │
│  │  ┌────────────┐ ┌─────────────┐ ┌──────────────────┐ │  │
│  │  │  profiles  │ │transactions │ │ system_settings  │ │  │
│  │  ├────────────┤ ├─────────────┤ ├──────────────────┤ │  │
│  │  │user_roles  │ │notifications│ │  fee_requests    │ │  │
│  │  └────────────┘ └─────────────┘ └──────────────────┘ │  │
│  │                                                         │  │
│  │  ┌───────────────────────────────────────────────────┐ │  │
│  │  │  Row Level Security Policies (RLS)                │ │  │
│  │  └───────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow

#### User Registration Flow:
1. User fills registration form
2. Frontend validates data with Zod
3. Supabase Auth creates user account
4. Database trigger creates profile record
5. Profile status set to 'active' (immediate access)
6. User redirected to dashboard

#### Transaction Flow:
1. User requests deposit/withdrawal
2. Transaction created with 'pending' status
3. Admin receives notification
4. Admin approves/rejects transaction
5. If approved, user balance updated
6. User receives notification
7. Transaction status updated

#### Authentication Flow:
1. User submits credentials
2. Supabase Auth validates
3. Session token generated
4. Profile data fetched
5. Admin role checked
6. User redirected to appropriate dashboard


---

## 4. PREREQUISITES & ENVIRONMENT SETUP

### 4.1 Required Software & Accounts

#### Essential Tools:
1. **Node.js 18 or higher** - JavaScript runtime
   - Download: https://nodejs.org/
   - Verify: `node --version` (should show v18.x.x or higher)

2. **npm** - Package manager (comes with Node.js)
   - Verify: `npm --version` (should show 9.x.x or higher)

3. **Git** - Version control
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **Code Editor** - VS Code recommended
   - Download: https://code.visualstudio.com/

#### Required Accounts:
1. **GitHub Account** - For code repository
   - Sign up: https://github.com/signup

2. **Supabase Account** - For backend services
   - Sign up: https://supabase.com

3. **Vercel Account** - For deployment
   - Sign up: https://vercel.com/signup

### 4.2 Environment Variables

Create a `.env` file in the project root with these variables:

```env
# Supabase Configuration
# Get these from: https://app.supabase.com/project/_/settings/api

# Your Supabase project URL (e.g., https://abcdefgh.supabase.co)
VITE_SUPABASE_URL="https://your-project-id.supabase.co"

# Your Supabase anon/public key (NOT the service role key!)
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key-here"
```

**IMPORTANT**: 
- Never use the service role key in client-side code!
- The `VITE_` prefix is required for Vite to expose variables to the client
- Never commit `.env` file to Git (it's in `.gitignore`)

### 4.3 Installing Dependencies

After cloning or creating the project:

```bash
# Navigate to project directory
cd ganhos-bybit

# Install all dependencies
npm install

# This installs:
# - 367 packages
# - React, TypeScript, Vite, and all UI components
# - Takes about 2-3 minutes on average internet connection
```

### 4.4 Development Environment Setup

#### VS Code Extensions (Recommended):
1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - CSS class autocomplete
4. **TypeScript Vue Plugin (Volar)** - TypeScript support
5. **GitLens** - Git supercharged

#### Browser Extensions (For Development):
1. **React Developer Tools** - React debugging
2. **Redux DevTools** - State debugging
3. **Supabase Client** - Database inspection

---

## 5. COMPLETE PROJECT STRUCTURE

### 5.1 Root Directory Structure

```
ganhos-bybit/
├── .github/                    # GitHub configuration
│   ├── agents/                 # GitHub agents
│   │   └── my-agent.agent.md
│   ├── copilot-instructions.md # Copilot instructions
│   └── workflows/              # GitHub Actions
│       ├── vercel-preview.yml
│       └── vercel-production.yml
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── scripts/                    # Build/deploy scripts
├── src/                        # Source code (detailed below)
├── supabase/                   # Database migrations
│   ├── migrations/             # SQL migration files
│   ├── config.toml             # Supabase config
│   ├── initialize-supabase.sql # Initial setup
│   └── verify-setup.sql        # Setup verification
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── .vercelignore               # Vercel ignore rules
├── components.json             # shadcn/ui config
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── package-lock.json           # Locked dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript config
├── tsconfig.app.json           # App TypeScript config
├── tsconfig.node.json          # Node TypeScript config
├── vercel.json                 # Vercel deployment config
├── vite.config.ts              # Vite build config
├── README.md                   # Project documentation
├── DEPLOYMENT.md               # Deployment guide
├── SUPABASE_SETUP.md           # Database setup
└── ADMIN_SETUP.md              # Admin user setup
```

### 5.2 Source Code Structure (`src/` directory)

```
src/
├── assets/                     # Static images
│   ├── bybit-card.jpeg
│   ├── bybit-ceo.jpeg
│   ├── bybit-feature-upgrade.jpeg
│   ├── bybit-logo-circular.png
│   ├── bybit-options.jpeg
│   ├── bybit-pay.jpeg
│   ├── bybit-platform.jpeg
│   ├── bybit-standard.jpeg
│   ├── bybit-tradfi.jpeg
│   └── bybit-vs-binance.jpeg
│
├── components/                 # Reusable components
│   ├── admin/                  # Admin-specific components
│   │   ├── UserRestrictionManager.tsx
│   │   └── WithdrawalFeeSettings.tsx
│   ├── withdrawal/             # Withdrawal components
│   │   └── WithdrawalFeeDialog.tsx
│   ├── ui/                     # shadcn/ui components (50+ files)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (45+ more UI components)
│   └── NavLink.tsx             # Navigation link component
│
├── context/                    # React Context providers
│   └── AppContext.tsx          # Main app context
│
├── hooks/                      # Custom React hooks
│   ├── use-mobile.tsx          # Mobile detection hook
│   └── use-toast.ts            # Toast notification hook
│
├── integrations/               # External integrations
│   └── supabase/
│       ├── client.ts           # Supabase client
│       └── types.ts            # Database types
│
├── lib/                        # Utility libraries
│   ├── data.ts                 # Static data
│   ├── format.ts               # Formatting utilities
│   └── utils.ts                # General utilities
│
├── pages/                      # Page components
│   ├── Admin.tsx               # Admin dashboard
│   ├── Dashboard.tsx           # User dashboard
│   ├── DepositDetails.tsx      # Deposit details page
│   ├── FeePayment.tsx          # Fee payment page
│   ├── Landing.tsx             # Landing page
│   ├── Login.tsx               # Login page
│   ├── NotFound.tsx            # 404 page
│   ├── PendingApproval.tsx     # Pending approval page
│   ├── Register.tsx            # Registration page
│   └── Rejected.tsx            # Rejection page
│
├── App.tsx                     # Main app component
├── index.css                   # Global styles
├── main.tsx                    # App entry point
└── vite-env.d.ts               # Vite type definitions
```

### 5.3 Key File Purposes

| File | Purpose | Size (approx) |
|------|---------|---------------|
| `src/main.tsx` | Application entry point | 15 lines |
| `src/App.tsx` | Main app setup & routing | 45 lines |
| `src/context/AppContext.tsx` | Global state management | 240 lines |
| `src/pages/Landing.tsx` | Landing page | 500+ lines |
| `src/pages/Dashboard.tsx` | User dashboard | 800+ lines |
| `src/pages/Admin.tsx` | Admin panel | 1000+ lines |
| `src/pages/Login.tsx` | Login form | 200 lines |
| `src/pages/Register.tsx` | Registration form | 400 lines |
| `src/integrations/supabase/client.ts` | Database connection | 17 lines |
| `tailwind.config.ts` | Styling configuration | 110 lines |
| `vite.config.ts` | Build configuration | 18 lines |


---

## 6. DATABASE SCHEMA & SETUP

### 6.1 Complete Database Schema

The application uses PostgreSQL via Supabase with 6 main tables:

#### Table 1: `profiles`
**Purpose**: Stores user profile information and balances

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    cpf TEXT,
    pix_key TEXT,
    bybit_uid TEXT,
    usdt_address TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
    available_balance NUMERIC(15,2) DEFAULT 0.00,
    invested_balance NUMERIC(15,2) DEFAULT 0.00,
    profit_balance NUMERIC(15,2) DEFAULT 0.00,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    restricted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
CREATE UNIQUE INDEX idx_profiles_email ON profiles(email);
```

**Columns Explained**:
- `id`: Links to Supabase Auth user
- `name`: User's full name
- `email`: Unique email address
- `phone`: Contact phone (Brazilian format)
- `cpf`: Brazilian tax ID
- `pix_key`: PIX key for withdrawals
- `bybit_uid`: Bybit platform user ID
- `usdt_address`: USDT wallet address
- `status`: Account status (pending/active/rejected)
- `available_balance`: Funds available for withdrawal
- `invested_balance`: Currently invested amount
- `profit_balance`: Total profits earned
- `role`: User type (user/admin)
- `restricted`: Account restriction flag
- `created_at`: Registration timestamp
- `updated_at`: Last update timestamp

#### Table 2: `transactions`
**Purpose**: Records all financial transactions

```sql
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'investment', 'profit')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    amount NUMERIC(15,2) NOT NULL CHECK (amount > 0 AND amount <= 10000000),
    reference TEXT,
    proof_url TEXT,
    processed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_user_status ON transactions(user_id, status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

**Columns Explained**:
- `id`: Unique transaction identifier
- `user_id`: Links to user profile
- `type`: Transaction type (deposit/withdrawal/investment/profit)
- `status`: Processing status
- `amount`: Transaction amount (max R$ 10M)
- `reference`: Reference number or notes
- `proof_url`: URL to payment proof
- `processed_by`: Admin who processed
- `created_at`: Transaction creation time
- `updated_at`: Last status update

#### Table 3: `notifications`
**Purpose**: User notification system

```sql
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

#### Table 4: `fee_requests`
**Purpose**: Withdrawal fee payment requests

```sql
CREATE TABLE public.fee_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    related_withdrawal_id UUID REFERENCES transactions(id),
    amount NUMERIC(15,2) NOT NULL,
    proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '3 hours'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_fee_requests_user_id ON fee_requests(user_id);
CREATE INDEX idx_fee_requests_status ON fee_requests(status);
CREATE INDEX idx_fee_requests_created_at ON fee_requests(created_at);
```

#### Table 5: `system_settings`
**Purpose**: Global platform configuration (single row)

```sql
CREATE TABLE public.system_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Only one row allowed
    pix_key TEXT,
    pix_name TEXT,
    pix_bank TEXT,
    bybit_uid TEXT,
    usdt_address TEXT,
    withdrawal_fee_enabled BOOLEAN DEFAULT FALSE,
    withdrawal_fee_amount NUMERIC(15,2) DEFAULT 0.00,
    withdrawal_fee_mode TEXT DEFAULT 'deduct' CHECK (withdrawal_fee_mode IN ('deduct', 'deposit')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize with one row
INSERT INTO system_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
```

#### Table 6: `user_roles`
**Purpose**: Admin role assignments

```sql
CREATE TYPE app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    UNIQUE(user_id, role)
);

-- Indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
```

### 6.2 Database Functions

#### Function 1: Auto-create user profile

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, phone, cpf, status, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
        'active', -- Immediate access
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

#### Function 2: Check user role

```sql
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, check_role app_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_roles.user_id = $1
        AND user_roles.role = $2
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Function 3: Auto-update timestamps

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fee_requests_updated_at
    BEFORE UPDATE ON public.fee_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 6.3 Row Level Security (RLS) Policies

#### Profiles Table RLS:

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));
```

#### Transactions Table RLS:

```sql
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can create their own transactions
CREATE POLICY "Users can create own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
    ON public.transactions FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all transactions
CREATE POLICY "Admins can update all transactions"
    ON public.transactions FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));
```

#### Similar RLS policies exist for all other tables...

### 6.4 Storage Bucket

**Bucket Name**: `proofs`
**Purpose**: Store transaction proof documents

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('proofs', 'proofs', FALSE);

-- RLS for uploads
CREATE POLICY "Users can upload to own folder"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'proofs' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- RLS for viewing
CREATE POLICY "Users can view own files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'proofs' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Admins can view all
CREATE POLICY "Admins can view all files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'proofs' AND
        public.has_role(auth.uid(), 'admin')
    );
```


---

## 7. CORE APPLICATION CODE

### 7.1 Entry Point Files

#### `index.html` - HTML Entry Point
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Plataforma de investimentos em criptomoedas - Ganhos Bybit" />
    <title>Ganhos Bybit - Investimentos em Criptomoedas</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### `src/main.tsx` - React Entry Point
```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

#### `src/App.tsx` - Main Application Component
```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PendingApproval from "./pages/PendingApproval";
import Rejected from "./pages/Rejected";
import Admin from "./pages/Admin";
import FeePayment from "./pages/FeePayment";
import DepositDetails from "./pages/DepositDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            <Route path="/rejected" element={<Rejected />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/fee-payment/:feeId" element={<FeePayment />} />
            <Route path="/deposit/:method" element={<DepositDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
```

### 7.2 Configuration Files

#### `package.json` - Dependencies & Scripts
```json
{
  "name": "vite_react_shadcn_ts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@supabase/supabase-js": "^2.84.0",
    "@tanstack/react-query": "^5.83.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-router-dom": "^6.30.1",
    "sonner": "^1.7.4",
    "zod": "^3.25.76",
    // ... 50+ more dependencies for UI components
  },
  "devDependencies": {
    "@types/react": "^18.3.23",
    "@vitejs/plugin-react-swc": "^3.11.0",
    "eslint": "^9.32.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "vite": "^5.4.19"
  }
}
```

#### `vite.config.ts` - Build Configuration
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

#### `tailwind.config.ts` - Styling Configuration
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bybit: {
          black: "hsl(var(--bybit-black))",
          card: "hsl(var(--bybit-card))",
          border: "hsl(var(--bybit-border))",
          gold: "hsl(var(--bybit-gold))",
          "gold-hover": "hsl(var(--bybit-gold-hover))",
          secondary: "hsl(var(--bybit-secondary))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

#### `vercel.json` - Deployment Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### 7.3 Supabase Integration

#### `src/integrations/supabase/client.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

### 7.4 Context Provider

#### `src/context/AppContext.tsx` - Global State Management
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  pix_key?: string;
  bybit_uid?: string;
  usdt_address?: string;
  status: 'pending' | 'active' | 'rejected';
  available_balance: number;
  invested_balance: number;
  profit_balance: number;
  role: 'user' | 'admin';
  restricted?: boolean;
}

interface AppContextType {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  investmentPlans: InvestmentPlan[];
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch profile data
  const fetchProfile = async (currentSession: Session) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentSession.user.id)
      .single();

    if (data) {
      // Check admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentSession.user.id)
        .single();

      setProfile({ ...data, role: roleData?.role || 'user' });
      setIsAdmin(roleData?.role === 'admin');
    }
    setLoading(false);
  };

  // Initialize session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) fetchProfile(session);
        else {
          setProfile(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppContext.Provider value={{
      session, profile, loading, isAdmin,
      investmentPlans, refreshProfile, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
```

### 7.5 Utility Functions

#### `src/lib/format.ts` - Formatting Utilities
```typescript
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};
```

#### `src/lib/utils.ts` - General Utilities
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
```


---

## 8. STEP-BY-STEP BUILD INSTRUCTIONS

### 8.1 Setting Up From Scratch

#### Step 1: Create New Project (If starting fresh)
```bash
# Create Vite project with React + TypeScript
npm create vite@latest ganhos-bybit -- --template react-ts

# Navigate to project
cd ganhos-bybit

# Install dependencies
npm install
```

#### Step 2: Install All Required Dependencies
```bash
# Core dependencies
npm install react-router-dom
npm install @supabase/supabase-js
npm install @tanstack/react-query

# Form handling
npm install react-hook-form zod @hookform/resolvers

# UI Components (shadcn/ui)
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label
npm install @radix-ui/react-select
npm install @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install @radix-ui/react-slot
# ... (50+ more @radix-ui packages)

# Styling
npm install tailwindcss postcss autoprefixer
npm install tailwindcss-animate
npm install class-variance-authority
npm install clsx tailwind-merge

# Icons
npm install lucide-react

# Utilities
npm install sonner date-fns

# Development dependencies
npm install -D @types/node
npm install -D eslint @eslint/js
npm install -D typescript-eslint
npm install -D eslint-plugin-react-hooks
```

#### Step 3: Configure Tailwind CSS
```bash
# Initialize Tailwind
npx tailwindcss init -p

# This creates:
# - tailwind.config.js
# - postcss.config.js
```

Update `tailwind.config.ts`:
```typescript
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bybit: {
          black: "#0a0a0a",
          gold: "#f7931a",
          card: "#1a1a1a",
          border: "#2a2a2a",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bybit-black: 10 10 10;
    --bybit-gold: 33 146 255;
    --bybit-card: 26 26 26;
    --bybit-border: 42 42 42;
  }
  
  .dark {
    --background: 10 10 10;
    --foreground: 255 255 255;
  }
}
```

#### Step 4: Set Up Project Structure
```bash
# Create directory structure
mkdir -p src/components/ui
mkdir -p src/components/admin
mkdir -p src/components/withdrawal
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/integrations/supabase
mkdir -p src/lib
mkdir -p src/pages
mkdir -p src/assets

# Create empty files
touch src/context/AppContext.tsx
touch src/integrations/supabase/client.ts
touch src/integrations/supabase/types.ts
touch src/lib/format.ts
touch src/lib/utils.ts
touch src/lib/data.ts
```

#### Step 5: Set Up Supabase Connection

Create `src/integrations/supabase/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

Create `.env` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

#### Step 6: Configure Path Aliases

Update `vite.config.ts`:
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 8.2 Building the Application

#### Development Build
```bash
# Start development server
npm run dev

# Access at http://localhost:8080
# Features hot-reload, fast refresh
```

#### Production Build
```bash
# Build for production
npm run build

# Output goes to dist/ directory
# Creates optimized, minified files
# Takes about 4-5 seconds

# Preview production build
npm run preview
```

#### Build Output Structure:
```
dist/
├── assets/
│   ├── index-[hash].js      # Main JavaScript bundle (736KB)
│   ├── index-[hash].css     # Styles (71KB)
│   └── [images]             # Optimized images
├── index.html               # Entry HTML
└── favicon.ico              # Favicon
```

### 8.3 Database Setup

#### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization
4. Set project name: "ganhos-bybit"
5. Set database password (save it!)
6. Choose region (closest to users)
7. Wait 2-3 minutes for setup

#### Step 2: Run Migrations

Navigate to SQL Editor in Supabase Dashboard and run these files in order:

1. **Migration 1**: `20251124201834_remix_migration_from_pg_dump.sql`
   - Creates all tables
   - Sets up RLS policies
   - Creates functions and triggers

2. **Migration 2**: `20251125012339_5de73f12-b796-4b23-95de-3c441da32b04.sql`
   - Adds storage bucket
   - Enhances security

3. **Migration 3**: `20251127190958_8056e4fb-02be-4446-bb0e-a2e89d385faf.sql`
   - Adds PIX fields

4. **Migration 4**: `20251204050000_add_auth_trigger.sql`
   - Sets up auto profile creation

5. **Migration 5**: `20251204051000_add_indexes_and_optimizations.sql`
   - Adds performance indexes

6. **Migration 6**: `20251206043000_update_handle_new_user_active_status.sql`
   - Updates user activation

#### Step 3: Initialize System Settings
```sql
-- Run in SQL Editor
INSERT INTO system_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;
```

#### Step 4: Create First Admin User

Register via the app, then run:
```sql
-- Get user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Make user admin
INSERT INTO user_roles (user_id, role)
VALUES ('user-id-from-above', 'admin');

-- Activate profile
UPDATE profiles
SET status = 'active'
WHERE id = 'user-id-from-above';
```

#### Step 5: Verify Setup
```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Should return 6 tables

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- All should show 't'

-- Check storage bucket
SELECT id, name, public 
FROM storage.buckets;
-- Should show 'proofs' bucket
```

### 8.4 Testing the Application

#### Manual Testing Checklist:

**Authentication Tests:**
- [ ] Register new user
- [ ] Login with email/password
- [ ] Logout
- [ ] Session persists on refresh
- [ ] Protected routes redirect to login
- [ ] Admin routes require admin role

**User Dashboard Tests:**
- [ ] View balance
- [ ] View investment plans
- [ ] Create deposit request
- [ ] Upload proof of payment
- [ ] Request withdrawal
- [ ] View transaction history
- [ ] Receive notifications

**Admin Panel Tests:**
- [ ] View all users
- [ ] Approve/reject users
- [ ] View all transactions
- [ ] Approve/reject deposits
- [ ] Approve/reject withdrawals
- [ ] Edit user balances
- [ ] Configure system settings
- [ ] Manage withdrawal fees

**UI/UX Tests:**
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Forms validate correctly
- [ ] Error messages display
- [ ] Success toasts appear
- [ ] Loading states show
- [ ] Icons render properly

#### Automated Testing (Optional):

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Add test script to package.json
"scripts": {
  "test": "vitest"
}

# Run tests
npm test
```

### 8.5 Linting & Code Quality

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Check TypeScript
npx tsc --noEmit
```

Common lint rules enforced:
- No unused variables
- Consistent component naming
- Proper hook dependencies
- No console.log in production
- Consistent import ordering


---

## 9. DEPLOYMENT GUIDE

### 9.1 Preparing for Deployment

#### Pre-Deployment Checklist:
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Admin user created
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors
- [ ] All routes work
- [ ] Forms validate properly
- [ ] Images load correctly

#### Build Optimization:
```bash
# Build with production env
npm run build

# Check bundle size
ls -lh dist/assets/

# Typical sizes:
# - JavaScript: ~736KB (210KB gzipped)
# - CSS: ~71KB (12KB gzipped)
# - Images: Total ~200KB
```

### 9.2 Deploying to Vercel (Recommended)

#### Method 1: Import from GitHub (Easiest)

**Step 1**: Connect Repository
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `bitgogle/ganhos-bybit`
4. Click "Import"

**Step 2**: Configure Project
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Step 3**: Add Environment Variables
```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = your-anon-key-here
```

Select environments: Production, Preview, Development

**Step 4**: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Visit your site at `https://your-project.vercel.app`

#### Method 2: CLI Deployment

**Step 1**: Install Vercel CLI
```bash
npm install -g vercel@latest
```

**Step 2**: Login
```bash
vercel login
```

**Step 3**: Link Project
```bash
vercel link
```

**Step 4**: Add Environment Variables
```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
```

**Step 5**: Deploy
```bash
# Deploy to production
vercel --prod

# Or just preview
vercel
```

#### Method 3: GitHub Actions (Automated)

**Step 1**: Get Vercel Credentials
```bash
# Get organization ID
vercel whoami

# Get project ID (after first deployment)
cat .vercel/project.json
```

**Step 2**: Add GitHub Secrets

Go to: `https://github.com/bitgogle/ganhos-bybit/settings/secrets/actions`

Add these secrets:
```
VERCEL_TOKEN = your-vercel-token
VERCEL_ORG_ID = your-org-id
VERCEL_PROJECT_ID = your-project-id
```

**Step 3**: Workflow Already Configured

The repo includes:
- `.github/workflows/vercel-production.yml` - Deploys on push to main
- `.github/workflows/vercel-preview.yml` - Deploys on PRs

**Step 4**: Push to Deploy
```bash
git add .
git commit -m "Deploy to production"
git push origin main

# Automatically builds and deploys!
```

### 9.3 Post-Deployment Configuration

#### Verify Deployment:
```bash
# Check site is live
curl -I https://your-site.vercel.app

# Should return 200 OK
```

#### Test Functionality:
1. Visit landing page
2. Register new test user
3. Login as admin
4. Approve test user
5. Test deposit flow
6. Test withdrawal flow
7. Check mobile responsiveness

#### Custom Domain (Optional):

**Step 1**: Add Domain in Vercel
1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `ganhos-bybit.com`)

**Step 2**: Configure DNS

Add these records at your domain registrar:

**For root domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Step 3**: Verify and Wait
- DNS propagation takes 24-48 hours
- Vercel automatically provisions SSL

### 9.4 Environment-Specific Builds

#### Development Build:
```bash
npm run build:dev
```
- Includes source maps
- Not minified
- Faster build time

#### Production Build:
```bash
npm run build
```
- Minified code
- Optimized assets
- Tree-shaking applied
- Smaller bundle size

### 9.5 Monitoring & Maintenance

#### Enable Vercel Analytics:
1. Go to Project Settings → Analytics
2. Click "Enable Analytics"
3. View metrics at `/analytics`

**Metrics tracked:**
- Page views
- Unique visitors
- Performance (Web Vitals)
- Geographic distribution

#### Error Tracking:

Add Sentry (optional):
```bash
npm install @sentry/react

# Configure in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

#### Performance Monitoring:

```bash
# Add Vercel Speed Insights
npm install @vercel/speed-insights

# Add to App.tsx
import { SpeedInsights } from "@vercel/speed-insights/react"

<SpeedInsights />
```

### 9.6 Rollback Strategy

#### If Deployment Fails:

**Option 1**: Rollback in Vercel Dashboard
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**Option 2**: Redeploy Previous Git Commit
```bash
git log --oneline  # Find good commit
git checkout abc123  # Good commit hash
vercel --prod  # Deploy
git checkout main  # Return to main
```

**Option 3**: Revert Git Commit
```bash
git revert HEAD
git push origin main
# Auto-deploys via GitHub Actions
```

### 9.7 Backup & Recovery

#### Database Backups:

Supabase provides automatic backups:
- **Free Plan**: Daily backups, 7-day retention
- **Pro Plan**: Daily backups, 30-day retention

Manual backup:
```bash
# Export using Supabase Dashboard
# Database → Backups → "Export Database"

# Or via CLI
supabase db dump > backup.sql
```

#### Code Backups:

Always in Git:
```bash
# Clone to another location
git clone https://github.com/bitgogle/ganhos-bybit.git backup

# Or create archive
git archive --format=zip --output=backup.zip main
```

### 9.8 Continuous Deployment Workflow

```
Developer pushes to GitHub
         ↓
GitHub Actions triggered
         ↓
Build starts on Vercel
         ↓
Environment variables loaded
         ↓
Dependencies installed (2min)
         ↓
Vite build runs (30sec)
         ↓
Assets uploaded to CDN
         ↓
DNS updated
         ↓
Deployment live! 🎉
         ↓
Preview URL generated
         ↓
Production domain updated (if main branch)
```

Average deployment time: 3-4 minutes

---

## 10. SECURITY & BEST PRACTICES

### 10.1 Authentication Security

#### Password Requirements:
- Minimum 8 characters
- Mix of letters and numbers
- Validated by Zod schema

#### Session Management:
```typescript
// Session persists in localStorage
// Auto-refreshes tokens
// Expires after inactivity

export const supabase = createClient(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

#### Protected Routes:
```typescript
// Check authentication before rendering
useEffect(() => {
  if (!profile) {
    navigate('/login');
  }
}, [profile, navigate]);
```

### 10.2 Data Security

#### Row Level Security (RLS):
- Users can only see their own data
- Admins have elevated permissions
- Enforced at database level

#### Input Validation:
```typescript
// All forms use Zod validation
const depositSchema = z.object({
  amount: z.number()
    .min(50, 'Minimum R$ 50')
    .max(10000000, 'Maximum exceeded'),
});

// Validation before database insert
const result = depositSchema.safeParse(formData);
if (!result.success) {
  // Show errors
  return;
}
```

#### SQL Injection Prevention:
- Supabase automatically parameterizes queries
- Never use string concatenation for queries
- Always use prepared statements

### 10.3 API Security

#### Environment Variables:
```bash
# NEVER commit these
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...

# Add to .gitignore
.env
.env.local
.env.production
```

#### Rate Limiting:
- Supabase enforces rate limits
- Free tier: 50,000 monthly active users
- 2GB database size
- 1GB file storage

#### CORS Configuration:
```typescript
// Vercel headers in vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### 10.4 File Upload Security

#### Storage Rules:
```typescript
// Only specific file types allowed
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

// Max file size: 5MB
const maxSize = 5 * 1024 * 1024;

// Upload to user-specific folder
const path = `${userId}/${fileName}`;
```

#### Storage RLS:
```sql
-- Users can only access their own files
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 10.5 Best Practices

#### Code Quality:
- Use TypeScript for type safety
- Follow ESLint rules
- Write descriptive commit messages
- Use meaningful variable names
- Add comments for complex logic

#### Error Handling:
```typescript
try {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction);
  
  if (error) throw error;
  
  toast.success('Transaction created!');
} catch (error) {
  console.error('Error:', error);
  toast.error(getErrorMessage(error));
}
```

#### Performance:
- Use React Query for caching
- Implement code splitting
- Optimize images
- Lazy load components
- Minimize bundle size

#### Accessibility:
- Use semantic HTML
- Add ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance

#### SEO:
```html
<!-- In index.html -->
<meta name="description" content="Platform description" />
<meta property="og:title" content="Ganhos Bybit" />
<meta property="og:description" content="..." />
<meta property="og:image" content="/og-image.jpg" />
```


---

## 11. TESTING & VALIDATION

### 11.1 Manual Testing Procedures

#### User Registration Flow:
1. Navigate to `/register`
2. Fill in all fields:
   - Nome completo: "Test User"
   - Email: "test@example.com"
   - Telefone: "(11) 99999-9999"
   - CPF: "123.456.789-00"
   - Senha: "Test@123"
3. Submit form
4. Verify success toast
5. Check database for new profile
6. Verify status is 'active'

#### Login Flow:
1. Navigate to `/login`
2. Enter credentials
3. Submit form
4. Verify redirect to dashboard
5. Check session persists on refresh

#### Deposit Flow:
1. Login as user
2. Click "Fazer Depósito"
3. Select method (PIX/Bybit/USDT)
4. Enter amount (R$ 100)
5. Upload proof image
6. Submit request
7. Verify transaction created with 'pending' status
8. Login as admin
9. Approve deposit
10. Verify user balance updated

#### Withdrawal Flow:
1. Login as user with balance
2. Click "Solicitar Saque"
3. Select method
4. Enter amount
5. Submit request
6. Verify transaction created
7. Login as admin
8. Approve withdrawal
9. Verify balance deducted

### 11.2 Database Validation

#### Check Table Integrity:
```sql
-- Verify all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected: 6 tables
-- - fee_requests
-- - notifications
-- - profiles
-- - system_settings
-- - transactions
-- - user_roles

-- Check RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- All should show 't' (true)

-- Verify triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- Expected:
-- - on_auth_user_created (auth.users)
-- - update_profiles_updated_at (profiles)
-- - update_transactions_updated_at (transactions)

-- Check functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Expected:
-- - handle_new_user
-- - has_role
-- - update_updated_at_column
```

#### Data Consistency Checks:
```sql
-- No orphaned transactions
SELECT COUNT(*) FROM transactions t
LEFT JOIN profiles p ON t.user_id = p.id
WHERE p.id IS NULL;
-- Should be 0

-- Balance integrity
SELECT 
  id, 
  name,
  available_balance,
  invested_balance,
  profit_balance,
  (available_balance + invested_balance + profit_balance) as total
FROM profiles;

-- Check for negative balances
SELECT * FROM profiles 
WHERE available_balance < 0 
   OR invested_balance < 0 
   OR profit_balance < 0;
-- Should be empty
```

### 11.3 Performance Testing

#### Load Time Benchmarks:
- Landing page: < 2 seconds
- Dashboard: < 3 seconds
- Admin panel: < 3 seconds
- Page transitions: < 500ms

#### Bundle Size:
- JavaScript: ~736KB (~210KB gzipped)
- CSS: ~71KB (~12KB gzipped)
- Total page weight: ~1MB

#### Lighthouse Scores (Target):
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## 12. TROUBLESHOOTING

### 12.1 Common Build Issues

#### Issue: "Module not found"
```bash
Error: Cannot find module '@/components/ui/button'

Solution:
1. Check vite.config.ts has alias configured
2. Verify file exists at correct path
3. Clear node_modules and reinstall:
   rm -rf node_modules package-lock.json
   npm install
```

#### Issue: "Environment variable undefined"
```bash
Error: VITE_SUPABASE_URL is undefined

Solution:
1. Check .env file exists in project root
2. Verify variables have VITE_ prefix
3. Restart dev server after changing .env
4. Check .env is not in .gitignore (only .env.local should be)
```

#### Issue: Build succeeds but blank page
```bash
Solution:
1. Check browser console for errors
2. Verify index.html has correct script path
3. Check Supabase credentials are valid
4. Ensure no console.error blocking render
```

### 12.2 Database Issues

#### Issue: "RLS policy violation"
```bash
Error: new row violates row-level security policy

Solution:
1. Check user is authenticated
2. Verify RLS policies exist:
   SELECT * FROM pg_policies WHERE tablename = 'your_table';
3. Check admin role for admin operations:
   SELECT * FROM user_roles WHERE user_id = 'your-id';
4. Temporarily disable RLS for testing:
   ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

#### Issue: "Trigger not firing"
```bash
Profile not created after user signup

Solution:
1. Check trigger exists:
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
2. Verify function exists:
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
3. Check trigger is enabled:
   ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
4. Test function manually:
   SELECT handle_new_user();
```

#### Issue: "Connection refused"
```bash
Error: Failed to connect to Supabase

Solution:
1. Check Supabase project is active
2. Verify URL and keys are correct
3. Check network/firewall settings
4. Try direct curl test:
   curl https://your-project.supabase.co
```

### 12.3 Deployment Issues

#### Issue: Vercel build fails
```bash
Error: Build failed with exit code 1

Solution:
1. Check build logs in Vercel dashboard
2. Verify all dependencies in package.json
3. Test build locally: npm run build
4. Check environment variables are set
5. Ensure Node version matches (18+)
```

#### Issue: 404 on page refresh
```bash
Error: 404 Not Found on /dashboard

Solution:
1. Add to vercel.json:
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/" }
     ]
   }
2. Redeploy
```

#### Issue: Environment variables not working in production
```bash
Error: undefined VITE_SUPABASE_URL in production

Solution:
1. Go to Vercel Project Settings → Environment Variables
2. Ensure variables are set for "Production"
3. Redeploy after adding variables
4. Check variable names match exactly (case-sensitive)
```

### 12.4 Authentication Issues

#### Issue: "User not found"
```bash
Error: User not found after registration

Solution:
1. Check Supabase Auth is enabled
2. Verify email confirmation setting:
   - If enabled, user must confirm email
   - If disabled, user can login immediately
3. Check auth.users table:
   SELECT * FROM auth.users WHERE email = 'user@example.com';
4. Verify profile was created:
   SELECT * FROM profiles WHERE email = 'user@example.com';
```

#### Issue: Session expires immediately
```bash
Solution:
1. Check localStorage is enabled in browser
2. Verify Supabase client config:
   {
     auth: {
       storage: localStorage,
       persistSession: true,
       autoRefreshToken: true,
     }
   }
3. Check for localStorage clearing code
4. Verify JWT expiry settings in Supabase
```

### 12.5 UI/UX Issues

#### Issue: Styles not loading
```bash
Solution:
1. Check Tailwind is configured
2. Verify index.css imports Tailwind:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
3. Rebuild: npm run build
4. Clear browser cache
```

#### Issue: Icons not showing
```bash
Solution:
1. Verify lucide-react is installed:
   npm list lucide-react
2. Check import statements:
   import { IconName } from 'lucide-react';
3. Reinstall if needed:
   npm install lucide-react
```

### 12.6 Getting Help

#### Resources:
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **React Docs**: https://react.dev
- **Vercel Docs**: https://vercel.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

#### Support Channels:
- Supabase Discord: https://discord.supabase.com
- Vercel Support: https://vercel.com/support
- GitHub Issues: Create issue in repository

---

## 13. APPENDIX - COMPLETE CODE EXAMPLES

### 13.1 Complete Registration Page

```typescript
// src/pages/Register.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').trim(),
  email: z.string().email('Email inválido').trim(),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      // Clean phone and CPF (remove formatting)
      const cleanPhone = data.phone.replace(/\D/g, '');
      const cleanCPF = data.cpf.replace(/\D/g, '');

      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: cleanPhone,
            cpf: cleanCPF,
          },
        },
      });

      if (authError) throw authError;

      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bybit-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-bybit-gold">Ganhos Bybit</h1>
          <p className="text-gray-400 mt-2">Criar nova conta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Seu nome completo"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="(11) 99999-9999"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              {...register('cpf')}
              placeholder="123.456.789-00"
            />
            {errors.cpf && (
              <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-bybit-gold hover:bg-bybit-gold-hover"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-bybit-gold hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### 13.2 Investment Plans Configuration

```typescript
// src/lib/data.ts - Investment Plans
export const generateInvestmentPlans = () => {
  const plans = [];
  
  // Generate plans from R$ 200 to R$ 5,000 in R$ 100 increments
  for (let amount = 200; amount <= 5000; amount += 100) {
    // R$ 20 profit per R$ 100 every 3 hours
    const profitPer100 = 20;
    const profitRate = profitPer100 / 100; // 0.20 (20%)
    const totalProfit = (amount / 100) * profitPer100;
    
    plans.push({
      id: `plan-${amount}`,
      name: `Plano R$ ${amount}`,
      amount: amount,
      profitEvery3Hours: totalProfit,
      profitRate: profitRate,
      minDuration: 1,
      maxDuration: 7,
      description: `Investimento de R$ ${amount} - Rende R$ ${totalProfit} a cada 3 horas`,
      recommended: amount === 500, // Highlight R$ 500 plan
    });
  }
  
  return plans;
};

export const investmentPlans = generateInvestmentPlans();
```

---

## 14. CONCLUSION

### 14.1 What You've Built

You now have a complete, production-ready cryptocurrency investment platform with:

✅ **Frontend**: Modern React + TypeScript application
✅ **Backend**: Supabase with PostgreSQL database
✅ **Authentication**: Secure user registration and login
✅ **User Dashboard**: Investment tracking, deposits, withdrawals
✅ **Admin Panel**: Complete management interface
✅ **Deployment**: Automated CI/CD with Vercel
✅ **Security**: RLS policies, input validation, secure storage
✅ **Responsive Design**: Works on all devices
✅ **Internationalization**: Portuguese for users, English for admins

### 14.2 Next Steps

**Enhancements to Consider:**
1. Email notifications for transactions
2. Two-factor authentication (2FA)
3. Advanced analytics dashboard
4. Mobile app version
5. Multi-currency support
6. Automated investment returns
7. Referral program
8. KYC verification
9. Document verification system
10. API for third-party integrations

**Scaling Considerations:**
- Database optimization for large datasets
- Caching layer (Redis)
- CDN for static assets
- Load balancing
- Database replication
- Monitoring and alerting
- Backup and disaster recovery

### 14.3 Maintenance

**Regular Tasks:**
- Monitor error logs
- Review security updates
- Update dependencies monthly
- Backup database weekly
- Review user feedback
- Optimize performance
- Check for vulnerabilities

**Security Updates:**
```bash
# Check for vulnerabilities
npm audit

# Update packages
npm update

# Update major versions
npm outdated
npm install package@latest
```

### 14.4 Support & Community

**Getting Help:**
- Documentation: Refer to this guide
- GitHub: Open issues for bugs
- Supabase: Community support
- Vercel: Deployment help

**Contributing:**
- Follow code style guidelines
- Write tests for new features
- Update documentation
- Submit pull requests

---

## 15. QUICK REFERENCE

### Essential Commands:
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
vercel --prod        # Deploy to production
```

### Important URLs:
- Local Dev: http://localhost:8080
- Supabase: https://app.supabase.com
- Vercel: https://vercel.com/dashboard
- GitHub: https://github.com/bitgogle/ganhos-bybit

### Key Files:
- `.env` - Environment variables
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `src/App.tsx` - Main app component
- `src/context/AppContext.tsx` - Global state
- `supabase/migrations/` - Database schema

### Default Credentials:
- Admin Email: Set during first admin user creation
- Admin Password: Set during first admin user creation

---

**END OF COMPLETE APP GUIDE**

This guide contains EVERYTHING needed to build, deploy, and maintain the Ganhos Bybit application from scratch to production. Keep it updated as the application evolves.

**Last Updated**: December 6, 2024
**Version**: 1.0.0
**Author**: Ganhos Bybit Development Team

