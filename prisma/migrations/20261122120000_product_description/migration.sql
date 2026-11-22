-- Descripción opcional de cada producto (se muestra en la ficha de la tienda).
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "description" TEXT;

-- Fotos adicionales de cada producto (galería de la ficha), además de image_url.
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
