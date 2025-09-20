# Haunted House of Bugs

> Solve code bugs, escape rooms, learn CS fundamentals.

An escape-room-style web application that teaches coding through debugging puzzles. Navigate through 10 themed rooms, solve coding challenges, and climb the leaderboard in this spooky programming adventure!

## Live Demo  

Deployed with Vercel, [GO try it](haunted-house-of-bugs.vercel.app)

## Project Overview

**Target Audience**: Beginner to intermediate programmers  
**Learning Goals**: Debugging, problem-solving, JavaScript fundamentals  

## Project structure
```
App
├── Header
│   ├── Navigation Links
│   ├── User Menu Dropdown
│   └── Score Display
├── Main Content
│   ├── Home Page
│   │   ├── Auth Form (if not logged in)
│   │   ├── Game Dashboard (if logged in)
│   │   └── Leaderboard Sidebar
│   ├── Room Pages
│   │   ├── Live Timer
│   │   ├── PuzzleRenderer
│   │   │   ├── EditorPuzzle (for code challenges)
│   │   │   └── MCQPuzzle (for multiple choice)
│   │   └── Completion Modal
│   ├── About Page
│   └── Leaderboard Page
├── Footer
│   └── Site Links
└── BackgroundMusic
    └── Audio Controls
```

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

## Tech Stack

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

| Room | Title | Type | Concepts |
|------|-------|------|----------|
| 1 | Whispering Mirror | Fill Code | String manipulation |
| 2 | Clock of Off-By-One | Fix Bug | Array indexing |
| 3 | Ciphered Hallway | MCQ | Caesar cipher |
| 4 | Recursive Door | Fill Code | Recursion |
| 5 | Array Abyss | Fix Bug | Array methods |
| 6 | Object Altar | MCQ | Object properties |
| 7 | Function Phantoms | Fill Code | Higher-order functions |
| 8 | Loop Labyrinth | Fix Bug | Loop conditions |
| 9 | Async Apparition | MCQ | Async/await patterns |
| 10 | Final Nightmare | Fill Code | Complex algorithms |

### Scoring System
- **Base Points**: Each puzzle has a base point value (50-200 points)
- **Time Bonus**: Faster solutions earn bonus points
- **Hint Penalty**: -10 points per hint used
- **Total Time**: Sum of all individual room times for leaderboard ranking

## License

MIT License - see LICENSE file for details.



⚠️ **Important**: This is a hackathon MVP with client-side code execution.
**Happy Debugging!** 
