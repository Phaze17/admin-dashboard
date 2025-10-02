import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function DashboardLayout() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-400">SoulaFlux Command</h1>
            <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
              {user.role.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{user.full_name}</div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to SoulaFlux Marketing Dashboard!</h2>
          <p className="text-gray-400 mb-6">
            Your dashboard is loading. Complete setup steps to enable all features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">✅ Authentication</h3>
              <p className="text-sm text-gray-300">You're signed in as {user.role}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📊 Dashboard</h3>
              <p className="text-sm text-gray-300">Ready for customization</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🔐 Database</h3>
              <p className="text-sm text-gray-300">Connected to Supabase</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎨 Theme</h3>
              <p className="text-sm text-gray-300">Dark mode active</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-900/30 border border-blue-700 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-blue-300">
              <strong>Next Steps:</strong> Check DASHBOARD_README.md to add campaign features, intelligence ops, and AI agents!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
