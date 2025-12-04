-- Add indexes for better query performance
-- These indexes optimize the most common queries in the application

-- Index on transactions for user queries (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_transactions_user_id 
ON public.transactions(user_id);

-- Index on transactions for status filtering (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_transactions_status 
ON public.transactions(status);

-- Composite index for transactions by user and status
CREATE INDEX IF NOT EXISTS idx_transactions_user_status 
ON public.transactions(user_id, status);

-- Index on transactions by type (deposits, withdrawals, etc.)
CREATE INDEX IF NOT EXISTS idx_transactions_type 
ON public.transactions(type);

-- Index on profiles for status queries (pending approvals)
CREATE INDEX IF NOT EXISTS idx_profiles_status 
ON public.profiles(status);

-- Index on profiles for role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role 
ON public.profiles(role);

-- Index on profiles for email lookup (login)
CREATE INDEX IF NOT EXISTS idx_profiles_email 
ON public.profiles(email);

-- Index on notifications for user queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
ON public.notifications(user_id);

-- Index on notifications for unread status
CREATE INDEX IF NOT EXISTS idx_notifications_read 
ON public.notifications(user_id, read);

-- Index on fee_requests for user queries
CREATE INDEX IF NOT EXISTS idx_fee_requests_user_id 
ON public.fee_requests(user_id);

-- Index on fee_requests for status
CREATE INDEX IF NOT EXISTS idx_fee_requests_status 
ON public.fee_requests(status);

-- Index on user_roles for role lookup
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id 
ON public.user_roles(user_id);

-- Index on user_roles for role type
CREATE INDEX IF NOT EXISTS idx_user_roles_role 
ON public.user_roles(role);

-- Index on created_at for all tables with timestamps (for ordering)
CREATE INDEX IF NOT EXISTS idx_transactions_created_at 
ON public.transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at 
ON public.notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_fee_requests_created_at 
ON public.fee_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_created_at 
ON public.profiles(created_at DESC);
