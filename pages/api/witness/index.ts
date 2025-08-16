
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, insertWitnessEntry, getWitnessEntries } from '@/lib/supabase';
import { verifySignature } from '@/lib/ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { walletAddress, message, signature, acheLevel, timestamp } = req.body;

      // Validate required fields
      if (!walletAddress || !message || !signature || acheLevel === undefined) {
        return res.status(400).json({ 
          error: 'Missing required fields: walletAddress, message, signature, acheLevel' 
        });
      }

      // Verify signature using EIP-191
      const isValidSignature = verifySignature(message, signature, walletAddress);
      if (!isValidSignature) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // Insert witness entry
      const entry = await insertWitnessEntry({
        wallet_address: walletAddress,
        message,
        signature,
        ache_level: parseInt(acheLevel),
        timestamp: timestamp || new Date().toISOString(),
      });

      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      console.error('Error creating witness entry:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const { limit = '50', offset = '0' } = req.query;
      const entries = await getWitnessEntries(
        parseInt(limit as string),
        parseInt(offset as string)
      );
      res.status(200).json({ success: true, data: entries });
    } catch (error) {
      console.error('Error fetching witness entries:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
