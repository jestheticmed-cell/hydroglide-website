create table if not exists public.hero_slides (
  id text primary key,
  image text not null,
  eyebrow text not null,
  title text not null,
  copy text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.product_lines (
  id text primary key,
  slug text not null unique check (slug in ('lift-5f', 'lift-5', 'lift-x')),
  name text not null,
  eyebrow text not null,
  tagline text not null,
  description text not null,
  hero_images text[] not null default '{}',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  line_slug text not null references public.product_lines(slug),
  name text not null,
  price_cents integer not null,
  currency text not null default 'USD',
  summary text not null,
  description text not null,
  images text[] not null default '{}',
  color_options text[] not null default '{}',
  color_images jsonb not null default '{}'::jsonb,
  details text[] not null default '{}',
  detail_eyebrow text default 'Product Details',
  detail_title text default 'Built for refined electric flight.',
  comparison_eyebrow text default 'Series Comparison',
  comparison_title text default 'Compare models in this series.',
  specs jsonb not null default '{}'::jsonb,
  is_best_seller boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key,
  author_name text not null,
  location text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text,
  display_name text,
  avatar_url text,
  provider text not null default 'google' check (provider in ('google', 'facebook', 'email')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hero_slides enable row level security;
alter table public.product_lines enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.site_users enable row level security;

create policy "Public read active hero slides"
  on public.hero_slides for select
  using (is_active = true);

create policy "Public read active product lines"
  on public.product_lines for select
  using (is_active = true);

create policy "Public read published products"
  on public.products for select
  using (status = 'published');

create policy "Public read active reviews"
  on public.reviews for select
  using (is_active = true);

create policy "Users can read own profile"
  on public.site_users for select
  using (auth.uid() = auth_user_id);
