# IT Unit Ledger

Accomplishment tracking system for COA Regional Office No. XIII's IT Unit.

## Overview

A Next.js + Supabase + Vercel application for logging and reporting IT unit accomplishments. Staff members can log their daily accomplishments, which are automatically consolidated into weekly, monthly, quarterly, and yearly reports.

## Features

- **Log Entry**: Staff members log accomplishments with date, category, and description
- **All Entries**: Searchable, filterable view of all logged accomplishments
- **Reports**: Period-based rollups (week/month/quarter/year) with:
  - Total accomplishments and staff participation counts
  - By-staff breakdown with visual charts
  - By-category breakdown with metrics
  - CSV export for IPCR/OPCR reporting

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Hosting**: Vercel
- **Auth**: Supabase Auth (email/password)

## Setup

### Prerequisites

- Node.js 18+
- Supabase account and project
- GitHub account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/coaro13-itu-kpr/COARO13_ITU_Accomplishment.git
   cd COARO13_ITU_Accomplishment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://jgjmkatwrkrgntewicrg.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_oMISXEatdFymCR7Xt1ZZoA_nnO1ucsH
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_kaPID9Z4bgjQUeegjgmtXA_Wy33lVAr
   ```

4. **Run database migrations**

   Option A: Using Supabase CLI locally
   ```bash
   supabase start
   supabase db push
   ```

   Option B: Via Supabase Dashboard
   - Go to your Supabase project SQL editor
   - Copy and run the contents of `supabase/migrations/001_accomplishments.sql`

5. **Create users in Supabase Auth**
   - Go to your Supabase project's Auth section
   - Create user accounts for IT staff (email/password)

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import this GitHub repository
   - Add environment variables from `.env.local`
   - Deploy

3. **Verify Deployment**
   - Set up a custom domain if needed
   - Test sign-in and accomplishment logging
   - Verify real-time sync across users

## Database Schema

### `accomplishments` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `staff_name` | text | Name of staff member |
| `accomplishment_date` | date | Date of accomplishment |
| `category` | text | Category from predefined list |
| `description` | text | Details of accomplishment |
| `user_id` | uuid | Foreign key to auth user |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Record update time |

### Categories

- Systems Development & Maintenance
- Network & Infrastructure
- Hardware & Technical Support
- Software Installation & Troubleshooting
- Data Management & Reporting
- Cybersecurity
- Website & Portal Management
- ICT Training & Capacity Building
- Documentation
- Meetings & Coordination
- Other

## Row-Level Security (RLS)

- All authenticated users can **view** all accomplishments
- Users can only **insert/update/delete** their own accomplishments
- Staff members log their own records; head can view/report on all

## Usage

### For Staff

1. Sign in with email/password
2. Go to "Log Entry" tab
3. Fill in:
   - Your name
   - Date of accomplishment
   - Category
   - Description
4. Click "Log accomplishment"
5. View all entries in "All Entries" tab

### For Head/Admin

1. Sign in
2. View "All Entries" to see team's work
3. Use "Reports" to generate period-based rollups
4. Export CSV for IPCR/OPCR submission

## Development Notes

- The app uses Supabase's real-time subscriptions, so changes sync across users instantly
- Auth state is managed via Supabase auth cookies
- Middleware enforces auth on all routes except `/sign-in` and `/auth/callback`
- All queries respect Row-Level Security policies

## Troubleshooting

**Sign-in not working**: Verify user exists in Supabase Auth
**Real-time sync not working**: Check Supabase Realtime is enabled in your project settings
**Build errors**: Run `npm install` and check Node.js version is 18+
**Database connection error**: Verify `.env.local` has correct Supabase credentials

## Contact

For questions or issues, contact the IT Unit or submit an issue on GitHub.
