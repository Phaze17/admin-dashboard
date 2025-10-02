import React from 'react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/AdobeStock_865132740.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Phaze17
          </h1>
          <p className="text-2xl text-gray-200 drop-shadow-md">
            Command Center
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => navigate('/admin/login')}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-2xl p-12 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
          >
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">🔧</div>
              <h2 className="text-3xl font-bold mb-3">Admin Dashboard</h2>
              <p className="text-blue-100">
                System management, user controls, and configuration
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/marketing/login')}
            className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl p-12 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50"
          >
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-3xl font-bold mb-3">Marketing Dashboard</h2>
              <p className="text-purple-100">
                Campaign orchestration, analytics, and AI intelligence
              </p>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-300 text-sm">
            Authorized personnel only • Secure access required
          </p>
        </div>
      </div>
    </div>
  );
}
