import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User } from 'firebase/auth';
import { doc, updateDoc, increment, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getPuzzleById, getNextPuzzle, calculateScore, Puzzle } from '@/lib/puzzleEngine';
import PuzzleRenderer from '@/components/PuzzleRenderer';
import Link from 'next/link';

interface RoomProps {
  user: User | null;
  loading: boolean;
}

export default function Room({ user, loading }: RoomProps) {
  const router = useRouter();
  const { slug } = router.query;
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [roomStartTime, setRoomStartTime] = useState(Date.now()); // Individual room start time
  const [currentTime, setCurrentTime] = useState(0); // For live timer
  const [roomTimeSpent, setRoomTimeSpent] = useState(0); // Time spent on this specific room
  const [hintsUsed, setHintsUsed] = useState(0);

  // Live timer effect
  useEffect(() => {
    if (solved) return; // Stop timer when solved
    
    const interval = setInterval(() => {
      setCurrentTime(Math.floor((Date.now() - roomStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [roomStartTime, solved]);

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      const foundPuzzle = getPuzzleById(slug);
      setPuzzle(foundPuzzle);
      // Reset state when navigating to a new room
      setSolved(false);
      setScore(0);
      setHintsUsed(0);
      setRoomStartTime(Date.now()); // Reset room timer
      setCurrentTime(0); // Reset live timer display
      setRoomTimeSpent(0); // Reset room time spent
      
      // Track game start time if this is the first room and user hasn't started yet
      if (user && foundPuzzle?.room === 1) {
        trackGameStart();
      }
    }
  }, [slug, user]);

  const trackGameStart = async () => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Only set gameStartTime if it's not already set or if they're starting fresh
        if (!userData.gameStartTime || userData.completedRooms?.length === 0) {
          await updateDoc(userRef, {
            gameStartTime: Date.now()
          });
        }
      }
    } catch (error) {
      console.error('Error tracking game start:', error);
    }
  };

  const handleCorrect = async (puzzleScore: number) => {
    if (!user || !puzzle) return;

    const roomTimeSpent = Math.floor((Date.now() - roomStartTime) / 1000);
    setRoomTimeSpent(roomTimeSpent); // Store for display
    const finalScore = calculateScore(puzzle, roomTimeSpent) - (hintsUsed * 10); // Penalty for hints
    
    setScore(finalScore);
    setSolved(true);

    // Update user profile in Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Get current user data
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const currentRoomTimes = userData?.roomTimes || {};
      
      // Update room times with this room's completion time
      const updatedRoomTimes = {
        ...currentRoomTimes,
        [puzzle.id]: roomTimeSpent
      };
      
      // Calculate total time from all completed rooms
      const totalTimeFromRooms = Object.values(updatedRoomTimes).reduce((sum: number, time: any) => sum + time, 0);
      
      // Check if this is the final room (room 10)
      const isLastRoom = puzzle.room === 10;
      
      if (isLastRoom) {
        await updateDoc(userRef, {
          score: increment(finalScore),
          completedRooms: arrayUnion(puzzle.id),
          bestTime: roomTimeSpent, // This room's time
          roomTimes: updatedRoomTimes,
          // Mark game as completed
          hasCompletedAllRooms: true,
          totalCompletionTime: totalTimeFromRooms, // Sum of all room times
          completedAt: new Date(),
        });
      } else {
        await updateDoc(userRef, {
          score: increment(finalScore),
          completedRooms: arrayUnion(puzzle.id),
          bestTime: roomTimeSpent, // This room's time
          roomTimes: updatedRoomTimes,
          totalCompletionTime: totalTimeFromRooms, // Update running total
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleHintUsed = () => {
    setHintsUsed(prev => prev + 1);
  };

  const getNextRoomLink = () => {
    if (!puzzle) return null;
    const nextPuzzle = getNextPuzzle(puzzle.room);
    return nextPuzzle ? `/room/${nextPuzzle.id}` : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spooky-purple mx-auto"></div>
          <p className="text-gray-300 mt-4">Loading the cursed room...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-eerie-gray rounded-lg p-8">
          <h1 className="text-3xl font-bold text-spooky-purple mb-4">
            🚫 Access Denied
          </h1>
          <p className="text-gray-300 mb-6">
            You must be logged in to enter the haunted rooms.
          </p>
          <Link 
            href="/"
            className="inline-block bg-spooky-purple hover:bg-spooky-purple/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Return to Safety
          </Link>
        </div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-eerie-gray rounded-lg p-8">
          <h1 className="text-3xl font-bold text-spooky-purple mb-4">
            👻 Room Not Found
          </h1>
          <p className="text-gray-300 mb-6">
            This room seems to have vanished into the spirit world...
          </p>
          <Link 
            href="/"
            className="inline-block bg-spooky-purple hover:bg-spooky-purple/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (solved) {
    const nextRoomLink = getNextRoomLink();
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center bg-eerie-gray rounded-lg p-8">
          <div className="text-6xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-4xl font-bold text-spooky-green mb-4">
            Room Escaped!
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {puzzle.successMessage || `Congratulations! You've successfully solved the puzzle and escaped ${puzzle.title}!`}
          </p>
          
          {/* Score Display */}
          <div className="bg-shadow-black rounded-lg p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-spooky-purple mb-4">
              Your Performance
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-spooky-green">{score}</div>
                <div className="text-gray-400 text-sm">Points Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-spooky-green">
                  {Math.floor(roomTimeSpent)}s
                </div>
                <div className="text-gray-400 text-sm">Room Time</div>
              </div>
            </div>
            {hintsUsed > 0 && (
              <div className="mt-4 text-yellow-400 text-sm">
                Hints used: {hintsUsed} (-{hintsUsed * 10} points)
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            {nextRoomLink ? (
              <Link
                href={nextRoomLink}
                className="inline-block bg-spooky-purple hover:bg-spooky-purple/80 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg mr-4"
              >
                🚪 Enter Next Room
              </Link>
            ) : (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-spooky-green mb-2">
                  🏆 You've Escaped the Haunted House! 🏆
                </h2>
                <p className="text-gray-300">
                  Congratulations on completing all the rooms!
                </p>
              </div>
            )}
            
            <Link
              href="/"
              className="inline-block bg-spooky-green hover:bg-spooky-green/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🏠 Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Room Navigation */}
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-spooky-purple hover:text-spooky-green transition-colors"
        >
          <span>←</span>
          <span>Back to House</span>
        </Link>
        
        {/* Live Timer */}
        {!solved && (
          <div className="bg-shadow-black rounded-lg px-4 py-2 border border-spooky-purple/30">
            <div className="flex items-center space-x-2">
              <span className="text-spooky-purple text-sm">⏱️ Room Time:</span>
              <span className="text-spooky-green font-bold text-lg">
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Puzzle */}
      <PuzzleRenderer 
        puzzle={puzzle}
        onCorrect={handleCorrect}
        onHintUsed={handleHintUsed}
      />

      {/* Room Atmosphere */}
      <div className="mt-8 text-center">
        <div className="bg-shadow-black rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-gray-400 italic">
            "The shadows whisper secrets of the code... 
            Listen carefully, for the solution lies within the darkness..."
          </p>
        </div>
      </div>
    </div>
  );
}