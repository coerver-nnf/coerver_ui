# Coerver Coaching Croatia

## Stack
- **Framework**: Next.js 14 (App Router)
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Supabase
- **URL**: `https://cshwyyvwwzzntmzzirja.supabase.co`
- **Schema**: `supabase/migrations/001_admin_panel_schema.sql`
- **RLS**: Enabled on all tables. Users can only read own profile.

## Auth Flow
- Login at `/prijava` using Supabase auth
- Roles: `admin`, `coach`, `player`
- Coaches/admins redirect to `/dashboard`, players blocked
- `/dashboard` routes to role-specific dashboard

## Key Routes
- `/` - Public homepage
- `/prijava` - Login
- `/dashboard/trener` - Coach dashboard (exercises)
- `/dashboard/admin` - Admin panel (full CRUD)
- `/za-igrace/*` - Player programs (camps, academies)
- `/za-trenere/*` - Coach courses

## Structure
```
src/
├── app/           # Next.js pages
├── components/    # React components
├── hooks/         # useAuth
├── lib/
│   ├── api/       # Supabase queries (client-side)
│   └── supabase/  # Client, server, middleware
└── types/         # TypeScript interfaces
```

## GitHub
- **Repo**: `coerver-nnf/coerver_ui`

## Notes
- ESLint disabled in build (next.config.mjs) - has unused variable warnings
- Admin RLS uses simple policy (no recursion): users read own profile only
