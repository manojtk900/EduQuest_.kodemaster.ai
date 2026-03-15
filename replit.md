# Workspace

## Overview

EduQuest – Gamified Education Platform. A full-stack web app that turns learning into a game for undergraduate students with XP points, levels, badges, missions, leaderboard, and AI-based course recommendations.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/eduquest) at path `/`
- **API framework**: Express 5 (artifacts/api-server) at path `/api`
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Confetti**: canvas-confetti

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (port auto-assigned, path /api)
│   └── eduquest/           # React + Vite frontend (path /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
```

## EduQuest Features

- **Auth System**: JWT-based login/signup (stored in localStorage as `eduquest_token`)
- **Gamification Engine**: XP system, level progression (Beginner/Explorer/Hacker/Master), badges
- **Missions**: 15 seeded learning missions (quizzes, lessons, projects) across Python, AI, Data Science categories
- **Leaderboard**: Top users sorted by XP with rank medals
- **Daily Login**: +5 XP per day, streak bonuses (3-day = +20 XP, 7-day = +50 XP)
- **Badges**: Quiz Master, Fast Learner, AI Explorer, 7 Day Streak
- **AI Recommendations**: XP-based course suggestions
- **Analytics**: XP progress charts in profile page

## Database Schema (lib/db/src/schema/)

- `users` — id, username, password (hashed), xp, level, streak, last_login_date, badges (JSON), created_at
- `missions` — id, title, description, type, xp_reward, category, difficulty
- `user_missions` — id, user_id, mission_id, completed_at

## API Routes (artifacts/api-server/src/routes/)

- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Login
- `GET /api/users/me` — Get current user (auth required)
- `POST /api/users/daily-login` — Record daily login & award XP (auth required)
- `GET /api/missions` — All missions with completion status (auth required)
- `POST /api/missions/:id/complete` — Complete a mission (auth required)
- `GET /api/leaderboard` — Top 20 users by XP (auth required)
- `GET /api/recommendations` — AI course recommendations based on XP (auth required)

## XP & Level System

- Level 1 Beginner: 0–99 XP
- Level 2 Explorer: 100–299 XP
- Level 3 Hacker: 300–699 XP
- Level 4 Master: 700+ XP

## Mission XP Rewards

- Quiz completion: 20 XP
- Lesson completion: 10 XP
- Project completion: 50 XP
- Daily login: 5 XP
