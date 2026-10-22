import { z } from "zod";

/**
 * Tope superior para `price`: coincide con `numeric(12, 2)` de la BD
 * (12 dígitos, 2 decimales) para evitar errores de desbordamiento.
 */
const MAX_PRICE = 9999999999.99;

/**
 * Payload para CREAR un producto.
 * - category_id obligatorio (debe existir; se valida contra la BD)
 * - name obligatorio
 * - price obligatorio y >= 0
 * - image_url opcional
 * - is_active opcional (la BD aplica DEFAULT true)
 */
export const createProductSchema = z.object({
  category_id: z.uuid("category_id debe ser un UUID válido"),
  name: z
    .string({ error: "El nombre es obligatorio" })
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(200, "El nombre no puede superar los 200 caracteres"),
  price: z
    .number({ error: "El precio debe ser un número" })
    .min(0, "El precio debe ser mayor o igual a 0")
    .max(MAX_PRICE, "El precio es demasiado alto"),
  image_url: z
    .url("image_url debe ser una URL válida")
    .nullable()
    .optional(),
  is_active: z
    .boolean({ error: "is_active debe ser un valor booleano" })
    .optional(),
});

/**
 * Payload para ACTUALIZAR un producto.
 * Todos los campos son opcionales, pero al menos uno debe enviarse.
 */
export const updateProductSchema = createProductSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "No se envió ningún campo para actualizar"
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
