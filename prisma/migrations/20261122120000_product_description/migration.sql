-- Descripción opcional de cada producto (se muestra en la ficha de la tienda).
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "description" TEXT;
