# 🚀 v2.0 Implementation Plan - Database Setup & Environment Configuration

**Version:** v2.0 - v2.9  
**Status:** 📋 Planning Complete - Ready to Execute  
**Estimated Time:** 1-2 hours  
**Prerequisites:** Access to Bolt.new Supabase dashboard

---

## 🎯 Overview

This phase focuses on transitioning from the mock database to Bolt.new's built-in Supabase database, configuring the production environment, and ensuring all 3 team members can authenticate successfully.

---

## 📋 Phase Breakdown

### **v2.0 - Database Schema Verification**
**Goal:** Verify Bolt.new Supabase has the correct database schema

**Tasks:**
1. Access Bolt.new Supabase dashboard
2. Check if `users` table exists
3. Check if `campaigns` table exists (optional for now)
4. Verify table schemas match our TypeScript types
5. Document any schema differences

**Expected Schema for `users` table:**
```sql
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
```

**Deliverables:**
- ✅ Schema verification checklist
- ✅ SQL scripts if tables need to be created
- ✅ Documentation of current database state

---

### **v2.1 - Create User Accounts**
**Goal:** Create authentication accounts for all 3 team members

**Tasks:**
1. Navigate to Supabase Auth → Users
2. Create user account for djunohoo@phaze17.com
3. Create user account for soulaflux@phaze17.com
4. Create user account for element@phaze17.com
5. Set secure passwords (share securely with team)
6. Note down the UUID for each user

**User Details:**
| Email | Full Name | Role | Dashboard |
|-------|-----------|------|-----------|
| djunohoo@phaze17.com | DJ UNO HOO | admin | Admin |
| soulaflux@phaze17.com | SoulaFlux | campaign_manager | Marketing |
| element@phaze17.com | Element | analyst | Marketing |

**Deliverables:**
- ✅ 3 user accounts created in Supabase Auth
- ✅ UUIDs documented for next step
- ✅ Passwords securely shared with team

---

### **v2.2 - Create User Profiles**
**Goal:** Insert user profile data into the `users` table

**Tasks:**
1. Get UUIDs from v2.1
2. Run SQL to insert user profiles
3. Verify profiles were created correctly
4. Test querying profiles

**SQL Script:**
```sql
-- Verify auth users exist
SELECT id, email FROM auth.users 
WHERE email IN (
  'djunohoo@phaze17.com',
  'soulaflux@phaze17.com', 
  'element@phaze17.com'
);

-- Insert user profiles (replace UUIDs with actual values from above)
INSERT INTO public.users (id, email, full_name, role, mfa_enabled, preferences)
VALUES
  ('UUID-FROM-AUTH-USERS', 'djunohoo@phaze17.com', 'DJ UNO HOO', 'admin', false, 
   '{"theme": "dark", "notifications": {"email": true, "push": true}}'::jsonb),
  ('UUID-FROM-AUTH-USERS', 'soulaflux@phaze17.com', 'SoulaFlux', 'campaign_manager', false,
   '{"theme": "dark", "notifications": {"email": true, "push": true}}'::jsonb),
  ('UUID-FROM-AUTH-USERS', 'element@phaze17.com', 'Element', 'analyst', false,
   '{"theme": "dark", "notifications": {"email": true, "push": true}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Verify profiles were created
SELECT id, email, full_name, role FROM public.users;
```

**Deliverables:**
- ✅ User profiles created in `users` table
- ✅ Verification query results documented
- ✅ All 3 profiles have correct roles

---

### **v2.3 - Environment Variables Setup**
**Goal:** Configure environment variables for production database

**Tasks:**
1. Get Supabase URL from Bolt.new
2. Get Supabase Anon Key from Bolt.new
3. Update `.env.local` for local testing
4. Document production environment variables
5. Test connection with new credentials

**Environment Variables:**
```env
# Production values (get from Bolt.new)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**Testing Steps:**
1. Update `.env.local` with real credentials
2. Restart dev server
3. Check console for "☁️ Using real Supabase" message
4. Attempt login with one of the created accounts
5. Verify profile loads correctly

**Deliverables:**
- ✅ `.env.local` updated with production credentials
- ✅ Connection test successful
- ✅ Production environment variables documented

---

### **v2.4 - Row Level Security (RLS) Configuration**
**Goal:** Configure database security policies

**Tasks:**
1. Enable RLS on `users` table
2. Create policies for user data access
3. Test policies with different user roles
4. Document security configuration

**SQL Script:**
```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Admins can read all users (optional)
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**Deliverables:**
- ✅ RLS enabled on all tables
- ✅ Security policies created and tested
- ✅ Policy documentation updated

---

### **v2.5 - Authentication Testing**
**Goal:** Test complete authentication flow with real database

**Test Cases:**
1. **Admin Login Test**
   - Navigate to `/admin/login`
   - Login with djunohoo@phaze17.com
   - Verify redirect to `/admin/dashboard`
   - Verify user info displays correctly
   - Verify role badge shows "ADMIN"
   - Test sign out

2. **Marketing Login Test (Campaign Manager)**
   - Navigate to `/marketing/login`
   - Login with soulaflux@phaze17.com
   - Verify redirect to `/marketing/dashboard`
   - Verify user info displays correctly
   - Verify role badge shows "CAMPAIGN MANAGER"
   - Test sign out

3. **Marketing Login Test (Analyst)**
   - Navigate to `/marketing/login`
   - Login with element@phaze17.com
   - Verify redirect to `/marketing/dashboard`
   - Verify user info displays correctly
   - Verify role badge shows "ANALYST"
   - Test sign out

4. **Access Control Test**
   - Login as element@phaze17.com (analyst)
   - Try to access `/admin/dashboard` directly
   - Verify "Access Denied" message appears
   - Verify role mismatch is shown

5. **Session Persistence Test**
   - Login with any account
   - Refresh the page
   - Verify user stays logged in
   - Verify dashboard loads correctly

**Deliverables:**
- ✅ All test cases passed
- ✅ Test results documented
- ✅ Any issues identified and resolved

---

### **v2.6 - Build Optimization**
**Goal:** Optimize build configuration for production

**Tasks:**
1. Add path aliases to `tsconfig.json`
2. Add path aliases to `vite.config.ts`
3. Update imports to use `@/` prefix
4. Add build optimizations
5. Test production build

**File Updates:**

**`tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**`vite.config.ts`:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

**Deliverables:**
- ✅ Path aliases configured
- ✅ Build optimizations added
- ✅ Production build tested
- ✅ Bundle size verified

---

### **v2.7 - Production Logging Configuration**
**Goal:** Update logging for production environment

**Tasks:**
1. Review all `console.log` statements
2. Add environment-based logging
3. Keep critical logs, remove debug logs
4. Add error tracking preparation

**Logging Strategy:**
- **Keep:** Authentication events, errors, critical operations
- **Remove:** Debug logs, verbose state logs
- **Add:** Production error tracking hooks

**Files to Review:**
- `src/contexts/AuthContext.tsx`
- `src/lib/supabase.ts`
- `src/components/ProtectedRoute.tsx`
- `src/pages/*.tsx`

**Deliverables:**
- ✅ Logging reviewed and optimized
- ✅ Production-safe logging implemented
- ✅ Error tracking hooks added

---

### **v2.8 - Documentation Updates**
**Goal:** Update all documentation for production deployment

**Tasks:**
1. Update README with production setup
2. Update DEPLOYMENT_GUIDE with actual credentials
3. Create user guide for team members
4. Document troubleshooting steps

**Documents to Update:**
- `README.md` - Add production deployment section
- `DEPLOYMENT_GUIDE.md` - Update with actual setup steps
- Create `USER_GUIDE.md` - How to use the dashboards
- Create `TROUBLESHOOTING.md` - Common issues and solutions

**Deliverables:**
- ✅ All documentation updated
- ✅ User guide created
- ✅ Troubleshooting guide created

---

### **v2.9 - Final Testing & Code Review**
**Goal:** Final validation before v3.0 deployment

**Tasks:**
1. Complete end-to-end testing
2. Code review of all changes
3. Security audit
4. Performance testing
5. Create v2.9 checkpoint

**Testing Checklist:**
- [ ] All 3 users can log in
- [ ] Role-based access control works
- [ ] Session persistence works
- [ ] Sign out works correctly
- [ ] Protected routes work
- [ ] Database queries work
- [ ] Error handling works
- [ ] UI/UX is responsive
- [ ] Build succeeds
- [ ] No console errors

**Deliverables:**
- ✅ All tests passed
- ✅ Code review complete
- ✅ Security audit complete
- ✅ Ready for v3.0 deployment

---

## 🔧 Tools & Resources Needed

### Access Required
- [ ] Bolt.new account access
- [ ] Supabase dashboard access
- [ ] DNS management for phaze17.com (for v3.0)

### Information Needed
- [ ] Supabase project URL
- [ ] Supabase anon key
- [ ] Preferred subdomain name (e.g., dashboard.phaze17.com)

### Team Coordination
- [ ] Passwords for user accounts
- [ ] Testing availability
- [ ] Deployment approval

---

## 🚨 Risk Assessment

### Low Risk
- ✅ Code is production-ready
- ✅ Mock system provides fallback
- ✅ Error handling is comprehensive

### Medium Risk
- ⚠️ Database schema might need adjustments
- ⚠️ RLS policies might need tuning
- ⚠️ First-time Bolt.new deployment

### Mitigation Strategies
1. Test with mock database first
2. Create database backups before changes
3. Test each user account individually
4. Keep mock system as fallback
5. Document all changes

---

## 📊 Success Criteria

### v2.0 Complete When:
- ✅ Database schema verified/created
- ✅ All 3 user accounts created
- ✅ User profiles inserted
- ✅ Environment variables configured
- ✅ RLS policies configured
- ✅ All authentication tests pass
- ✅ Build optimizations complete
- ✅ Documentation updated
- ✅ Final testing complete

### Ready for v3.0 When:
- ✅ All v2.9 tasks complete
- ✅ No critical bugs
- ✅ Team approval received
- ✅ Deployment plan ready

---

## 🎯 Next Phase Preview: v3.0

**v3.0 - v3.9: Deployment & Testing**
- Deploy to Bolt.new hosting
- Configure subdomain
- Staging environment testing
- Production deployment
- User acceptance testing

---

## 📝 Notes

1. **Bolt.new Database:** Should be Supabase-based, so our code will work without changes
2. **Environment Variables:** Bolt.new should provide these in their dashboard
3. **Deployment:** Bolt.new handles hosting, we just need to configure
4. **Testing:** Test thoroughly in v2.x before deploying in v3.x

---

**Plan Created:** Current Session  
**Status:** ✅ Ready to Execute  
**Approval:** Pending user confirmation  
**Next Step:** Begin v2.0 - Database Schema Verification