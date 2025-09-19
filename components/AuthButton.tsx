import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

interface AuthButtonProps {
  user: User | null;
  loading: boolean;
}

export default function AuthButton({ user, loading }: AuthButtonProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      setError(error.message || 'Google authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message || 'Sign out failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-spooky-purple"></div>
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <button
        onClick={handleSignOut}
        className="bg-spooky-purple hover:bg-spooky-purple/80 text-white px-3 py-2 rounded-lg transition-colors text-sm"
      >
        Sign Out
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Google Sign In */}
      <button
        onClick={handleGoogleAuth}
        disabled={authLoading}
        className="w-64 mx-auto bg-white hover:bg-gray-100 text-gray-900 px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Email/Password Form */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-shadow-black text-gray-400">or</span>
        </div>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-eerie-gray border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-spooky-purple focus:outline-none"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-eerie-gray border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-spooky-purple focus:outline-none"
          />
        </div>
        
        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <div>
          <button
            type="submit"
            disabled={authLoading}
            className="w-64 mx-auto bg-spooky-purple hover:bg-spooky-purple/80 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            {authLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-64 mx-auto text-spooky-green hover:text-spooky-green/80 text-xs transition-colors py-1"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}