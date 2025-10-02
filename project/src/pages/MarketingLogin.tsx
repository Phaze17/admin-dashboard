import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseHealthCheck } from '../components/DatabaseHealthCheck';

export function MarketingLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbHealthy, setDbHealthy] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Marketing login attempt for:', email);
      
      // Add timeout to prevent hanging
      const loginPromise = signIn(email, password, 'marketing');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout - please try again')), 15000)
      );

      await Promise.race([loginPromise, timeoutPromise]);
      
      console.log('Marketing login successful, redirecting...');
      navigate('/marketing/dashboard');
    } catch (err: any) {
      console.error('Marketing login error:', err);
      let errorMessage = 'Failed to sign in';
      
      if (err.message === 'Login timeout - please try again') {
        errorMessage = 'Login is taking too long. Please check your connection and try again.';
      } else if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/AdobeStock_865132740.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-gray-300 hover:text-white transition flex items-center gap-2"
        >
          ← Back to Home
        </button>

        <div className="bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-700/50">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📊</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Marketing Dashboard
            </h1>
            <p className="text-gray-400">Campaign & Analytics Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <DatabaseHealthCheck onHealthChange={setDbHealthy} />
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                placeholder="marketing@phaze17.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !dbHealthy}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition transform active:scale-95"
            >
              {loading ? 'Signing in...' : !dbHealthy ? 'Database Unavailable' : 'Sign In to Marketing'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Marketing team access only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
