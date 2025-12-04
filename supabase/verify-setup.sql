-- Supabase Setup Verification Script
-- Run this in the Supabase SQL Editor to verify your setup is complete

-- 1. Check all required tables exist
SELECT 
  'Tables Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 6 THEN '✓ PASS'
    ELSE '✗ FAIL - Expected at least 6 tables'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';

-- 2. List all tables
SELECT 
  '  - ' || table_name as "Public Tables"
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 3. Check RLS is enabled on all tables
SELECT 
  'RLS Check' as check_type,
  COUNT(*) as tables_with_rls,
  CASE 
    WHEN COUNT(*) >= 6 THEN '✓ PASS'
    ELSE '✗ FAIL - Not all tables have RLS enabled'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true;

-- 4. Check required functions exist
SELECT 
  'Functions Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✓ PASS'
    ELSE '✗ FAIL - Missing functions'
  END as status
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'has_role', 'update_updated_at_column');

-- 5. List all functions
SELECT 
  '  - ' || routine_name as "Functions"
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 6. Check auth trigger exists
SELECT 
  'Auth Trigger Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ PASS'
    ELSE '✗ FAIL - Auth trigger not set up'
  END as status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 7. Check storage bucket exists
SELECT 
  'Storage Bucket Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ PASS'
    ELSE '✗ FAIL - Proofs bucket not created'
  END as status
FROM storage.buckets 
WHERE id = 'proofs';

-- 8. Check system_settings initialized
SELECT 
  'System Settings Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ PASS'
    ELSE '✗ FAIL - System settings not initialized'
  END as status
FROM public.system_settings;

-- 9. Check admin users exist
SELECT 
  'Admin Users Check' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ PASS - ' || COUNT(*) || ' admin(s) configured'
    ELSE '⚠ WARNING - No admin users set up yet'
  END as status
FROM public.user_roles
WHERE role = 'admin';

-- 10. Summary of RLS policies
SELECT 
  'RLS Policies Summary' as info,
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Final message
SELECT 
  '=== VERIFICATION COMPLETE ===' as message,
  'Review results above. All checks should show ✓ PASS except Admin Users which can show WARNING initially.' as note;
