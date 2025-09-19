import Link from 'next/link';
import { User } from 'firebase/auth';

interface FooterProps {
  user?: User | null;
}

export default function Footer({ user }: FooterProps) {
  return (
    <footer className="bg-shadow-black border-t border-spooky-purple/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 Haunted House of Bugs. Built for hackathon fun!
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {user && (
              <Link 
                href="/leaderboard" 
                className="text-gray-500 hover:text-spooky-green transition-colors text-sm"
              >
                Leaderboard
              </Link>
            )}
            <Link 
              href="/about" 
              className="text-gray-500 hover:text-spooky-green transition-colors text-sm"
            >
              About
            </Link>
            <span className="text-gray-500 text-sm">
              ⚠️ Code runs in browser sandbox only
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}