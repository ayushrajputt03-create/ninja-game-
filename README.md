# 🥷 Number Ninja v2 — 100-Level Adaptive Math Mastery Game

A mobile-first, PWA-enabled math game with 100 levels across 10 worlds. Built entirely client-side — no backend, no database.

## Features
- **100 Levels** across 10 Worlds (10 topics × 10 levels each)
- **Adaptive Difficulty Engine** — adjusts question difficulty based on accuracy & speed
- **Spaced Repetition** — weak topics automatically reappear in future levels
- **Mastery-Based Unlock** — next level unlocks only after crossing mastery threshold
- **Boss Battles** — every 10th level is a boss fight
- **Daily Challenge** — date-seeded classroom warm-up (same questions for entire class)
- **Instant Explanations** — concept reinforcement on wrong answers
- **Certificate Generator** — downloadable PNG/PDF mastery certificates
- **PWA** — installable on iOS & Android home screens
- **100% Client-Side** — localStorage only, zero server dependency

## Tech Stack
- React + Vite
- Tailwind CSS (CDN)
- Custom CSS Design System (`ninja.css`)
- Web Audio API (no external audio files)
- Canvas API (certificate generation)
- localStorage (progress persistence)

## Run Locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## License
MIT
