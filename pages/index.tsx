import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, UserProfile } from '@/lib/firebase';
import { getPuzzleByRoom } from '@/lib/puzzleEngine';
import Link from 'next/link';
import AuthButton from '@/components/AuthButton';
import Leaderboard from '@/components/Leaderboard';

interface HomeProps {
  user: User | null;
  loading: boolean;
}

export default function Home({ user, loading }: HomeProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    setProfileLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        // Create new user profile
        const newProfile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || 'Anonymous Ghost',
          email: user.email || '',
          score: 0,
          bestTime: 0,
          createdAt: new Date(),
          completedRooms: [],
          gameStartTime: Date.now(), // Track when they start the game
          hasCompletedAllRooms: false,
        };
        
        await setDoc(docRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const getNextRoom = () => {
    if (!userProfile) return 1;
    return Math.max(1, userProfile.completedRooms.length + 1);
  };

  const getGameProgress = () => {
    if (!userProfile) return 0;
    return Math.min(100, (userProfile.completedRooms.length / 10) * 100);
  };

  const handlePlayAgain = async () => {
    if (!user || !userProfile) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        completedRooms: [],
        score: 0,
        gameStartTime: Date.now(),
        hasCompletedAllRooms: false,
        // Keep leaderboard records but reset current game
      });
      
      // Refresh the profile
      await loadUserProfile();
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  const copyShareText = () => {
    if (!userProfile) return;

    const timeInMinutes = userProfile.totalCompletionTime 
      ? Math.round(userProfile.totalCompletionTime / 60) 
      : 0;
    
    const shareText = `I just escaped the Haunted House of Bugs! 👻🏚️\n` +
      `Solved all ${userProfile.completedRooms.length} coding puzzles in ${timeInMinutes} minutes.\n` +
      `Final Score: ${userProfile.score} points\n` +
      `Can you beat my time? Try it here: ${window.location.origin}`;

    navigator.clipboard.writeText(shareText).then(() => {
      alert('Share text copied to clipboard!');
    }).catch(() => {
      alert('Could not copy to clipboard. Please try again.');
    });
  };

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spooky-purple mx-auto"></div>
          <p className="text-gray-300 mt-4">Loading the haunted house...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {!user ? (
        /* Not Logged In */
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="bg-eerie-gray rounded-lg p-8 md:p-12 w-full max-w-sm sm:max-w-md lg:max-w-3xl xl:max-w-4xl mx-4">
            <div className="text-center">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-spooky-purple mb-4 animate-spooky-glow">
                  🏚️ Haunted House of Bugs
                </h1>
                <p className="text-lg text-gray-300">
                  Escape the haunted house by solving coding puzzles
                </p>
              </div>
              
              <p className="text-gray-300 mb-6">
                Sign in to start your spooky coding adventure and track your progress!
              </p>
              <AuthButton user={user} loading={loading} />
            </div>
          </div>
        </div>
      ) : (
        /* Logged In - Normal Layout */
        <>
          {/* Hero Section */}
          <div className="text-center mb-12">
            {/* Floating Ghost */}
            <div className="animate-ghost-float mb-8">
              <img 
                src="/images/ghost.svg" 
                alt="Floating Ghost" 
                className="w-24 h-24 mx-auto"
              />
            </div>

            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-spooky-purple mb-4 animate-spooky-glow">
                Haunted House of Bugs
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Escape the haunted house by solving coding puzzles. 
                Debug spooky code, learn programming fundamentals, and climb the leaderboard!
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Main Game Area */}
            <div className="space-y-6">
              {/* Welcome Back */}
              <div className="bg-eerie-gray rounded-lg p-6">
                <h2 className="text-2xl font-bold text-spooky-purple mb-2">
                  Welcome back, {userProfile?.displayName}! 👋
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-spooky-green">
                      {userProfile?.score || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Total Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-spooky-green">
                      {userProfile?.completedRooms.length || 0}/10
                    </div>
                    <div className="text-gray-400 text-sm">Rooms Escaped</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{getGameProgress().toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-shadow-black rounded-full h-2">
                    <div 
                      className="bg-spooky-green h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getGameProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Continue Game */}
              <div className="bg-eerie-gray rounded-lg p-6 text-center">
                {userProfile?.completedRooms.length === 10 ? (
                  /* Game Completed */
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-spooky-green mb-4">
                      🎉 You've Escaped! 🎉
                    </h2>
                    <p className="text-gray-300 mb-4">
                      Congratulations! You've successfully debugged all the rooms and escaped the haunted house!
                    </p>
                    <p className="text-spooky-purple mb-6">
                      Final Score: <span className="font-bold">{userProfile?.score}</span>
                      {userProfile?.totalCompletionTime && (
                        <>
                          {' • '}
                          Total Time: <span className="font-bold">
                            {Math.round(userProfile.totalCompletionTime / 60)} minutes
                          </span>
                        </>
                      )}
                    </p>
                    
                    {/* Victory Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={handlePlayAgain}
                        className="bg-spooky-purple hover:bg-spooky-purple/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Play Again
                      </button>
                      <button
                        onClick={copyShareText}
                        className="bg-spooky-green hover:bg-spooky-green/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Share Your Victory
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Continue Playing */
                  <div>
                    <h2 className="text-2xl font-bold text-spooky-purple mb-4">
                      Continue Your Journey
                    </h2>
                    <p className="text-gray-300 mb-6">
                      {userProfile?.completedRooms.length === 0 
                        ? "Begin your spooky adventure in the first room!"
                        : `Continue to Room ${getNextRoom()} and face new coding challenges!`
                      }
                    </p>
                    <Link 
                      href={`/room/${getPuzzleByRoom(getNextRoom())?.id}`}
                      className="inline-block bg-spooky-purple hover:bg-spooky-purple/80 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg"
                    >
                      {userProfile?.completedRooms.length === 0 ? "🚪 Enter the House" : "🚪 Continue Adventure"}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Only show when user is logged in */}
            {user && (
              <div>
                <Leaderboard currentUserId={user?.uid} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}