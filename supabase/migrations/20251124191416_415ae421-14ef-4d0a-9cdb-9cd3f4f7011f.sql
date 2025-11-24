-- Create storage bucket for payment proofs if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('proofs', 'proofs', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for proofs bucket
CREATE POLICY "Users can upload their own proofs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own proofs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'proofs' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

CREATE POLICY "Admins can view all proofs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'proofs' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);