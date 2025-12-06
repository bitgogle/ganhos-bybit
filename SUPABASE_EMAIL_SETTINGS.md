# Supabase Email Confirmation Settings

## Overview
This application is configured to allow users immediate access to their dashboard after registration without requiring email confirmation.

## Required Supabase Configuration

To ensure users can access their accounts immediately after registration, you must disable email confirmation in your Supabase project settings:

### Steps to Configure:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings** → **Email Auth**
3. Find the **Email Confirmation** section
4. **Disable** the following option:
   - ❌ "Enable email confirmations"

### Alternative Configuration (if you prefer to keep email confirmation enabled):

If you want to keep email confirmation enabled but still allow immediate access:

1. Go to **Authentication** → **Settings** → **Email Auth**
2. Enable **"Enable email confirmations"** but also enable:
   - ✅ "Allow users to sign in with unconfirmed email addresses"

### Auto-confirm Emails Setting (Recommended for Development):

For development/testing environments, you can also configure Supabase to automatically confirm all email addresses:

1. Go to **Authentication** → **Settings** → **Email Auth**
2. Enable **"Confirm email automatically"** (this is typically used for development)

## Database Migration

The database has been configured to automatically set new user profiles to `'active'` status immediately upon registration via the `handle_new_user()` trigger function. This change is implemented in migration file:
- `supabase/migrations/20251206043000_update_handle_new_user_active_status.sql`

## Application Flow

With these settings, the registration flow works as follows:

1. User fills out the registration form
2. Upon submission, Supabase creates the auth user
3. The `handle_new_user()` trigger automatically creates a profile with `status='active'`
4. User remains logged in after registration (no sign-out)
5. User is immediately redirected to `/dashboard`
6. Dashboard checks if profile is loaded and active, then displays the user's account

## Security Considerations

While disabling email confirmation provides a better user experience by allowing immediate access, consider the following:

- **Email Verification**: Without confirmation, you cannot verify that users own the email addresses they provide
- **Spam/Fake Accounts**: It may be easier for malicious actors to create fake accounts
- **Password Recovery**: Ensure your password recovery flow is secure if email confirmation is disabled

### Recommended Security Measures:

1. Implement rate limiting on registration endpoints
2. Use CAPTCHA or similar anti-bot measures on the registration form
3. Monitor for suspicious account creation patterns
4. Consider implementing additional verification steps (phone, KYC) for high-value operations
5. Maintain the ability to restrict accounts via the `restricted` flag in the profiles table

## Testing

To test the registration flow:

1. Clear your browser's local storage (to ensure fresh state)
2. Go to `/register`
3. Fill out the registration form with valid data
4. Submit the form
5. You should immediately see a success toast and be redirected to `/dashboard`
6. The dashboard should load with the user's profile data showing `status='active'`

## Troubleshooting

If users are still being asked to confirm their email:

1. Check your Supabase Email Auth settings as described above
2. Verify the migration has been applied: `supabase/migrations/20251206043000_update_handle_new_user_active_status.sql`
3. Check Supabase logs for any authentication errors
4. Ensure environment variables are correctly set in `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
