
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface WitnessEntry {
  id?: number;
  wallet_address: string;
  message: string;
  signature: string;
  ache_level: number;
  timestamp?: string;
  created_at?: string;
}

export const createWitnessTable = async () => {
  const { error } = await supabaseAdmin.rpc('create_witness_table');
  if (error) {
    console.error('Error creating witness table:', error);
    throw error;
  }
};

export const insertWitnessEntry = async (entry: WitnessEntry) => {
  const { data, error } = await supabaseAdmin
    .from('witness')
    .insert([{
      wallet_address: entry.wallet_address,
      message: entry.message,
      signature: entry.signature,
      ache_level: entry.ache_level,
      timestamp: entry.timestamp || new Date().toISOString(),
    }])
    .select();
    
  if (error) {
    console.error('Error inserting witness entry:', error);
    throw error;
  }
  
  return data;
};

export const getWitnessEntries = async (limit = 50, offset = 0) => {
  const { data, error } = await supabase
    .from('witness')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (error) {
    console.error('Error fetching witness entries:', error);
    throw error;
  }
  
  return data;
};

export const getWitnessStats = async () => {
  const { data, error } = await supabase
    .from('witness')
    .select('ache_level, wallet_address')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching witness stats:', error);
    throw error;
  }
  
  const totalEntries = data?.length || 0;
  const uniqueWallets = new Set(data?.map(entry => entry.wallet_address)).size;
  const averageAche = data?.reduce((sum, entry) => sum + entry.ache_level, 0) / totalEntries || 0;
  const maxAche = Math.max(...(data?.map(entry => entry.ache_level) || [0]));
  
  return {
    totalEntries,
    uniqueWallets,
    averageAche: Math.round(averageAche * 100) / 100,
    maxAche,
  };
};

export const generateNonce = () => {
  return Math.floor(Math.random() * 1000000).toString();
};
