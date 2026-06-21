# AeroLift eFoil Store

Next.js 15, Tailwind CSS, TypeScript, and Supabase storefront for a premium eFoil independent site. The project includes three customer-facing page types:

- Home: `/`
- Product list: `/efoils/lift-5f`, `/efoils/lift-5`, `/efoils/lift-x`
- Product detail: `/products/[slug]`

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The site runs without Supabase credentials by using fallback data from `src/lib/fallback-data.ts`. When Supabase variables are configured, the same UI reads from Supabase first.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Upload product and hero images to Supabase Storage.
4. Insert rows into `hero_slides`, `product_lines`, `products`, and `reviews`.
5. Store public image URLs in the `image`, `hero_images`, and `images` fields.

## Google Login

The `/login` page uses Google OAuth through Supabase Auth. The browser starts the OAuth flow only; Google passwords are never stored by this site. After authorization, `/auth/callback` reads the verified Supabase user session and syncs basic profile fields to `public.site_users`:

- Email
- Display name
- Avatar URL
- Provider

Configure Google as an OAuth provider in Supabase Auth, then add this redirect URL in both Supabase and Google Cloud:

```bash
http://localhost:3000/auth/callback
https://your-vercel-domain.com/auth/callback
```

Add `SUPABASE_SERVICE_ROLE_KEY` only in server environments such as `.env.local` and Vercel Environment Variables. Do not expose it in client-side code. Facebook login is reserved in `src/lib/auth-providers.ts` for later expansion.

Product detail page content is editable from the `products` table:

- Main title: `name`
- Subtitle: `summary`
- Price: `price_cents` and `currency`
- Description: `description`
- Color buttons: `color_options`
- Color image groups: `color_images`
- Details list: `details`
- Details section title: `detail_eyebrow`, `detail_title`
- Comparison section title: `comparison_eyebrow`, `comparison_title`
- Comparison parameters: `specs`

## Vercel Deployment

1. Push this project to a Git repository.
2. Import the repository in Vercel.
3. Set the framework preset to Next.js.
4. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel Project Settings.
5. Deploy.

Vercel will run `npm install` and `npm run build` automatically.
