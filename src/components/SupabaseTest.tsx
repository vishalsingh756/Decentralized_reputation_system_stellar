import { useState, useEffect } from 'react';
import { supabaseClient } from '../lib/supabase';

export default function SupabaseTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    async function testConnection() {
      try {
        setLoading(true);
        // Try to fetch the current time from Supabase
        const { data, error } = await supabaseClient.supabase.rpc('now');
        
        if (error) {
          throw error;
        }
        
        setMessage('Successfully connected to Supabase!');
        console.log('Supabase connection test successful:', data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to Supabase');
        console.error('Supabase connection test failed:', err);
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  if (loading) {
    return <div>Testing Supabase connection...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-green-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Supabase Connection Test</h2>
      <p className="text-green-700">{message}</p>
    </div>
  );
} 