import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import Leaderboard from '../components/Leaderboard';

export default function LeaderboardPage() {
  const [user] = useAuthState(auth);

  return (
    <>
      <Head>
        <title>Leaderboard - Haunted House of Bugs</title>
        <meta name="description" content="See who escaped the haunted house fastest! View the leaderboard of top coders." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-shadow-black to-midnight-black">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-spooky-purple/20 to-spooky-green/20 border-b border-spooky-purple/30">
          <div className="absolute inset-0 bg-gradient-to-r from-spooky-purple/5 to-spooky-green/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-spooky-purple to-spooky-green">
                  Leaderboard
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                See who escaped the haunted house fastest! The bravest coders who conquered all 10 spooky debugging challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/" 
                  className="px-6 py-3 bg-spooky-purple hover:bg-spooky-purple/80 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-spooky-purple/25"
                >
                 🏠 Back to House
                </Link>
                <Link 
                  href="/about" 
                  className="px-6 py-3 bg-spooky-green hover:bg-spooky-green/80 text-black rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-spooky-green/25"
                >
                 📖 About Project
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-shadow-black/50 border border-spooky-purple/30 rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-lg font-semibold text-spooky-purple mb-1">Challenge</h3>
              <p className="text-gray-400 text-sm">Debugging Puzzles</p>
            </div>
            <div className="bg-shadow-black/50 border border-spooky-purple/30 rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-spooky-purple mb-1">Speed Matters</h3>
              <p className="text-gray-400 text-sm">Fastest completion wins</p>
            </div>
            <div className="bg-shadow-black/50 border border-spooky-purple/30 rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="text-lg font-semibold text-spooky-purple mb-1">Skills Tested</h3>
              <p className="text-gray-400 text-sm">JavaScript & Debugging</p>
            </div>
          </div>

          {/* Leaderboard Component */}
          <div className="bg-shadow-black/50 border border-spooky-purple/30 rounded-lg p-6">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-2xl font-bold text-spooky-purple">Hall of Fame</h2>
            </div>
            <Leaderboard />
          </div>

          {/* Call to Action */}
          {!user && (
            <div className="mt-12 text-center bg-gradient-to-r from-spooky-purple/20 to-spooky-green/20 border border-spooky-purple/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-spooky-purple mb-4">Ready to Join the Leaderboard?</h3>
              <p className="text-gray-300 mb-6">Sign up and start your spooky coding adventure!</p>
              <Link 
                href="/" 
                className="inline-block px-8 py-4 bg-spooky-green hover:bg-spooky-green/80 text-black rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-spooky-green/25"
              >
                Start Your Adventure 🚀
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}