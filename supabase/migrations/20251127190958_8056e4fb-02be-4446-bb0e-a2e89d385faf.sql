-- Add name and bank fields to system_settings for PIX deposits
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS pix_name TEXT,
ADD COLUMN IF NOT EXISTS pix_bank TEXT;