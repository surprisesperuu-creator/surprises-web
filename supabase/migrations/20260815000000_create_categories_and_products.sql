-- ============================================================
-- Surprises — Fase 1 del backend
-- Migración inicial: tablas categories y products
-- Relación: categories 1 ─── N products
-- ============================================================

-- gen_random_uuid() está disponible en Postgres 13+ (core).
-- Se asegura por compatibilidad con versiones anteriores.
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- TABLA categories
-- ------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(trim(name)) > 0),
  slug        text not null unique check (slug = lower(slug)),
  description text,
  image_url   text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.categories is 'Categorías de productos de Surprises';
comment on column public.categories.slug is 'Identificador único y legible para la URL. UNIQUE.';

-- ------------------------------------------------------------
-- TABLA products
-- ------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  name        text not null check (char_length(trim(name)) > 0),
  price       numeric(12, 2) not null check (price >= 0),
  image_url   text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.products is 'Productos simples de Surprises';

-- ------------------------------------------------------------
-- Índices
-- ------------------------------------------------------------
-- Búsqueda de productos por categoría (FK)
create index if not exists idx_products_category_id on public.products (category_id);
-- Filtro por estado activo (listados públicos y del admin)
create index if not exists idx_categories_is_active on public.categories (is_active);
create index if not exists idx_products_is_active on public.products (is_active);

-- ------------------------------------------------------------
-- updated_at automático
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
-- Todas las operaciones de escritura del Admin usan la service role key
-- (bypassa RLS). El rol anon solo puede LEER elementos activos:
-- suficiente para el futuro frontend público.

alter table public.categories enable row level security;
alter table public.products enable row level security;

create policy "categories_public_read"
on public.categories
for select
to anon
using (is_active = true);

create policy "products_public_read"
on public.products
for select
to anon
using (is_active = true);
