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
  primary_category text not null default 'efoils' check (primary_category in ('efoils', 'foils')),
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

alter table public.products
  add column if not exists primary_category text not null default 'efoils';

alter table public.products
  drop constraint if exists products_primary_category_check;

alter table public.products
  add constraint products_primary_category_check check (primary_category in ('efoils', 'foils'));

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

create table if not exists public.site_content (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
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

create table if not exists public.support_conversations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null default 'Guest',
  customer_email text,
  subject text not null default 'Live chat message',
  status text not null default 'open' check (status in ('open', 'pending', 'archived')),
  unread_count integer not null default 0,
  last_message text not null default '',
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  sender text not null check (sender in ('user', 'support', 'system')),
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.hero_slides enable row level security;
alter table public.product_lines enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.site_content enable row level security;
alter table public.site_users enable row level security;
alter table public.support_conversations enable row level security;
alter table public.support_messages enable row level security;

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

create policy "Public read site content"
  on public.site_content for select
  using (true);

create policy "Users can read own profile"
  on public.site_users for select
  using (auth.uid() = auth_user_id);

insert into public.site_content (key, content)
values (
  'home',
  '{
    "hero": {
      "videoSrc": "/videos/website-video.mp4",
      "title": "Glide Every Water Moment",
      "copy": "The all-in-one efoil, glide effortlessly above waves, your ultimate gear for every water adventure"
    },
    "productLines": {
      "title": "EFOIL LINE",
      "copy": "From leisurely floating to fast precise carving, EFOIL LINE creates rides tailored to every rider.\nEngineered for seamless glide, our complete eFoil range turns every water surface into your playground.",
      "featuredProductSlugs": {
        "lift-5f": "lift-5f-cruiser",
        "lift-5": "lift-5-carbon",
        "lift-x": "lift-x-pro"
      },
      "heroVideos": {
        "lift-5f": "/videos/lift5F.mp4"
      }
    },
    "bestSellers": {
      "title": "BEST SELLERS",
      "copy": "Our crowd-favorite efoils trusted by riders worldwide.\nBalanced stability and thrilling performance in every bestselling board.",
      "productSlugs": ["lift-5f-cruiser", "lift-5-carbon", "lift-x-pro"]
    },
    "reviews": {
      "title": "REVIEWS",
      "copy": "Authentic feedback from thousands of efoil riders worldwide.\nEvery five-star review speaks to smooth glides and reliable performance."
    }
  }'::jsonb
)
on conflict (key) do nothing;
