# Supabase Setup Guide

This guide provides complete instructions for setting up Supabase for the Ganhos Bybit application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Authentication Setup](#authentication-setup)
- [Storage Setup](#storage-setup)
- [Security & RLS](#security--rls)
- [Initial Data Setup](#initial-data-setup)
- [Verification](#verification)

## Prerequisites

1. A Supabase account at [supabase.com](https://supabase.com)
2. A new Supabase project created
3. Access to Supabase Dashboard and SQL Editor

## Database Setup

### Quick Setup (Recommended)

The fastest way to set up your Supabase database:

1. Navigate to your Supabase project dashboard
2. Go to **SQL Editor**
3. Run the migrations in order (see below)
4. Run the initialization script: `supabase/initialize-supabase.sql`
5. Run the verification script: `supabase/verify-setup.sql`

### Step 1: Run Migrations

The application includes SQL migration files that set up all required tables, functions, and policies. Run them **in order**:

#### Migration 1: Core Database Schema (REQUIRED)

File: `supabase/migrations/20251124201834_remix_migration_from_pg_dump.sql`

This creates:
- **Tables**: `profiles`, `transactions`, `notifications`, `fee_requests`, `system_settings`, `user_roles`
- **Functions**: `handle_new_user()`, `has_role()`, `update_updated_at_column()`
- **Row Level Security (RLS)** policies for all tables
- Foreign key relationships and constraints
- Triggers for auto-updating timestamps

#### Migration 2: Security Improvements (REQUIRED)

File: `supabase/migrations/20251125012339_5de73f12-b796-4b23-95de-3c441da32b04.sql`

This adds:
- Secure system_settings access
- Storage bucket for proof uploads with RLS policies
- Transaction amount constraints (min, max, precision)
- File upload security policies

#### Migration 3: Additional Fields (REQUIRED)

File: `supabase/migrations/20251127190958_8056e4fb-02be-4446-bb0e-a2e89d385faf.sql`

This adds:
- PIX name and bank fields to system_settings table

#### Migration 4: Auth Trigger Setup (REQUIRED)

File: `supabase/migrations/20251204050000_add_auth_trigger.sql`

This adds:
- Trigger on `auth.users` to automatically create profile on user signup
- Ensures every new user gets a profile record automatically

#### Migration 5: Performance Optimizations (RECOMMENDED)

File: `supabase/migrations/20251204051000_add_indexes_and_optimizations.sql`

This adds:
- Database indexes for faster queries
- Optimizes common query patterns used in the app
- Improves dashboard and admin panel performance

### Step 2: Initialize Database

After running all migrations, run the initialization script:

File: `supabase/initialize-supabase.sql`

This script:
- Initializes system_settings with default values
- Verifies all components are set up correctly
- Provides a detailed setup summary
- Is safe to run multiple times (idempotent)

### Step 3: Verify Setup

Run the verification script to ensure everything is configured correctly:

File: `supabase/verify-setup.sql`

This checks:
- All 6 required tables exist
- RLS is enabled on all tables
- All functions are created
- Auth trigger is set up
- Storage bucket exists
- System settings are initialized

Expected tables:
- `fee_requests` - Withdrawal fee payment requests
- `notifications` - User notifications
- `profiles` - User profiles and balances
- `system_settings` - Global platform configuration
- `transactions` - All financial transactions
- `user_roles` - Admin role assignments

## Authentication Setup

### Step 1: Configure Auth Settings

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Enable **Email** provider
3. Configure email templates (optional but recommended)

### Step 2: Verify Auth Trigger

The `handle_new_user()` function and trigger should already be set up by Migration 4. This ensures that whenever a new user registers:
- A profile is automatically created in the `profiles` table
- Default status is set to `pending` (awaiting admin approval)
- Default role is set to `user`
- User data from signup form is populated (name, email, phone, CPF)

You can verify the trigger exists by running:

```sql
SELECT tgname, tgtype, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

If the trigger is missing, run Migration 4 (`20251204050000_add_auth_trigger.sql`).

### Step 3: Configure Auth Settings

In **Authentication** → **Settings**:

1. **Site URL**: Set to your application URL (e.g., `https://your-app.vercel.app`)
2. **Redirect URLs**: Add your application URLs
3. **Email Auth**: 
   - Enable "Confirm Email" if you want email verification
   - Or disable it for simpler flow (users can login immediately)

## Storage Setup

### Storage Bucket for Proof Uploads

The migration automatically creates a `proofs` bucket for transaction proof uploads.

Verify the bucket exists:

1. Go to **Storage** in Supabase Dashboard
2. You should see a `proofs` bucket
3. Bucket settings:
   - **Public**: No (private bucket)
   - **File size limit**: 5MB
   - **Allowed file types**: JPEG, PNG, JPG, PDF

The RLS policies ensure:
- Users can only upload files to their own folder (user ID based)
- Users can only view their own proofs
- Admins can view all proofs

## Security & RLS

### Row Level Security Policies

All tables have RLS enabled with these policies:

#### Profiles Table
- Users can view their own profile
- Users can update their own profile
- Admins can view all profiles
- Admins can update all profiles

#### Transactions Table
- Users can create their own transactions
- Users can view their own transactions
- Admins can view all transactions
- Admins can update transactions

#### Notifications Table
- Users can view their own notifications
- Users can update their own notifications (mark as read)
- Users can delete their own notifications
- Admins can insert notifications

#### Fee Requests Table
- Users can create their own fee requests
- Users can view their own fee requests
- Admins can view all fee requests
- Admins can update fee requests

#### System Settings Table
- All authenticated users can view system settings
- Only admins can update system settings

#### User Roles Table
- Users can view their own roles
- Only admins can insert/update/delete roles

## Initial Data Setup

### Step 1: Initialize System Settings

Run this SQL to create the initial system settings record:

```sql
INSERT INTO public.system_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
```

This creates a single system settings record that can be updated by admins.

### Step 2: Create First Admin User

Follow these steps to create your first admin user:

1. **Register via the app**: Go to `/register` and create an account
2. **Get the user ID**: In Supabase SQL Editor, run:
   ```sql
   SELECT id, email, raw_user_meta_data->>'name' as name 
   FROM auth.users 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
3. **Add admin role**: Use the user ID from step 2:
   ```sql
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ('YOUR_USER_ID_HERE', 'admin');
   ```
4. **Activate the profile**: 
   ```sql
   UPDATE public.profiles 
   SET status = 'active' 
   WHERE id = 'YOUR_USER_ID_HERE';
   ```

Now you can login at `/login` and access the admin panel at `/admin`.

## Environment Variables

Ensure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
```

Get these values from:
- Supabase Dashboard → **Settings** → **API**
- Use the **Project URL** and **anon/public** key

**Important**: Never use the service role key in client-side code!

## Verification

### Test Database Connection

Run this query to verify everything is set up:

```sql
-- Check tables exist
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Should return 6

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- All should show 't' (true) for rowsecurity

-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';
-- Should include: handle_new_user, has_role, update_updated_at_column

-- Check storage bucket exists
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'proofs';
-- Should return 1 row with public = false
```

### Test Application

1. **Registration**: Create a new user account
2. **Profile Creation**: Verify profile was created automatically in `profiles` table
3. **Admin Access**: Set up admin user and verify admin panel access
4. **File Upload**: Try uploading a proof document in a transaction
5. **RLS Policies**: Verify users can only see their own data

## Common Issues

### Issue: Users can't register

**Solution**: Check that:
- Email auth is enabled in Authentication settings
- The `handle_new_user()` trigger is set up correctly
- The profiles table has proper constraints

### Issue: File uploads fail

**Solution**: Check that:
- The `proofs` storage bucket exists
- RLS policies are set up for storage.objects
- File types and size limits are configured correctly

### Issue: Admin can't access admin panel

**Solution**: Verify:
- User has an entry in `user_roles` table with role='admin'
- User's profile status is 'active'
- The `has_role()` function exists and works correctly

### Issue: Environment variables not working

**Solution**: Ensure:
- Variables are prefixed with `VITE_` for client-side access
- `.env` file is in the project root
- Dev server was restarted after changing `.env`

## Database Schema Overview

### Complete Table Definitions

#### 1. profiles Table

**Purpose**: Stores user profile information, balances, and account status

**Columns**:
- `id` (uuid, PK) - Links to auth.users.id
- `name` (text) - User's full name
- `email` (text, unique) - User's email address
- `phone` (text) - Contact phone number
- `cpf` (text) - Brazilian tax ID (CPF)
- `pix_key` (text) - PIX key for withdrawals
- `bybit_uid` (text) - Bybit user ID
- `usdt_address` (text) - USDT wallet address
- `status` (text) - Account status: 'pending', 'active', 'rejected'
- `available_balance` (numeric) - Available funds for withdrawal
- `invested_balance` (numeric) - Amount currently invested
- `profit_balance` (numeric) - Total profits earned
- `role` (text) - User role: 'user' or 'admin'
- `restricted` (boolean) - Account restriction flag
- `created_at`, `updated_at` (timestamp)

**Indexes**:
- Primary key on `id`
- Unique index on `email`
- Index on `status` (for filtering pending approvals)
- Index on `role` (for admin queries)
- Index on `created_at` (for sorting)

#### 2. transactions Table

**Purpose**: Records all financial transactions (deposits, withdrawals, profits)

**Columns**:
- `id` (uuid, PK) - Transaction ID
- `user_id` (uuid, FK) - References profiles.id
- `type` (text) - 'deposit', 'withdrawal', 'investment', 'profit'
- `status` (text) - 'pending', 'approved', 'rejected', 'completed'
- `amount` (numeric) - Transaction amount
- `reference` (text) - Reference number or notes
- `proof_url` (text) - URL to payment proof document
- `processed_by` (uuid, FK) - Admin who processed (profiles.id)
- `created_at`, `updated_at` (timestamp)

**Constraints**:
- Amount must be positive
- Amount must be ≤ 10,000,000
- Amount must have 2 decimal places

**Indexes**:
- Primary key on `id`
- Index on `user_id` (most common query)
- Index on `status` (for admin filtering)
- Composite index on `user_id, status`
- Index on `type`
- Index on `created_at`

#### 3. notifications Table

**Purpose**: Stores user notifications for important events

**Columns**:
- `id` (uuid, PK) - Notification ID
- `user_id` (uuid, FK) - References profiles.id
- `title` (text) - Notification title
- `message` (text) - Notification content
- `type` (text) - 'info', 'success', 'warning', 'error'
- `read` (boolean) - Read status
- `created_at` (timestamp)

**Indexes**:
- Primary key on `id`
- Index on `user_id`
- Composite index on `user_id, read` (for unread notifications)
- Index on `created_at`

#### 4. fee_requests Table

**Purpose**: Manages withdrawal fee payment requests

**Columns**:
- `id` (uuid, PK) - Request ID
- `user_id` (uuid, FK) - References auth.users.id
- `related_withdrawal_id` (uuid, FK) - References transactions.id
- `amount` (numeric) - Fee amount
- `proof_url` (text) - Payment proof URL
- `status` (text) - 'pending', 'accepted', 'rejected', 'expired'
- `expires_at` (timestamp) - Expiration time (default: 3 hours)
- `created_at`, `updated_at` (timestamp)

**Indexes**:
- Primary key on `id`
- Index on `user_id`
- Index on `status`
- Index on `created_at`

#### 5. system_settings Table

**Purpose**: Global platform configuration (single row, id=1)

**Columns**:
- `id` (integer, PK) - Always 1 (enforced by constraint)
- `pix_key` (text) - Platform PIX key for deposits
- `pix_name` (text) - Account holder name
- `pix_bank` (text) - Bank name
- `bybit_uid` (text) - Platform Bybit UID
- `usdt_address` (text) - Platform USDT address
- `withdrawal_fee_enabled` (boolean) - Enable/disable fees
- `withdrawal_fee_amount` (numeric) - Fee amount
- `withdrawal_fee_mode` (text) - 'deduct' or 'deposit'
- `created_at`, `updated_at` (timestamp)

**Note**: Only one row exists (id=1), updated via admin panel

#### 6. user_roles Table

**Purpose**: Admin role assignments (separate from profiles for security)

**Columns**:
- `id` (uuid, PK) - Role assignment ID
- `user_id` (uuid, FK) - References auth.users.id
- `role` (app_role enum) - 'admin' or 'user'

**Constraints**:
- Unique constraint on (user_id, role)

**Indexes**:
- Primary key on `id`
- Index on `user_id`
- Index on `role`

### Storage Buckets

#### proofs Bucket

**Purpose**: Stores transaction proof documents (receipts, payment confirmations)

**Configuration**:
- **Public**: false (private bucket)
- **File size limit**: 5MB
- **Allowed MIME types**: image/jpeg, image/png, image/jpg, application/pdf
- **Folder structure**: `{user_id}/{filename}`

**RLS Policies**:
- Users can upload to their own folder
- Users can view their own proofs
- Admins can view all proofs

### Key Functions

- **handle_new_user()**: Auto-creates profile on user signup
- **has_role()**: Checks if user has specific role (used in RLS policies)
- **update_updated_at_column()**: Auto-updates updated_at timestamp

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

For application-specific issues, refer to:
- `README.md` - General setup
- `ADMIN_SETUP.md` - Admin user setup
- `DEPLOYMENT.md` - Deployment guide

---

Last updated: December 2024
