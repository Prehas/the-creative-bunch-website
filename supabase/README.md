# Supabase setup notes

Local demo mode is enabled by default in `supabase-config.js`.

When we are ready for real auth/database:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Copy the Project URL and anon public key into `supabase-config.js`.
4. Set `demoMode: false`.
5. Create the admin user with `scripts/create-admin-user.ps1` using environment variables.

Never commit the Supabase service role key or admin password.
