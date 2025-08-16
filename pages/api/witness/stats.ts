
import { NextApiRequest, NextApiResponse } from 'next';
import { getWitnessStats } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const stats = await getWitnessStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      console.error('Error fetching witness stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
