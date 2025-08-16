
import { NextApiRequest, NextApiResponse } from 'next';
import { generateNonce } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const nonce = generateNonce();
      res.status(200).json({ success: true, data: { nonce } });
    } catch (error) {
      console.error('Error generating nonce:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
