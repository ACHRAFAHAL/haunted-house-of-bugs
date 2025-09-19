import { useState, useEffect, useRef } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';

interface HeaderProps {
  user?: User | null;
  loading?: boolean;
  score?: number;
}

export default function Header({ user, loading, score = 0 }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!mounted) return null;

  return (
    <header className="bg-shadow-black border-b border-spooky-purple/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <h1 className="text-xl font-bold text-spooky-purple group-hover:text-spooky-green transition-colors">
              Haunted House of Bugs
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-auto mr-5">
            {user && (
              <Link 
                href="/leaderboard" 
                className="text-gray-300 hover:text-spooky-green transition-colors"
              >
                Leaderboard
              </Link>
            )}
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-spooky-green transition-colors"
            >
              About
            </Link>
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 hover:bg-spooky-purple/20 rounded-lg p-2 transition-colors"
                >
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      {user.displayName || 'Anonymous Ghost'}
                    </div>
                    <div className="text-spooky-green font-bold">
                      Score: {score}
                    </div>
                  </div>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-spooky-purple"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-spooky-purple rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(user.displayName || 'A')[0].toUpperCase()}
                    </div>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-shadow-black border border-spooky-purple/30 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-spooky-purple/20">
                      <div className="text-sm text-gray-300">Signed in as</div>
                      <div className="font-semibold text-spooky-green">{user.displayName || 'Anonymous Ghost'}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                    <div className="p-2">
                      <Link 
                        href="/leaderboard"
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-spooky-purple/20 rounded-md transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        View Leaderboard
                      </Link>
                      <Link 
                        href="/about"
                        className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-spooky-purple/20 rounded-md transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        About Project
                      </Link>
                      <hr className="my-2 border-spooky-purple/20" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile menu button */}
            <button className="md:hidden text-gray-300 hover:text-spooky-green">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}