import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function MarketingDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-purple-500/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📊</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Marketing Dashboard
              </h1>
              <p className="text-sm text-gray-400">Campaign Command Center</p>
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm">
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
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold mb-2">Active Campaigns</h3>
            <div className="text-3xl font-bold mb-2">12</div>
            <p className="text-purple-100 text-sm">Running campaigns</p>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-2">👁️</div>
            <h3 className="text-xl font-bold mb-2">Total Reach</h3>
            <div className="text-3xl font-bold mb-2">2.4M</div>
            <p className="text-pink-100 text-sm">Impressions this month</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 shadow-xl">
            <div className="text-4xl mb-2">💰</div>
            <h3 className="text-xl font-bold mb-2">Budget Spent</h3>
            <div className="text-3xl font-bold mb-2">$48K</div>
            <p className="text-blue-100 text-sm">Of $75K allocated</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-left transition flex items-center justify-between">
                <span>Create New Campaign</span>
                <span>→</span>
              </button>
              <button className="w-full px-4 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg text-left transition flex items-center justify-between">
                <span>View Analytics</span>
                <span>→</span>
              </button>
              <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-left transition flex items-center justify-between">
                <span>Intelligence Operations</span>
                <span>→</span>
              </button>
              <button className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-left transition flex items-center justify-between">
                <span>AI Collaboration Hub</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">Campaign launched</div>
                  <div className="text-xs text-gray-400">Summer Product Launch - 2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                <div className="text-2xl">📈</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">Engagement spike detected</div>
                  <div className="text-xs text-gray-400">Instagram campaign +45% - 4 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                <div className="text-2xl">🤖</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">AI recommendation</div>
                  <div className="text-xs text-gray-400">Optimize ad spend allocation - 6 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Intelligence Network Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Stealth Agents</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-400">3 Active</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Stream Monitors</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-400">5 Tracking</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">AI Agents</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-blue-400">4 Online</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Data Sync</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-400">Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
