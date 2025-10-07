# 🚀 Quick Start Guide - Phaze17 Admin & Marketing Dashboards

**Current Version:** v1.1 (Planning Complete)  
**Next Version:** v2.0 (Database Setup)  
**Status:** Ready for Production Deployment

---

## 📋 What We Have

### ✅ Completed (v1.0 - v1.1)
- **Landing Page** - Beautiful dual-dashboard selector
- **Admin Dashboard** - System management interface
- **Marketing Dashboard** - Campaign management interface
- **Authentication** - Supabase-based login system
- **Role-Based Access** - Proper permission controls
- **Mock Database** - Working local development environment
- **Build System** - Production-ready Vite build

### 🔄 In Progress (v2.0 - v2.9)
- Database setup with Bolt.new Supabase
- User account creation
- Environment configuration
- Production optimization

### 📅 Upcoming (v3.0+)
- Deployment to subdomain
- Testing and validation
- Production launch

---

## 👥 Team Members & Access

| Name | Email | Role | Dashboard | Status |
|------|-------|------|-----------|--------|
| DJ UNOHOO | djunohoo@phaze17.com | Admin | Admin Dashboard | Ready |
| SoulaFlux | soulaflux@phaze17.com | Campaign Manager | Marketing Dashboard | Ready |
| Element | element@phaze17.com | Analyst | Marketing Dashboard | Ready |

---

## 🎯 Current Status

### What Works Right Now (Mock Mode)
1. **Landing Page** - `http://localhost:3000/`
2. **Admin Login** - Any @phaze17.com email + 8+ char password
3. **Marketing Login** - Any @phaze17.com email + 8+ char password
4. **Dashboards** - Full UI with mock data
5. **Sign Out** - Returns to landing page

### What We Need to Do (v2.0)
1. **Get Bolt.new Supabase credentials**
2. **Create 3 real user accounts**
3. **Update environment variables**
4. **Test with real database**
5. **Deploy to subdomain**

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ installed
- npm or pnpm installed

### Steps
```bash
# Navigate to project folder
cd c:\repos\admin-dashboard\project

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Test Accounts (Mock Mode)
- **Email:** Any email ending in @phaze17.com
- **Password:** Any password with 8+ characters
- **Example:** test@phaze17.com / password123

---

## 📁 Project Structure

```
admin-dashboard/
├── VERSIONING.md                    # Version tracking
├── PRODUCTION_READINESS_AUDIT.md    # v1.1 audit results
├── V2_IMPLEMENTATION_PLAN.md        # v2.0 detailed plan
├── QUICK_START_GUIDE.md            # This file
│
└── project/
    ├── src/
    │   ├── App.tsx                  # Main app with routes
    │   ├── main.tsx                 # Entry point
    │   ├── components/              # Reusable components
    │   ├── contexts/                # React contexts (Auth)
    │   ├── lib/                     # Utilities (Supabase, Mock)
    │   ├── pages/                   # Page components
    │   └── types/                   # TypeScript types
    │
    ├── public/                      # Static assets
    ├── dist/                        # Build output
    ├── package.json                 # Dependencies
    ├── vite.config.ts              # Vite configuration
    ├── tsconfig.json               # TypeScript config
    └── .env.local                  # Environment variables
```

---

## 🔑 Key Files

### Configuration
- **`.env.local`** - Environment variables (currently mock)
- **`vite.config.ts`** - Build configuration
- **`tsconfig.json`** - TypeScript settings

### Core Application
- **`src/App.tsx`** - Routing and app structure
- **`src/contexts/AuthContext.tsx`** - Authentication logic
- **`src/lib/supabase.ts`** - Database client (auto-switches mock/real)
- **`src/lib/mockSupabase.ts`** - Mock database for local dev

### Pages
- **`src/pages/LandingPage.tsx`** - Home page
- **`src/pages/AdminLogin.tsx`** - Admin login form
- **`src/pages/MarketingLogin.tsx`** - Marketing login form
- **`src/pages/AdminDashboard.tsx`** - Admin interface
- **`src/pages/MarketingDashboard.tsx`** - Marketing interface

---

## 🎨 Routes

| URL | Page | Access | Required Role |
|-----|------|--------|---------------|
| `/` | Landing Page | Public | None |
| `/admin/login` | Admin Login | Public | None |
| `/marketing/login` | Marketing Login | Public | None |
| `/admin/dashboard` | Admin Dashboard | Protected | admin, operator |
| `/marketing/dashboard` | Marketing Dashboard | Protected | campaign_manager, analyst, operator |

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run tests (if configured)

# Deployment (Bolt.new)
# Bolt.new handles this automatically
```

---

## 🐛 Troubleshooting

### Issue: Can't log in
**Solution:** 
- Check you're using an @phaze17.com email
- Password must be 8+ characters
- Check console for error messages

### Issue: "Access Denied" after login
**Solution:**
- Check your role matches the dashboard
- Admin dashboard needs: admin or operator
- Marketing dashboard needs: campaign_manager, analyst, or operator

### Issue: Page won't load
**Solution:**
- Check dev server is running
- Clear browser cache
- Check console for errors
- Restart dev server

### Issue: Build fails
**Solution:**
- Delete `node_modules` and reinstall
- Check Node.js version (18+)
- Check for TypeScript errors

---

## 📞 Getting Help

### Documentation
- **VERSIONING.md** - Version history and status
- **PRODUCTION_READINESS_AUDIT.md** - Technical audit
- **V2_IMPLEMENTATION_PLAN.md** - Next steps plan
- **DEPLOYMENT_GUIDE.md** - Deployment instructions

### Console Logging
The app has extensive console logging for debugging:
- Auth events
- Database queries
- Route protection checks
- Error messages

Open browser DevTools (F12) to see logs.

---

## 🎯 Next Steps

### For Development Team
1. **Review** - Read PRODUCTION_READINESS_AUDIT.md
2. **Plan** - Review V2_IMPLEMENTATION_PLAN.md
3. **Access** - Get Bolt.new Supabase credentials
4. **Execute** - Follow v2.0 plan step by step
5. **Test** - Verify each step works
6. **Deploy** - Move to v3.0 deployment

### For End Users (After Deployment)
1. **Access** - Go to dashboard.phaze17.com (or assigned subdomain)
2. **Login** - Use your @phaze17.com email and password
3. **Navigate** - Choose Admin or Marketing dashboard
4. **Explore** - Familiarize yourself with the interface
5. **Report** - Report any issues to development team

---

## ✅ Checklist for v2.0

Before starting v2.0, ensure you have:
- [ ] Access to Bolt.new account
- [ ] Access to Supabase dashboard
- [ ] Supabase URL and Anon Key
- [ ] Passwords ready for 3 user accounts
- [ ] Time allocated (1-2 hours)
- [ ] This guide and V2_IMPLEMENTATION_PLAN.md open

---

## 🎉 Success Metrics

### v2.0 Success
- ✅ All 3 users can log in
- ✅ Correct dashboards load for each user
- ✅ Role-based access works
- ✅ No console errors
- ✅ Session persistence works

### Production Success (v5.0)
- ✅ Accessible via subdomain
- ✅ All team members trained
- ✅ No critical bugs
- ✅ Performance is good
- ✅ Security is configured

---

**Last Updated:** v1.1  
**Next Update:** v2.0  
**Status:** 🟢 Ready to Proceed