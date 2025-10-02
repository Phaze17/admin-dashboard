import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface HealthCheckProps {
  onHealthChange?: (isHealthy: boolean) => void;
}

export function DatabaseHealthCheck({ onHealthChange }: HealthCheckProps) {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkDatabaseHealth();
  }, []);

  const checkDatabaseHealth = async () => {
    try {
      console.log('Checking database health...');
      
      // Simple query to test connection
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.error('Database health check failed:', error);
        setStatus('error');
        setError(error.message);
        onHealthChange?.(false);
      } else {
        console.log('Database health check passed');
        setStatus('healthy');
        setError('');
        onHealthChange?.(true);
      }
    } catch (err: any) {
      console.error('Health check exception:', err);
      setStatus('error');
      setError(err.message || 'Unknown error');
      onHealthChange?.(false);
    }
  };

  if (status === 'checking') {
    return (
      <div className="text-center text-gray-400">
        <div className="animate-pulse">🔍 Checking database connection...</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <span>⚠️</span>
          <span className="font-medium">Database Connection Issue</span>
        </div>
        <p className="text-sm text-red-300 mb-3">{error}</p>
        <button
          onClick={checkDatabaseHealth}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="text-center text-green-400 text-sm">
      ✅ Database connection healthy
    </div>
  );
}