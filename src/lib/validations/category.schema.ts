import { z } from "zod";

/**
 * Slug legible para URLs: minúsculas, números y guiones.
 */
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Payload para CREAR una categoría.
 * - name obligatorio
 * - slug obligatorio y único (la unicidad se valida además en la BD)
 * - description / image_url opcionales
 * - is_active opcional (la BD aplica DEFAULT true)
 */
export const createCategorySchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio" })
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  slug: z
    .string({ error: "El slug es obligatorio" })
    .trim()
    .min(1, "El slug es obligatorio")
    .max(100, "El slug no puede superar los 100 caracteres")
    .regex(
      slugRegex,
      "El slug solo puede contener minúsculas, números y guiones"
    ),
  description: z
    .string({ error: "La descripción debe ser un texto" })
    .trim()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .nullable()
    .optional(),
  image_url: z
    .url("image_url debe ser una URL válida")
    .nullable()
    .optional(),
  is_active: z
    .boolean({ error: "is_active debe ser un valor booleano" })
    .optional(),
});

/**
 * Payload para ACTUALIZAR una categoría.
 * Todos los campos son opcionales, pero al menos uno debe enviarse.
 */
export const updateCategorySchema = createCategorySchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "No se envió ningún campo para actualizar"
  );

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
