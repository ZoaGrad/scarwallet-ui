
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Create witness table
      const { error } = await supabaseAdmin.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS witness (
            id SERIAL PRIMARY KEY,
            wallet_address TEXT NOT NULL,
            message TEXT NOT NULL,
            signature TEXT NOT NULL,
            ache_level INTEGER NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_witness_wallet_address ON witness(wallet_address);
          CREATE INDEX IF NOT EXISTS idx_witness_created_at ON witness(created_at DESC);
          CREATE INDEX IF NOT EXISTS idx_witness_ache_level ON witness(ache_level);
        `
      });

      if (error) {
        console.error('Database setup error:', error);
        return res.status(500).json({ error: 'Failed to setup database' });
      }

      res.status(200).json({ success: true, message: 'Database setup completed' });
    } catch (error) {
      console.error('Error setting up database:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
