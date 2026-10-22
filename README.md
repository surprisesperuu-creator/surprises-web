# Surprises 🎁

Regalos boutique con auténtica esencia peruana. Detalles únicos y momentos
inolvidables para sorprender a quien más quieres.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- React
- TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- Supabase (PostgreSQL)
- Cloudinary
- [pnpm](https://pnpm.io)

## Scripts

```bash
pnpm dev    # servidor de desarrollo
pnpm build  # build de producción
pnpm start  # sirve el build de producción
pnpm lint   # análisis de código con ESLint
```

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key   # SOLO servidor

# Cloudinary (SOLO servidor)
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

`NEXT_PUBLIC_*` son públicas (van al navegador). Las claves secretas
(`SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`) solo se usan en el
servidor y jamás deben exponerse al cliente.

## Base de datos

Las migraciones están en `supabase/migrations/`. Incluyen:

- Tabla `categories` (slug UNIQUE, timestamps, `is_active` default `true`)
- Tabla `products` (`category_id` → FK a `categories`, `price >= 0`, timestamps)
- Relación `categories 1 ─── N products`
- Índices y trigger de `updated_at`
- RLS habilitado: el rol `anon` solo puede LEER elementos activos; las
  operaciones de escritura usan la service role key.

## API

Los Route Handlers devuelven siempre el mismo formato:

```jsonc
// éxito
{ "data": <resultado>, "error": null }

// error
{ "data": null, "error": { "code": "...", "message": "...", "details?": "..." } }
```

### Categorías

| Método | Ruta                    | Descripción                                   |
| ------ | ----------------------- | --------------------------------------------- |
| GET    | `/api/categories`       | Lista categorías                              |
| POST   | `/api/categories`       | Crea categoría (201)                          |
| GET    | `/api/categories/[id]`  | Obtiene categoría                             |
| PUT    | `/api/categories/[id]`  | Actualiza categoría                           |
| DELETE | `/api/categories/[id]`  | Elimina categoría (409 si tiene productos)    |

### Productos

| Método | Ruta                   | Descripción                                              |
| ------ | ---------------------- | -------------------------------------------------------- |
| GET    | `/api/products`        | Lista productos con su categoría (`?category_id=<uuid>`) |
| POST   | `/api/products`        | Crea producto (201)                                      |
| GET    | `/api/products/[id]`   | Obtiene producto con su categoría                        |
| PUT    | `/api/products/[id]`   | Actualiza producto                                       |
| DELETE | `/api/products/[id]`   | Elimina producto                                         |

### Códigos de estado

- `400` → datos inválidos (`VALIDATION_ERROR`)
- `404` → recurso inexistente (`NOT_FOUND`)
- `409` → conflicto (`CONFLICT`): slug duplicado o recurso en uso
- `500` → error interno (`INTERNAL_ERROR`)

## Arquitectura

```
src/
├── app/
│   └── api/
│       ├── categories/   # Route Handlers de categorías
│       └── products/     # Route Handlers de productos
├── lib/
│   ├── api/              # errores, respuestas y handler común
│   ├── supabase/         # clientes de Supabase (browser y server)
│   ├── cloudinary/       # integración backend de Cloudinary
│   └── validations/      # esquemas Zod
├── services/             # lógica de negocio (categorías y productos)
└── types/                # tipos de TypeScript
```

## Estructura

```
src/
├── app/          # rutas (root layout y páginas)
├── components/   # componentes (layout/, home/, ui/)
├── lib/          # utilidades y lógica compartida
└── types/        # tipos de TypeScript
```

## Identidad visual

| Rol        | Color      |
| ---------- | ---------- |
| Primary    | `#C1375D`  |
| Secondary  | `#7A1734`  |
| Background | `#FFF2F5`  |
| Accent     | `#F5BECC`  |
| Cream      | `#FFFAF7`  |
| Text       | `#41373A`  |
| White      | `#FFFFFF`  |

Los colores están disponibles como utilidades de Tailwind
(`bg-primary`, `text-text`, `bg-background`, …) y como variables CSS
(`--color-primary`, `--color-secondary`, …). Las fuentes se cargan con
`next/font`: Playfair Display (`--font-playfair`, utilidad `font-display`)
para títulos y destacados, e Inter (`--font-inter`, utilidad `font-sans`)
para textos, navegación y UI.

