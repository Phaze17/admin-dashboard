/*
  Quick User Setup Script

  INSTRUCTIONS:
  1. First, create users in Supabase Dashboard:
     - Go to Authentication → Users → Add User
     - Create: DjUNOHOO@phaze17.com with password A3c3ntral!
     - Create: SoulaFlux@phaze17.com (invite)
     - Create: Element@phaze17.com (invite)

  2. Run this query to get their IDs:
*/

SELECT id, email, email_confirmed_at
FROM auth.users
WHERE email IN (
  'DjUNOHOO@phaze17.com',
  'SoulaFlux@phaze17.com',
  'Element@phaze17.com'
)
ORDER BY email;

/*
  3. Copy the UUIDs from above and replace in the INSERT below
  4. Run the INSERT statement
*/

-- Replace the UUIDs below with actual values from the query above
INSERT INTO public.users (id, email, full_name, role, mfa_enabled, preferences)
VALUES
  (
    '00000000-0000-0000-0000-000000000001', -- REPLACE with DjUNOHOO UUID
    'DjUNOHOO@phaze17.com',
    'DJ UNO HOO',
    'admin',
    false,
    '{
      "theme": "dark",
      "notifications": {
        "email": true,
        "push": true
      },
      "force_password_change": true
    }'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000002', -- REPLACE with SoulaFlux UUID
    'SoulaFlux@phaze17.com',
    'SoulaFlux',
    'campaign_manager',
    false,
    '{
      "theme": "dark",
      "notifications": {
        "email": true,
        "push": true
      }
    }'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000003', -- REPLACE with Element UUID
    'Element@phaze17.com',
    'Element',
    'campaign_manager',
    false,
    '{
      "theme": "dark",
      "notifications": {
        "email": true,
        "push": true
      }
    }'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  preferences = EXCLUDED.preferences;

-- Verify the users were created
SELECT
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.preferences->>'force_password_change' as needs_password_change,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;
