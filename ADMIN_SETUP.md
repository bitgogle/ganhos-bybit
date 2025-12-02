# Admin User Setup Instructions

## Step 1: Register the Admin User

1. Go to the registration page: `/register`
2. Register with these credentials:
   - Email: `skidolynx@gmail.com`
   - Password: `@Skido999`
   - Fill in the other required fields (Name, Phone, CPF, etc.)

## Step 2: Set the User as Admin

After successfully registering, you need to set this user as an admin in the database.

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. First, find the user ID by running:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'skidolynx@gmail.com';
   ```

4. Copy the `id` value from the result

5. Insert the admin role using the user ID:
   ```sql
   INSERT INTO user_roles (user_id, role) 
   VALUES ('PASTE_USER_ID_HERE', 'admin');
   ```

## Step 3: Login as Admin

1. Go to `/login`
2. Login with:
   - Email: `skidolynx@gmail.com`
   - Password: `@Skido999`

3. After successful login, you'll be redirected to `/admin` (the admin dashboard)

## Features Available in Admin Panel

- **User Management**: Approve/reject new users, view user details, restrict/unrestrict user accounts
- **Transaction Management**: Approve/reject deposits and withdrawals
- **Withdrawal Fee Settings**: Configure withdrawal fees (enable/disable, set amount, choose deduction mode)
- **System Settings**: Configure PIX key, Bybit UID, and USDT address for deposits

## Notes

- The admin role is stored in a separate `user_roles` table for security
- Regular users cannot see or access the admin panel
- Only users with the 'admin' role in the `user_roles` table can access admin features
