-- ============================================================
-- Surprises — Hero del Home (carrusel administrable)
-- Tabla hero_slides: imágenes de fondo del Hero principal
-- Orden: sort_order asc, created_at desc
-- ============================================================

create table if not exists public.hero_slides (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(trim(title)) > 0),
  image_url   text not null check (char_length(trim(image_url)) > 0),
  sort_order  integer not null default 0 check (sort_order >= 0),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.hero_slides is 'Imágenes del carrusel Hero del Home principal de Surprises';
comment on column public.hero_slides.title is 'Nombre de referencia en el Admin; también se usa como alt de la imagen.';
comment on column public.hero_slides.sort_order is 'Orden de aparición en el carrusel (menor aparece primero).';

create index if not exists idx_hero_slides_is_active on public.hero_slides (is_active);
create index if not exists idx_hero_slides_sort_order on public.hero_slides (sort_order);

-- updated_at automático (reusa la función public.set_updated_at() de la migración inicial)
create trigger hero_slides_set_updated_at
before update on public.hero_slides
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security (igual que categorías/productos):
-- escrituras con service role key (bypassa RLS),
-- el rol anon solo puede LEER slides activos (Home público).
-- ------------------------------------------------------------

alter table public.hero_slides enable row level security;

create policy "hero_slides_public_read"
on public.hero_slides
for select
to anon
using (is_active = true);
