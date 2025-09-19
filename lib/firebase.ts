import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();

// Types for Firestore documents
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  score: number;
  bestTime: number;
  createdAt: Date;
  completedRooms: string[];
  // New leaderboard tracking fields
  totalCompletionTime?: number; // Total time to complete all rooms (in seconds)
  completedAt?: Date; // When all rooms were completed
  gameStartTime?: number; // When the player started their current game
  hasCompletedAllRooms?: boolean; // Whether they've finished all 10 rooms
  // Individual room completion times
  roomTimes?: { [roomId: string]: number }; // Time taken for each room in seconds
}

export interface Submission {
  userId: string;
  puzzleId: string;
  timestamp: Date;
  correct: boolean;
  timeSpent: number;
}