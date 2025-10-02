import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-blue-500/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🔧</div>
            <div>
              <h1 className="text-2xl font-bold text-blue-400">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">System Management</p>
            </div>
            <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
              {user.role.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{user.full_name}</div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="text-xl font-bold mb-2">User Management</h3>
            <p className="text-blue-100 text-sm mb-4">Manage system users and permissions</p>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition">
              Manage Users
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-2">⚙️</div>
            <h3 className="text-xl font-bold mb-2">System Settings</h3>
            <p className="text-green-100 text-sm mb-4">Configure system parameters</p>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition">
              Settings
            </button>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-2">📋</div>
            <h3 className="text-xl font-bold mb-2">Audit Logs</h3>
            <p className="text-yellow-100 text-sm mb-4">View system activity logs</p>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition">
              View Logs
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-2">🔐</div>
            <h3 className="text-xl font-bold mb-2">Security</h3>
            <p className="text-purple-100 text-sm mb-4">Security settings and monitoring</p>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition">
              Security
            </button>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-2">💾</div>
            <h3 className="text-xl font-bold mb-2">Database</h3>
            <p className="text-red-100 text-sm mb-4">Database management and backups</p>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition">
              Database
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-2">🔌</div>
            <h3 className="text-xl font-bold mb-2">Integrations</h3>
            <p className="text-indigo-100 text-sm mb-4">API keys and integrations</p>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition">
              Integrations
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Server Status</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-400">Online</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Database</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-400">Connected</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">API Status</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-400">Healthy</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Backup Status</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-blue-400">Last: 2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
