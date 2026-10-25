# Surprises 🎁

Regalos boutique con auténtica esencia peruana. Detalles únicos y momentos
inolvidables para sorprender a quien más quieres.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- React
- TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Prisma ORM](https://www.prisma.io/orm) con Prisma Postgres
- Cloudinary
- [pnpm](https://pnpm.io)

## Scripts

```bash
pnpm dev    # servidor de desarrollo
pnpm build  # build de producción
pnpm start  # sirve el build de producción
pnpm lint   # análisis de código con ESLint
pnpm db:generate        # genera Prisma Client
pnpm db:migrate:status  # consulta el estado (requiere DIRECT_URL)
```

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores.

```bash
# Prisma Postgres: copiar ambas conexiones desde Prisma Console.
# Usar la URL pooled para la aplicación y la URL directa para migraciones.
DATABASE_URL=postgresql://USER:PASSWORD@pooled.db.prisma.io:5432/postgres?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@db.prisma.io:5432/postgres?sslmode=require

# Cloudinary (SOLO servidor)
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# Acceso al panel de administración (solo servidor)
ADMIN_EMAIL=tu-correo-de-administracion
ADMIN_PASSWORD=una-contrasena-larga-y-unica
ADMIN_SESSION_SECRET=secreto-aleatorio-de-al-menos-32-caracteres
```

Las conexiones de base de datos y `CLOUDINARY_API_SECRET` solo se usan en el
servidor; nunca deben llevar el prefijo `NEXT_PUBLIC_` ni exponerse al cliente.
En desarrollo, configura estos valores en `.env.local`. Reemplaza los
marcadores con las conexiones generadas en Prisma Console; no reutilices la
URL de Supabase como destino.

Configura también `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET` en
`.env.local` antes de iniciar sesión. Genera un secreto aleatorio con
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` y
usa una contraseña única. No compartas estos valores ni los subas al repositorio.
En producción, configúralos como variables privadas del proveedor de hosting.
El panel y las operaciones de escritura requieren una cookie de sesión firmada;
las consultas públicas de la tienda siguen disponibles sin iniciar sesión.

## Base de datos

El esquema y las migraciones nuevas están en `prisma/`. La migración inicial
conserva el modelo descrito por las migraciones de origen en
`supabase/migrations/`:

- Tabla `categories` (slug único y en minúsculas, nombre no vacío, timestamps)
- Tabla `products` (`category_id` → FK restrictiva a `categories`,
  `price >= 0`, nombre no vacío y timestamps)
- Tabla `hero_slides` (orden no negativo, texto requerido y timestamps)
- Relación `categories 1 ─── N products`
- Índices y trigger de `updated_at` en las tres tablas

Las migraciones antiguas de `supabase/migrations/` se conservan solo como
referencia del esquema de origen; no se ejecutan en el destino. Los datos
existentes no se copian automáticamente. Tras verificar el esquema y tener
ambas conexiones, prepara `.env.local` con `SOURCE_DATABASE_URL` (origen,
solo lectura), `DATABASE_URL` (destino pooled) y `DIRECT_URL` (destino
directo), y sigue este orden:

```bash
pnpm db:generate
pnpm db:migrate:status
pnpm db:migrate:deploy
pnpm db:migrate:data
```

`db:migrate:deploy` aplica solo migraciones pendientes y no se ejecuta durante
el build de Vercel. Revisa primero `pnpm db:migrate:status` y el SQL, verifica
que `DIRECT_URL` apunta al destino correcto y respalda ambas bases. La
importación lee el origen en una transacción consistente e inserta en el
destino dentro de otra transacción; no actualiza ni elimina registros. Un
conflicto de clave única/FK aborta la transacción sin sobrescribir filas.
Mantén pausadas las escrituras al origen durante la importación final para
evitar cambios concurrentes posteriores a la copia.

## Despliegue en Vercel

Configura `DATABASE_URL` con la conexión pooled de Prisma Console y
`DIRECT_URL` con la conexión directa, ambas con `sslmode=require`, en las
variables de entorno de Production (y Preview si corresponde). El script
`pnpm build` genera Prisma Client antes del build de Next.js. Las migraciones
de producción deben aplicarse explícitamente desde un entorno controlado con
`pnpm db:migrate:status` y luego `pnpm db:migrate:deploy`; no las conectes al
comando de build/deploy automático.

La sesión administrativa se almacena localmente. Los endpoints existentes no
verifican autorización de admin; esta migración no añade ni cambia autenticación.

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
│   ├── prisma.ts         # cliente Prisma singleton, solo servidor
│   ├── database-errors.ts # errores PostgreSQL/Prisma a respuestas API
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

# surprises-web
