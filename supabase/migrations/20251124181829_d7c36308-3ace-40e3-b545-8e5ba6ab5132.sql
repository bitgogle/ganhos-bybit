-- Add restricted field to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS restricted BOOLEAN DEFAULT false;

-- Add withdrawal fee settings to system_settings
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS withdrawal_fee_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS withdrawal_fee_amount NUMERIC DEFAULT 0;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS withdrawal_fee_mode TEXT DEFAULT 'deduct' CHECK (withdrawal_fee_mode IN ('deduct', 'deposit'));

-- Create fee_requests table
CREATE TABLE IF NOT EXISTS public.fee_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  related_withdrawal_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '3 hours')
);

-- Enable RLS on fee_requests
ALTER TABLE public.fee_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for fee_requests
CREATE POLICY "Users can view their own fee requests"
  ON public.fee_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fee requests"
  ON public.fee_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all fee requests"
  ON public.fee_requests FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update fee requests"
  ON public.fee_requests FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at for fee_requests
CREATE TRIGGER update_fee_requests_updated_at
  BEFORE UPDATE ON public.fee_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();