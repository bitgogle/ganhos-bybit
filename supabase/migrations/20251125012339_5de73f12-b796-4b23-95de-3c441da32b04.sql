-- Fix 1: Secure system_settings table - remove public access, keep admin access
DROP POLICY IF EXISTS "Anyone can view system settings" ON public.system_settings;

CREATE POLICY "Authenticated users can view system settings"
ON public.system_settings
FOR SELECT
TO authenticated
USING (true);

-- Fix 2: Create proofs storage bucket with proper RLS policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'proofs',
  'proofs',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for proofs bucket
CREATE POLICY "Users can upload their own proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'proofs' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can view all proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'proofs' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Fix 3: Add database constraints for transaction amounts
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'positive_amount') THEN
    ALTER TABLE public.transactions ADD CONSTRAINT positive_amount CHECK (amount > 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'max_amount') THEN
    ALTER TABLE public.transactions ADD CONSTRAINT max_amount CHECK (amount <= 10000000);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decimal_precision') THEN
    ALTER TABLE public.transactions ADD CONSTRAINT decimal_precision CHECK (amount = ROUND(amount, 2));
  END IF;
END $$;