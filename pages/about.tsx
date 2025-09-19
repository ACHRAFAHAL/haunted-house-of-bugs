import Head from 'next/head';
import Link from 'next/link';
import { User } from 'firebase/auth';

interface AboutPageProps {
  user?: User | null;
  loading?: boolean;
}

export default function AboutPage({ user, loading }: AboutPageProps) {
  return (
    <>
      <Head>
        <title>About - Haunted House of Bugs</title>
        <meta name="description" content="Learn about the Haunted House of Bugs project - an educational coding game that teaches debugging through spooky puzzles." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-shadow-black to-midnight-black">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-spooky-purple/20 to-spooky-green/20 border-b border-spooky-purple/30">
          <div className="absolute inset-0 bg-gradient-to-r from-spooky-purple/5 to-spooky-green/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-6xl mr-4">🏚️</span>
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-spooky-purple to-spooky-green">
                  Haunted House of Bugs
                </h1>
              </div>
              <p className="text-2xl text-spooky-green font-semibold mb-8">
                Escape the haunted house by debugging your way through 10 spooky coding puzzles!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/" 
                  className="px-6 py-3 bg-spooky-purple hover:bg-spooky-purple/80 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-spooky-purple/25"
                >
                  🏠 Enter the House
                </Link>
                {user && (
                  <Link 
                    href="/leaderboard" 
                    className="px-6 py-3 bg-spooky-green hover:bg-spooky-green/80 text-black rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-spooky-green/25"
                  >
                    🏆 View Leaderboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Project Description */}
          <div className="bg-shadow-black/50 border border-spooky-purple/30 rounded-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-spooky-purple mb-4">What is This Project?</h2>
            </div>
            <div className="space-y-4 text-lg text-gray-300">
              <p>
                <strong className="text-spooky-green">Haunted House of Bugs</strong> is an innovative educational game that combines the thrill of escape rooms with practical programming skills. Players navigate through a spooky haunted house, solving JavaScript debugging challenges to escape each room.
              </p>
              <p>
                This gamified learning experience makes debugging fun and engaging, turning what could be frustrating coding problems into exciting puzzles with a supernatural twist. Each room presents progressively challenging bugs that teach real-world debugging techniques.
              </p>
            </div>
          </div>

          {/* Purpose & Goal */}
          <div className="bg-shadow-black/50 border border-spooky-purple/30 rounded-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-spooky-purple mb-4">Purpose & Educational Goals</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-spooky-purple/10 border border-spooky-purple/30 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-spooky-purple mb-3">🧠 Problem</h3>
                  <p className="text-gray-300">
                    Traditional coding education can be dry and intimidating. Debugging especially is often seen as frustrating rather than a valuable skill to master.
                  </p>
                </div>
                <div className="bg-spooky-green/10 border border-spooky-green/30 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-spooky-green mb-3">🚀 Solution</h3>
                  <p className="text-gray-300">
                    Transform debugging into an adventure! By adding narrative, gamification, and a spooky theme, learning becomes engaging and memorable.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-spooky-purple/10 to-spooky-green/10 border border-spooky-purple/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-spooky-purple mb-4">🎓 Learning Outcomes</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
                  <li className="flex items-center"><span className="text-spooky-green mr-2">✓</span> JavaScript debugging skills</li>
                  <li className="flex items-center"><span className="text-spooky-green mr-2">✓</span> Problem-solving mindset</li>
                  <li className="flex items-center"><span className="text-spooky-green mr-2">✓</span> Code analysis abilities</li>
                  <li className="flex items-center"><span className="text-spooky-green mr-2">✓</span> Error pattern recognition</li>
                  <li className="flex items-center"><span className="text-spooky-green mr-2">✓</span> Logical thinking</li>
                  <li className="flex items-center"><span className="text-spooky-green mr-2">✓</span> Confidence in coding</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="bg-gradient-to-r from-spooky-purple/20 to-spooky-green/20 border border-spooky-purple/30 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-spooky-purple mb-4">Created by</h2>
            </div>
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-shadow-black/50 border border-spooky-purple/30 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-spooky-green mb-4">Achraf AHAL</h3>
                <p className="text-gray-300 text-lg mb-6">
                  A passionate developer who believes that learning to code should be both fun and effective.
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="https://github.com/ACHRAFAHAL" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    Visit GitHub Profile
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-spooky-purple/10 to-spooky-green/10 border border-spooky-purple/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-spooky-purple mb-4">Ready to Face Your Fears?</h3>
              <p className="text-gray-300 mb-6 text-lg">
                Step into the haunted house and prove your debugging skills. Will you escape with your code intact?
              </p>
              <Link 
                href="/" 
                className="inline-block px-8 py-4 bg-spooky-green hover:bg-spooky-green/80 text-black rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-spooky-green/25"
              >
                Enter the Haunted House
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}