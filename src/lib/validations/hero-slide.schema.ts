import { z } from "zod";

/**
 * Payload para CREAR una imagen del Hero.
 * - title obligatorio (referencia en el Admin y alt de la imagen)
 * - image_url obligatoria (se sube a Cloudinary con ImageField folder="hero")
 * - sort_order opcional (la BD aplica DEFAULT 0; menor aparece primero)
 * - is_active opcional (la BD aplica DEFAULT true)
 */
export const createHeroSlideSchema = z.object({
  title: z
    .string({ error: "El título es obligatorio" })
    .trim()
    .min(1, "El título es obligatorio")
    .max(100, "El título no puede superar los 100 caracteres"),
  image_url: z
    .string({ error: "La imagen es obligatoria" })
    .trim()
    .min(1, "La imagen es obligatoria")
    .url("image_url debe ser una URL válida"),
  sort_order: z
    .number({ error: "El orden debe ser un número" })
    .int("El orden debe ser un número entero")
    .min(0, "El orden debe ser mayor o igual a 0")
    .max(9999, "El orden es demasiado alto")
    .optional(),
  is_active: z
    .boolean({ error: "is_active debe ser un valor booleano" })
    .optional(),
});

/**
 * Payload para ACTUALIZAR una imagen del Hero.
 * Todos los campos son opcionales, pero al menos uno debe enviarse.
 */
export const updateHeroSlideSchema = createHeroSlideSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "No se envió ningún campo para actualizar"
  );

export type CreateHeroSlideInput = z.infer<typeof createHeroSlideSchema>;
export type UpdateHeroSlideInput = z.infer<typeof updateHeroSlideSchema>;
