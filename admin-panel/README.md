# Admin Panel

A Next.js admin panel for managing users, projects, and MCPs with Clerk authentication and Supabase backend.

## Features

- 🔐 **Authentication**: Clerk integration for secure login
- 👥 **User Management**: Create and manage users with Clerk integration
- 📁 **Project Management**: Create projects and assign them to users
- 🔌 **MCP Management**: Manage MCP endpoints for projects
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS
- 📱 **Responsive**: Works on desktop and mobile

## Quick Setup

### 1. Environment Variables

Create a `.env.local` file with:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://romycydbrdtxxtqdnncj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvbXljeWRicmR0eHh0cWRubmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTA5ODEsImV4cCI6MjA3MDMyNjk4MX0.EB1TNHFPiRClE5GdnW84un_h2g0HijgHJccoLNms4Rw
```

### 2. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to your `.env.local` file

### 3. Run the Application

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the admin panel.

## Database Schema

The application connects to a Supabase database with the following tables:

- **users**: User management with Clerk integration
- **projects**: Projects belonging to users
- **mcp**: MCP endpoints for projects
- **bundles**: Collections of routes and MCPs
- **route**: Route definitions
- **deployments**: Deployment tracking with LangGraph/CrewAI support

## Usage

1. **Sign In**: Use Clerk authentication to access the admin panel
2. **Create Users**: Add new users (creates mock Clerk user IDs for demo)
3. **Create Projects**: Assign projects to users
4. **Create MCPs**: Add MCP endpoints to projects
5. **View Data**: Browse and manage all entities in the list views

## Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Clerk**: Authentication and user management
- **Supabase**: Backend database
- **shadcn/ui**: UI component library
- **Tailwind CSS**: Styling
- **React Hook Form**: Form handling
- **Zod**: Schema validation

## Development Notes

- User creation currently generates mock Clerk user IDs
- For production, integrate with Clerk's user creation API
- The Supabase database is already configured and ready to use
- All forms include proper validation and error handling
