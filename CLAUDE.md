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
- `/` - Public homepage (BlogSection fetches from Supabase)
- `/prijava` - Login
- `/dashboard/trener` - Coach dashboard (exercises)
- `/dashboard/admin` - Admin panel (full CRUD for camps, academies, courses, posts)
- `/za-igrace/kampovi` - Camps listing (fetches from Supabase, shows empty state if none)
- `/za-igrace/kampovi/[slug]` - Camp detail page (fetches by slug)
- `/za-igrace/akademije` - Academies listing (fetches from Supabase)
- `/za-trenere` - Courses overview (static pathway, always shows 3 course types)
- `/za-trenere/coerver-intro` - Course detail (fetches upcoming dates from Supabase)
- `/za-trenere/youth-diploma-1` - Course detail (fetches upcoming dates from Supabase)
- `/za-trenere/youth-diploma-2` - Course detail (fetches upcoming dates from Supabase)
- `/blog` - Blog listing (fetches posts from Supabase)

## Structure
```
src/
├── app/           # Next.js pages
├── components/    # React components
│   ├── home/      # Homepage sections (BlogSection fetches posts)
│   └── admin/     # Admin components (forms with JsonArrayEditors)
├── hooks/         # useAuth
├── lib/
│   ├── api/       # Supabase queries (camps, academies, courses, posts)
│   └── supabase/  # Client, server, middleware
└── types/         # TypeScript interfaces
```

## Database Tables
- **camps**: Extended with JSONB fields (daily_schedule, weekly_program, included, faq, testimonials), TEXT[] for highlights/what_to_bring/age_groups
- **academies**: Has schedule (TEXT) and age_groups (TEXT[])
- **courses**: Has type enum (coerver-intro, youth-diploma-1, youth-diploma-2)
- **posts**: Blog posts with status (draft/published/archived), category relation

## API Functions (src/lib/api/)
- `camps.ts`: getCamps, getCampBySlug, createCamp, updateCamp (supports JSONB fields)
- `academies.ts`: getAcademies, getAcademyById, createAcademy, updateAcademy
- `courses.ts`: getCourses (filters by type, status, upcoming), getCourseBySlug
- `posts.ts`: getPosts, getPostBySlug, getBlogCategories

## Admin Forms
- Camp edit: Full form with JsonArrayEditors for daily_schedule, weekly_program, included, faq, testimonials
- Academy edit: Includes schedule textarea and ArrayInput for age_groups
- Courses: Standard CRUD in admin panel

## Public Pages Data Flow
- All public listing pages fetch from Supabase with status filters (published/active)
- Show loading spinners during fetch
- Show empty state messages when no data ("Trenutno nema...")
- Course detail pages fetch upcoming courses by type

## GitHub
- **Repo**: `coerver-nnf/coerver_ui`

## Notes
- ESLint disabled in build (next.config.mjs) - has unused variable warnings
- Admin RLS uses simple policy (no recursion): users read own profile only
- Migrations: 003_camps_extended_fields.sql, 004_academies_age_groups.sql
