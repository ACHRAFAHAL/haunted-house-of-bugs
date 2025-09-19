import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LeaderboardEntry {
  uid: string;
  displayName: string;
  score: number;
  bestTime: number;
  completedRooms: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('score', 'desc'),
      orderBy('bestTime', 'asc'), // Tie-breaker: faster time
      limit(50) // Top 50 users
    );
    
    const snapshot = await getDocs(q);
    const leaderboard: LeaderboardEntry[] = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as LeaderboardEntry[];
    
    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}