# Haunted House of Bugs

> Solve code bugs, escape rooms, learn CS fundamentals.

An escape-room-style web application that teaches coding through debugging puzzles. Navigate through 10 themed rooms, solve coding challenges, and climb the leaderboard in this spooky programming adventure!

## Live Demo  

[Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/your-username/haunted-house-of-bugs) or follow the setup instructions below.

## Project Overview

**Target Audience**: Beginner to intermediate programmers  
**Learning Goals**: Debugging, problem-solving, JavaScript fundamentals  

### Core Features

- ✅ **Authentication**: Email + Google OAuth via Firebase
- ✅ **10 Themed Rooms**: Progressive difficulty with unique coding puzzles
- ✅ **Puzzle Types**: MCQ, Fill-in-the-blank, Fix-the-bug
- ✅ **Individual Room Timing**: Track time spent on each room separately
- ✅ **Real-time Scoring**: Points system with time bonuses and hint penalties
- ✅ **Global Leaderboard**: Rankings with total completion times
- ✅ **Responsive UI**: Tailwind CSS with custom spooky theme
- ✅ **Code Editor**: Monaco Editor integration for real coding experience
- ✅ **Hint System**: Progressive help with point penalties
- ✅ **Live Timer**: Real-time countdown during puzzle solving
- ✅ **Profile Management**: Track progress and room completion times

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS with custom spooky theme
- **Authentication**: Firebase Auth (Email + Google)
- **Database**: Firebase Firestore
- **Code Editor**: Monaco Editor (VS Code editor)
- **Deployment**: Vercel 
- **Development**: ESLint + Prettier


## Game Structure

### Rooms & Puzzles

The game features 10 progressively challenging rooms, each with unique coding puzzles:

| Room | Title | Type | Difficulty | Concepts |
|------|-------|------|------------|----------|
| 1 | Whispering Mirror | Fill Code | Easy | String manipulation |
| 2 | Clock of Off-By-One | Fix Bug | Medium | Array indexing |
| 3 | Ciphered Hallway | MCQ | Easy | Caesar cipher |
| 4 | Recursive Door | Fill Code | Hard | Recursion |
| 5 | Array Abyss | Fix Bug | Medium | Array methods |
| 6 | Object Altar | MCQ | Medium | Object properties |
| 7 | Function Phantoms | Fill Code | Hard | Higher-order functions |
| 8 | Loop Labyrinth | Fix Bug | Hard | Loop conditions |
| 9 | Async Apparition | MCQ | Hard | Async/await patterns |
| 10 | Final Nightmare | Fill Code | Expert | Complex algorithms |

### Scoring System
- **Base Points**: Each puzzle has a base point value (50-200 points)
- **Time Bonus**: Faster solutions earn bonus points
- **Hint Penalty**: -10 points per hint used
- **Total Time**: Sum of all individual room times for leaderboard ranking

## License

MIT License - see LICENSE file for details.



⚠️ **Important**: This is a hackathon MVP with client-side code execution. For production use:
**Happy Debugging!** 
