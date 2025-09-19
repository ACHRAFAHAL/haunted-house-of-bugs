import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const [userScore, setUserScore] = useState(0);

  // Listen to user's score changes in real-time
  useEffect(() => {
    if (!user) {
      setUserScore(0);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setUserScore(userData.score || 0);
      }
    }, (error) => {
      console.error('Error listening to user score:', error);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-spooky-gradient flex flex-col">
      <Header user={user} loading={loading} score={userScore} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Component {...pageProps} user={user} loading={loading} />
      </main>
      
      <Footer user={user} />
    </div>
  );
}