
import { useState, useEffect } from 'react';
import { getWitnessEntries, getWitnessStats, WitnessEntry } from '@/lib/supabase';

export const useWitness = () => {
  const [entries, setEntries] = useState<WitnessEntry[]>([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    uniqueWallets: 0,
    averageAche: 0,
    maxAche: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async (limit = 50, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWitnessEntries(limit, offset);
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching witness entries:', err);
      setError('Failed to fetch witness entries');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await getWitnessStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching witness stats:', err);
      setError('Failed to fetch witness statistics');
    }
  };

  const refresh = async () => {
    await Promise.all([fetchEntries(), fetchStats()]);
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    entries,
    stats,
    loading,
    error,
    refresh,
    fetchEntries,
    fetchStats,
  };
};
