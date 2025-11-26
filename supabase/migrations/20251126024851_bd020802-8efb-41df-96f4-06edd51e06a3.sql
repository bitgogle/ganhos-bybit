-- Insert missing profile for existing user with correct status
INSERT INTO public.profiles (id, email, name, role, status)
VALUES (
  '3043ca61-3183-4c20-b0d4-38d535281ba2',
  'skidolynx@gmail.com',
  'User',
  'user',
  'active'
)
ON CONFLICT (id) DO NOTHING;