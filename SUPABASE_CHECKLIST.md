# Supabase Setup Checklist

Use this checklist to ensure your Supabase instance is completely set up for the Ganhos Bybit application.

## ✅ Pre-Setup

- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] New Supabase project created
- [ ] Project URL and anon key copied to `.env` file
- [ ] Environment variables use `VITE_` prefix

## ✅ Database Migrations (Run in Order)

- [ ] **Migration 1**: Core schema (`20251124201834_remix_migration_from_pg_dump.sql`)
  - Creates 6 tables
  - Creates 3 functions
  - Sets up RLS policies
  
- [ ] **Migration 2**: Security (`20251125012339_5de73f12-b796-4b23-95de-3c441da32b04.sql`)
  - Creates storage bucket
  - Adds transaction constraints
  
- [ ] **Migration 3**: Additional fields (`20251127190958_8056e4fb-02be-4446-bb0e-a2e89d385faf.sql`)
  - Adds PIX name and bank fields
  
- [ ] **Migration 4**: Auth trigger (`20251204050000_add_auth_trigger.sql`)
  - Sets up automatic profile creation
  
- [ ] **Migration 5**: Indexes (`20251204051000_add_indexes_and_optimizations.sql`)
  - Adds 15+ performance indexes

## ✅ Initialization

- [ ] Run `initialize-supabase.sql` to set up system settings
- [ ] Run `verify-setup.sql` to check all components

## ✅ Tables Verification

- [ ] `profiles` - User accounts (status, balances, personal info)
- [ ] `transactions` - Financial transactions (deposits, withdrawals)
- [ ] `notifications` - User notifications
- [ ] `fee_requests` - Withdrawal fee payments
- [ ] `system_settings` - Platform configuration
- [ ] `user_roles` - Admin role assignments

## ✅ Functions Verification

- [ ] `handle_new_user()` - Auto-creates profile on signup
- [ ] `has_role()` - Checks user roles for RLS
- [ ] `update_updated_at_column()` - Auto-updates timestamps

## ✅ Storage

- [ ] `proofs` bucket created
- [ ] File size limit: 5MB
- [ ] Allowed types: JPEG, PNG, PDF
- [ ] RLS policies configured

## ✅ Authentication

- [ ] Email provider enabled
- [ ] Auth trigger active
- [ ] Site URL configured
- [ ] Email confirmation settings configured (optional)

## ✅ Security (RLS)

- [ ] All 6 tables have RLS enabled
- [ ] Users can only see their own data
- [ ] Admins can see all data
- [ ] Storage policies protect files

## ✅ Performance

- [ ] Indexes on user_id columns
- [ ] Indexes on status columns
- [ ] Indexes on created_at columns
- [ ] Composite indexes for common queries

## ✅ Initial Data

- [ ] System settings record created (id=1)
- [ ] First admin user created
- [ ] Admin role assigned in `user_roles` table
- [ ] Admin profile status set to 'active'

## ✅ Testing

- [ ] User registration works
- [ ] Profile auto-created on signup
- [ ] User can login
- [ ] Admin can access `/admin`
- [ ] File upload works
- [ ] Transactions can be created
- [ ] Notifications appear

## ✅ Documentation

- [ ] `SUPABASE_SETUP.md` reviewed
- [ ] `ADMIN_SETUP.md` followed for admin creation
- [ ] `.env` file has correct credentials

## Quick Verification SQL

Run this in Supabase SQL Editor:

```sql
-- Check everything at once
SELECT 'Tables' as component, COUNT(*)::text as count FROM information_schema.tables WHERE table_schema = 'public'
UNION ALL
SELECT 'Functions', COUNT(*)::text FROM information_schema.routines WHERE routine_schema = 'public'
UNION ALL
SELECT 'Indexes', COUNT(*)::text FROM pg_indexes WHERE schemaname = 'public'
UNION ALL
SELECT 'RLS Enabled', COUNT(*)::text FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true
UNION ALL
SELECT 'Storage Buckets', COUNT(*)::text FROM storage.buckets WHERE id = 'proofs'
UNION ALL
SELECT 'Admin Users', COUNT(*)::text FROM user_roles WHERE role = 'admin'
UNION ALL
SELECT 'Total Users', COUNT(*)::text FROM profiles;
```

**Expected Results:**
- Tables: 6+
- Functions: 3+
- Indexes: 15+
- RLS Enabled: 6+
- Storage Buckets: 1
- Admin Users: 1+ (after setup)
- Total Users: varies

## Need Help?

- Review `SUPABASE_SETUP.md` for detailed instructions
- Run `verify-setup.sql` for automated checks
- Check Supabase Dashboard logs for errors
- Verify `.env` file has correct `VITE_` prefixed variables

---

**Status**: When all items are checked, your Supabase setup is complete! ✅
