# Database Setup Guide - Phaze17 Dashboard

## Step 1: Run the Database Migration

Go to your Supabase dashboard at: https://0ec90b57d6e95fcbda19832f.supabase.co

1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Click **Run** to create all tables and security policies

## Step 2: Create Users in Supabase Auth

### Option A: Via Supabase Dashboard (Recommended for invites)

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Invite User** button
3. Enter the email addresses:
   - `SoulaFlux@phaze17.com`
   - `Element@phaze17.com`
4. They will receive an email to set their password

### Option B: Via SQL (For immediate access)

Run this in **SQL Editor**:

```sql
-- Note: You'll need to create auth users first via the Supabase Dashboard
-- Then run this to create their profiles

-- After creating auth users in the dashboard, get their IDs and insert profiles:
-- Replace 'USER_ID_HERE' with actual UUIDs from auth.users table

-- First, let's check if we need to insert profiles
-- Run this query to see existing auth users:
SELECT id, email FROM auth.users;

-- Then insert profiles for each user:
-- Example format:
INSERT INTO public.users (id, email, full_name, role, mfa_enabled)
VALUES
  ('USER_ID_FROM_AUTH', 'DjUNOHOO@phaze17.com', 'DJ UNO HOO', 'admin', false),
  ('USER_ID_FROM_AUTH', 'SoulaFlux@phaze17.com', 'SoulaFlux', 'campaign_manager', false),
  ('USER_ID_FROM_AUTH', 'Element@phaze17.com', 'Element', 'campaign_manager', false);
```

## Step 3: Create Your Admin Account (DjUNOHOO@phaze17.com)

### Method 1: Via Supabase Dashboard UI (Easiest)

1. Go to **Authentication** → **Users**
2. Click **Add User** (or **Invite User**)
3. Enter:
   - Email: `DjUNOHOO@phaze17.com`
   - Password: `A3c3ntral!`
   - Check "Auto Confirm User" (so you can login immediately)
4. Click **Create User**
5. Copy the User ID that was created
6. Go to **SQL Editor** and run:

```sql
-- Replace 'PASTE_USER_ID_HERE' with the UUID from step 5
INSERT INTO public.users (id, email, full_name, role, mfa_enabled, preferences)
VALUES (
  'PASTE_USER_ID_HERE',
  'DjUNOHOO@phaze17.com',
  'DJ UNO HOO',
  'admin',
  false,
  '{"theme": "dark", "notifications": {"email": true, "push": true}, "force_password_change": true}'::jsonb
);
```

### Method 2: Using Supabase API (via SQL Function)

Run this SQL to create a helper function, then use it:

```sql
-- This query will show you all auth users and their IDs
SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;
```

## Step 4: Force Password Change on First Login

To implement force password change, we need to add a flag. Run this SQL:

```sql
-- Add password change flag to your user
UPDATE public.users
SET preferences = jsonb_set(
  preferences,
  '{force_password_change}',
  'true'::jsonb
)
WHERE email = 'DjUNOHOO@phaze17.com';
```

## Step 5: Verify Setup

Run this query to verify all users are set up correctly:

```sql
SELECT
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.mfa_enabled,
  u.created_at,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;
```

## Quick Setup Script (All-in-One)

Here's a complete script you can modify and run after creating the auth users:

```sql
-- STEP 1: First, create users in Supabase Auth Dashboard
-- Go to Authentication → Users → Add User
-- Create these users:
-- 1. DjUNOHOO@phaze17.com (password: A3c3ntral!)
-- 2. SoulaFlux@phaze17.com (invite)
-- 3. Element@phaze17.com (invite)

-- STEP 2: After creating, get their IDs by running:
SELECT id, email FROM auth.users WHERE email IN (
  'DjUNOHOO@phaze17.com',
  'SoulaFlux@phaze17.com',
  'Element@phaze17.com'
);

-- STEP 3: Replace the UUIDs below with actual IDs from step 2, then run:
INSERT INTO public.users (id, email, full_name, role, mfa_enabled, preferences)
VALUES
  (
    'REPLACE_WITH_DJUNOHOO_UUID',
    'DjUNOHOO@phaze17.com',
    'DJ UNO HOO',
    'admin',
    false,
    '{"theme": "dark", "notifications": {"email": true, "push": true}, "force_password_change": true}'::jsonb
  ),
  (
    'REPLACE_WITH_SOULAFLUX_UUID',
    'SoulaFlux@phaze17.com',
    'SoulaFlux',
    'campaign_manager',
    false,
    '{"theme": "dark", "notifications": {"email": true, "push": true}}'::jsonb
  ),
  (
    'REPLACE_WITH_ELEMENT_UUID',
    'Element@phaze17.com',
    'Element',
    'campaign_manager',
    false,
    '{"theme": "dark", "notifications": {"email": true, "push": true}}'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;
```

## Troubleshooting

### Issue: Can't create users via SQL
**Solution**: Supabase requires users to be created through their Auth system first, then profiles added to public.users table.

### Issue: Email not confirmed
**Solution**: In Supabase Dashboard → Authentication → Users, click the user and click "Confirm Email"

### Issue: Can't login
**Solution**:
1. Verify user exists in auth.users
2. Verify profile exists in public.users with same ID
3. Check password is correct
4. Check RLS policies are enabled

### Issue: "Row level security policy violation"
**Solution**: Make sure the user's ID matches between auth.users and public.users tables

## Testing Your Setup

1. Go to http://localhost:3000
2. Click "Admin Dashboard" or "Marketing Dashboard"
3. Login with:
   - Email: DjUNOHOO@phaze17.com
   - Password: A3c3ntral!
4. You should see the dashboard for your role

## User Roles & Access

| Email | Role | Access Level | Dashboard |
|-------|------|--------------|-----------|
| DjUNOHOO@phaze17.com | admin | Full system access | Admin or Marketing |
| SoulaFlux@phaze17.com | campaign_manager | Campaign management | Marketing |
| Element@phaze17.com | campaign_manager | Campaign management | Marketing |

## Next Steps

After setup:
1. Login and verify access works
2. Change password (for DjUNOHOO account)
3. Other users will receive invite emails
4. Customize user roles and permissions as needed
5. Add more users via Authentication → Users in dashboard

## Security Notes

- Passwords are stored securely by Supabase Auth
- Row Level Security (RLS) is enabled on all tables
- Admin role has full access
- Campaign managers can create/edit campaigns
- All actions are logged in audit_logs table
- Force password change on first login (optional feature)
