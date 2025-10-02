// Mock Supabase client for local development
import { User as SupabaseUser } from '@supabase/supabase-js';

const MOCK_USERS = [
  {
    id: 'mock-admin-id',
    email: 'djunohoo@phaze17.com',
    full_name: 'DJ UNO HOO',
    role: 'admin',
    mfa_enabled: false,
    preferences: {
      theme: 'dark',
      notifications: { email: true, push: true }
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mock-marketing-id',
    email: 'soulaflux@phaze17.com',
    full_name: 'SoulaFlux',
    role: 'campaign_manager',
    mfa_enabled: false,
    preferences: {
      theme: 'dark',
      notifications: { email: true, push: true }
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mock-element-id',
    email: 'element@phaze17.com',
    full_name: 'Element',
    role: 'analyst',
    mfa_enabled: false,
    preferences: {
      theme: 'dark',
      notifications: { email: true, push: true }
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock auth session
let currentSession: any = null;

export const mockSupabase = {
  auth: {
    getSession: () => {
      return Promise.resolve({ 
        data: { session: currentSession }, 
        error: null 
      });
    },
    
    signInWithPassword: ({ email, password }: { email: string; password: string }) => {
      // Simple mock validation
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user || password.length < 8) {
        return Promise.resolve({
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials' }
        });
      }

      const mockSession = {
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: '2024-01-01T00:00:00Z'
        } as SupabaseUser,
        access_token: 'mock-token',
        expires_at: Date.now() + 3600000
      };

      currentSession = mockSession;
      
      return Promise.resolve({
        data: { user: mockSession.user, session: mockSession },
        error: null
      });
    },

    signOut: () => {
      currentSession = null;
      return Promise.resolve({ error: null });
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simulate initial session check
      setTimeout(() => {
        callback('INITIAL_SESSION', currentSession);
      }, 100);

      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },

  from: (table: string) => {
    return {
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          maybeSingle: () => {
            if (table === 'users') {
              const user = MOCK_USERS.find(u => u[column as keyof typeof u] === value);
              return Promise.resolve({ data: user || null, error: null });
            }
            return Promise.resolve({ data: null, error: null });
          }
        }),
        count: 'exact' as const,
        head: true
      }),
      
      update: (data: any) => ({
        eq: (column: string, value: any) => {
          if (table === 'users') {
            const userIndex = MOCK_USERS.findIndex(u => u[column as keyof typeof u] === value);
            if (userIndex !== -1) {
              MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...data };
            }
          }
          return Promise.resolve({ data: {}, error: null });
        }
      })
    };
  }
};