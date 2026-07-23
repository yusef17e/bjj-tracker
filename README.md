# BJJ Tracker MVP

A mobile-first Brazilian Jiu-Jitsu training tracker for tracking partners, sessions, and statistics.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

**If you see `Error: spawn EPERM` on Windows:** the dev server spawns a child process (Turbopack) which can be blocked by sandboxes or antivirus. Try: (1) run `npm run dev` from a normal PowerShell/CMD outside Cursor, (2) run `npm run dev:clean` to clear the `.next` folder first, or (3) temporarily allow the project folder in your antivirus.

Visit [http://localhost:3000](http://localhost:3000)

## Features

- **Partners Management**: Add and track training partners with belt ranks
- **Session Logging**: Record training sessions with multiple rounds
- **Statistics Dashboard**: View weekly and overall performance metrics
- **Mobile-First**: Optimized for phone screens with dark mode support

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Prisma 5 + SQLite
- No authentication (single-user local app)

## Database Commands

```bash
# Reset database
npx prisma migrate reset

# Seed sample data
node --env-file=.env prisma/seed.mjs

# View database
npx prisma studio
```

## Routes

- `/dashboard` - Main dashboard with statistics
- `/partners` - List all partners
- `/partners/[id]` - Partner details and history
- `/sessions/new` - Log a new training session

## Project Structure

```
src/
├── actions/        # Server actions
├── app/            # Next.js pages
├── components/     # React components
└── lib/            # Utilities (Prisma client)

prisma/
├── schema.prisma   # Database schema
├── migrations/     # Database migrations
└── seed.mjs        # Seed script
```

## License

MIT
