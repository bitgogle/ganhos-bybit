-- Complete Supabase Initialization Script
-- Run this script in your Supabase SQL Editor to set up everything needed for the app
-- This script is idempotent - safe to run multiple times

-- ============================================
-- STEP 1: Initialize System Settings
-- ============================================
-- Create the default system settings record if it doesn't exist
INSERT INTO public.system_settings (
  id,
  withdrawal_fee_enabled,
  withdrawal_fee_amount,
  withdrawal_fee_mode
)
VALUES (
  1,
  false,
  0,
  'deduct'
)
ON CONFLICT (id) DO NOTHING;

SELECT 'Step 1: System settings initialized ✓' as status;

-- ============================================
-- STEP 2: Verify Auth Trigger
-- ============================================
-- Check if the auth trigger exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE NOTICE 'WARNING: Auth trigger not found. Run migration 20251204050000_add_auth_trigger.sql';
  ELSE
    RAISE NOTICE 'Step 2: Auth trigger verified ✓';
  END IF;
END $$;

-- ============================================
-- STEP 3: Verify Storage Bucket
-- ============================================
-- Check if proofs bucket exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'proofs'
  ) THEN
    RAISE NOTICE 'WARNING: Proofs bucket not found. Run migration 20251125012339_5de73f12-b796-4b23-95de-3c441da32b04.sql';
  ELSE
    RAISE NOTICE 'Step 3: Storage bucket verified ✓';
  END IF;
END $$;

-- ============================================
-- STEP 4: Create Sample Data (Optional - for testing)
-- ============================================
-- Uncomment below to create sample notifications for testing

/*
-- Sample notification for admins (will need to replace user_id with actual admin ID)
INSERT INTO public.notifications (user_id, title, message, type)
SELECT 
  id,
  'Welcome to Ganhos Bybit Admin',
  'Your admin account is now active. You can manage users, transactions, and system settings.',
  'success'
FROM public.profiles 
WHERE role = 'admin'
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- STEP 5: Verification Summary
-- ============================================

SELECT '============================================' as "";
SELECT 'SUPABASE INITIALIZATION SUMMARY' as "";
SELECT '============================================' as "";

-- Count tables
SELECT 
  'Tables: ' || COUNT(*) || ' (expected: 6+)' as "Database Check"
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Count functions
SELECT 
  'Functions: ' || COUNT(*) || ' (expected: 3+)' as "Database Check"
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Check RLS
SELECT 
  'RLS Enabled: ' || COUNT(*) || ' tables (expected: 6+)' as "Database Check"
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- Count indexes
SELECT 
  'Indexes: ' || COUNT(*) || ' (should be 15+)' as "Database Check"
FROM pg_indexes 
WHERE schemaname = 'public';

-- Check storage
SELECT 
  'Storage Buckets: ' || COUNT(*) || ' (expected: 1+)' as "Database Check"
FROM storage.buckets 
WHERE id = 'proofs';

-- Check system settings
SELECT 
  'System Settings: ' || COUNT(*) || ' (expected: 1)' as "Database Check"
FROM public.system_settings;

-- Check admin count
SELECT 
  'Admin Users: ' || COUNT(*) as "Database Check"
FROM public.user_roles 
WHERE role = 'admin';

-- Check total users
SELECT 
  'Total Users: ' || COUNT(*) as "Database Check"
FROM public.profiles;

-- List all tables
SELECT '============================================' as "";
SELECT 'TABLES IN DATABASE:' as "";
SELECT '  - ' || table_name as "Tables"
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- List all functions
SELECT '============================================' as "";
SELECT 'FUNCTIONS IN DATABASE:' as "";
SELECT '  - ' || routine_name as "Functions"
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- RLS Policy count by table
SELECT '============================================' as "";
SELECT 'RLS POLICIES BY TABLE:' as "";
SELECT 
  tablename || ': ' || COUNT(*) || ' policies' as "RLS Status"
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

SELECT '============================================' as "";
SELECT 'INITIALIZATION COMPLETE!' as "";
SELECT 'Next steps:' as "";
SELECT '1. Create your first admin user (see ADMIN_SETUP.md)' as "";
SELECT '2. Configure system settings in the admin panel' as "";
SELECT '3. Test user registration and login' as "";
SELECT '============================================' as "";
