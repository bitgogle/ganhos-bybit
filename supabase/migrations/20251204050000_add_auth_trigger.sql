-- Create trigger on auth.users to automatically create profile when user signs up
-- This ensures the handle_new_user() function is called for every new user registration

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
