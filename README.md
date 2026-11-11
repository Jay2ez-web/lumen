# LUMEN

LUMEN is a responsive entertainment hub for browser games, open-licensed video samples, mini apps, and a local chat prototype.

## Current prototype behavior

- Favorites, histories, notes, to-do items, watch progress, settings, and chat messages are stored in this browser using `localStorage`.
- Chat is labeled **Local demo** and is not synchronized between users.
- Video samples are open-animation works by the Blender Foundation under Creative Commons Attribution licensing. Game links open content from the listed providers; LUMEN does not host game files.
- Sign-in and cloud sync are intentionally not represented as working features yet.

## Connecting Supabase later

1. Create a Supabase project and connect it to the Vercel project through the Supabase integration. Keep credentials in the integration-managed environment; never commit keys or put a service-role key in browser code.
2. Enable Supabase Auth and add the deployed LUMEN origin and local development origin to the allowed redirect/site URL settings. Keep authentication checks on the server or use Supabase's supported session flow.
3. Create a `profiles` table keyed to `auth.users.id`, plus a `chat_messages` table with `id` (uuid), `user_id` (uuid), `body` (text with a length constraint), and `created_at` (timestamptz). Add a separate `chat_reports` table if report history needs persistence.
4. Enable Row Level Security on every user-owned table. Add policies so authenticated users can read messages, insert only rows where `user_id = auth.uid()`, and update/delete only their own records. Add rate limits and server-side moderation for chat; client checks are only a usability layer.
5. Enable Realtime for `chat_messages`. Subscribe only after the user is authenticated, render message bodies as text (never unsanitized HTML), and clean up the subscription when leaving the chat route.
6. Replace the `lumen-chat-messages` local demo store with authenticated Supabase reads/inserts and a Realtime subscription. Decide explicitly whether to offer an opt-in migration of each browser's local messages; localStorage data is not available to other devices.
7. Move notes, tasks, favorites, and watch progress to user-scoped tables only when account sync is implemented. Every query must be scoped to the authenticated user, and RLS must enforce the same boundary.

The current app intentionally has no Supabase client or backend dependency. Connect the integration and define its schema/policies before adding database code.
