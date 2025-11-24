-- Fix RLS policies that check profiles.role directly (causes issues)
-- These should use the has_role() function instead

-- Fix notifications table policies
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;

CREATE POLICY "Admins can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix system_settings table policies
DROP POLICY IF EXISTS "Only admins can update system settings" ON public.system_settings;

CREATE POLICY "Only admins can update system settings"
ON public.system_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));