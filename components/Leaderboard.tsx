import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, UserProfile } from '@/lib/firebase';

interface LeaderboardProps {
  currentUserId?: string;
}

export default function Leaderboard({ currentUserId }: LeaderboardProps) {
  const [topUsers, setTopUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if Firebase is properly configured
      if (!db) {
        throw new Error('Firebase not properly configured');
      }

      const usersRef = collection(db, 'users');
      
      // Try a simpler query first to test permissions
      const testQuery = query(usersRef, limit(1));
      
      try {
        await getDocs(testQuery);
      } catch (permissionError) {
        // If we get permission denied, show helpful message
        if (permissionError instanceof Error && permissionError.message.includes('permission-denied')) {
          setError('Leaderboard requires Firebase security rules to be configured. Please set up Firestore rules to allow authenticated users to read user profiles.');
          setTopUsers([]); // Show empty leaderboard
          return;
        }
        throw permissionError;
      }
      
      // Query only users who have completed all rooms
      const q = query(
        usersRef,
        // Note: We'll filter and sort on the client side for better control
        limit(50) // Get more records to filter locally
      );
      
      const snapshot = await getDocs(q);
      const allUsers = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserProfile[];
      
      // Filter to only users who completed all rooms and sort properly
      const completedUsers = allUsers
        .filter(user => user.hasCompletedAllRooms && user.totalCompletionTime)
        .sort((a, b) => {
          // First sort by number of completed rooms (descending)
          const roomDiff = (b.completedRooms?.length || 0) - (a.completedRooms?.length || 0);
          if (roomDiff !== 0) return roomDiff;
          
          // Then by total completion time (ascending - faster is better)
          return (a.totalCompletionTime || Infinity) - (b.totalCompletionTime || Infinity);
        })
        .slice(0, 10); // Take top 10
      
      setTopUsers(completedUsers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          setError('Unable to load leaderboard - Firebase security rules need to be configured');
        } else if (error.message.includes('Firebase not properly configured')) {
          setError('Leaderboard unavailable - Firebase not configured');
        } else {
          setError(`Failed to load leaderboard: ${error.message}`);
        }
      } else {
        setError('Failed to load leaderboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCompletionTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMins}m`;
    }
    return `${mins}m`;
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '👻';
    }
  };

  if (loading) {
    return (
      <div className="bg-eerie-gray rounded-lg p-6">
        <h2 className="text-xl font-bold text-spooky-purple mb-4">
          🏆 Escapees Leaderboard
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spooky-purple"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-eerie-gray rounded-lg p-6">
        <h2 className="text-xl font-bold text-spooky-purple mb-4">
          🏆 Escapees Leaderboard
        </h2>
        <div className="text-center py-8">
          <div className="text-red-400 mb-4">{error}</div>
          {error.includes('security rules') && (
            <div className="text-sm text-gray-400 mb-4 text-left">
              <p className="mb-2">To fix this, you need to:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to your Firebase Console</li>
                <li>Navigate to Firestore Database → Rules</li>
                <li>Replace the rules with the content from <code className="bg-gray-700 px-1 rounded">firestore.rules</code></li>
                <li>Click "Publish" to apply the rules</li>
              </ol>
            </div>
          )}
          <button
            onClick={loadLeaderboard}
            className="bg-spooky-purple hover:bg-spooky-purple/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-eerie-gray rounded-lg p-6">
      <h2 className="text-xl font-bold text-spooky-purple mb-6">
        🏆 Escapees Leaderboard
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Top players who escaped all 10 rooms, ranked by fastest completion time
      </p>
      
      {topUsers.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No one has completed all 10 rooms yet... 
          <br />
          Be the first to escape the haunted house! 🦇
        </div>
      ) : (
        <div className="space-y-3">
          {topUsers.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.uid === currentUserId;
            
            return (
              <div
                key={user.uid}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isCurrentUser 
                    ? 'bg-spooky-purple/20 border border-spooky-purple' 
                    : 'bg-shadow-black hover:bg-shadow-black/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getRankEmoji(rank)}</span>
                  <div>
                    <div className={`font-semibold ${
                      isCurrentUser ? 'text-spooky-green' : 'text-white'
                    }`}>
                      {user.displayName || 'Anonymous Ghost'}
                      {isCurrentUser && ' (You)'}
                    </div>
                    <div className="text-sm text-gray-400">
                      Rank #{rank}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-spooky-green font-bold text-lg">
                    {user.completedRooms?.length || 0}/10 rooms
                  </div>
                  {user.totalCompletionTime && (
                    <div className="text-sm text-gray-400">
                      Time: {formatCompletionTime(user.totalCompletionTime)}
                    </div>
                  )}
                  <div className="text-xs text-spooky-purple">
                    {user.score} pts
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-600">
        <button
          onClick={loadLeaderboard}
          className="w-full text-spooky-purple hover:text-spooky-green transition-colors text-sm"
        >
          🔄 Refresh Leaderboard
        </button>
      </div>
    </div>
  );
}