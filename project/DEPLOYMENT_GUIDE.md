# Admin Dashboard - Deployment Guide

## 🚀 Quick Setup for Bolt/Claude

### Overview
This is a React admin dashboard with role-based authentication, built for Phaze17 team access. It supports both local development (with mock data) and cloud deployment (with Supabase).

### ✅ What's Already Done
- ✅ Complete React app with authentication
- ✅ Role-based dashboard access (Admin/Marketing)
- ✅ Mock database for local development
- ✅ Error handling and timeout protection
- ✅ Database health checks
- ✅ Protected routes with proper redirects

### 🔧 What Needs Setup in Cloud

#### 1. Supabase Database Setup
Run this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'operator',
  mfa_enabled boolean DEFAULT false,
  preferences jsonb DEFAULT '{"theme": "dark", "notifications": {"email": true, "push": true}}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft',
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  budget numeric(12, 2),
  spent numeric(12, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for campaigns table  
CREATE POLICY "Users can read all campaigns" ON campaigns
  FOR SELECT USING (true);

CREATE POLICY "Users can create campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = owner_id);
```

#### 2. Create User Accounts
In Supabase Dashboard → Authentication → Users, create these accounts:

| Email | Full Name | Role | Password |
|-------|-----------|------|----------|
| djunohoo@phaze17.com | DJ UNO HOO | admin | (set secure password) |
| soulaflux@phaze17.com | SoulaFlux | campaign_manager | (set secure password) |
| element@phaze17.com | Element | analyst | (set secure password) |

#### 3. Add User Profiles
After creating auth users, run this SQL (replace UUIDs with actual auth user IDs):

```sql
-- Get the user IDs first
SELECT id, email FROM auth.users WHERE email IN (
  'djunohoo@phaze17.com',
  'soulaflux@phaze17.com', 
  'element@phaze17.com'
);

-- Then insert profiles (replace UUIDs with actual IDs from above)
INSERT INTO public.users (id, email, full_name, role, mfa_enabled, preferences)
VALUES
  ('REPLACE-WITH-DJUNOHOO-UUID', 'djunohoo@phaze17.com', 'DJ UNO HOO', 'admin', false, '{"theme": "dark", "notifications": {"email": true, "push": true}}'),
  ('REPLACE-WITH-SOULAFLUX-UUID', 'soulaflux@phaze17.com', 'SoulaFlux', 'campaign_manager', false, '{"theme": "dark", "notifications": {"email": true, "push": true}}'),
  ('REPLACE-WITH-ELEMENT-UUID', 'element@phaze17.com', 'Element', 'analyst', false, '{"theme": "dark", "notifications": {"email": true, "push": true}}');
```

#### 4. Environment Variables
Set these in your deployment environment:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 🎯 App Routes & Access
- `/` - Landing page (public)
- `/admin/login` → `/admin/dashboard` (requires admin role)
- `/marketing/login` → `/marketing/dashboard` (requires campaign_manager, analyst, or operator roles)

### 🔍 Testing Checklist
1. ✅ Landing page loads
2. ✅ Database health check shows green
3. ✅ Admin login works for djunohoo@phaze17.com
4. ✅ Marketing login works for soulaflux/element
5. ✅ Role-based access control works (admin can't access marketing dashboard without operator+ role)
6. ✅ Logout redirects properly
7. ✅ Protected routes redirect to login when not authenticated

### 🚨 Common Issues & Solutions

**Database Connection Failed:**
- Check environment variables are set correctly
- Verify Supabase project is active
- Ensure RLS policies allow access

**Login Hangs:**
- Check browser console for errors
- Verify user exists in both auth.users AND public.users tables
- Test with 15-second timeout (automatic)

**Access Denied:**
- Verify user role in public.users table matches route requirements
- Check protected route configuration

**Local Development:**
- Uses mock database automatically when env vars are placeholder values
- Test accounts: any email ending in @phaze17.com with 8+ char password

### 📞 Support
- All login flows have 15-second timeouts
- Database health checks run automatically
- Console logging for debugging auth issues
- Comprehensive error messages for troubleshooting

### 🎉 Ready for Production
The app automatically switches from mock to real database based on environment variables. No code changes needed between local dev and cloud deployment!