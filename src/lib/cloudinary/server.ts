import { v2 as cloudinary } from "cloudinary";

/**
 * ============================================================
 * Cloudinary — integración backend (SOLO SERVIDOR)
 * ============================================================
 *
 * Flujo previsto del Admin (fase 2):
 *   1. El servidor genera una firma firmada (signed upload) con
 *      `generateUploadSignature()`.
 *   2. El navegador sube la imagen DIRECTAMENTE a Cloudinary usando
 *      esa firma (el API_SECRET nunca sale del servidor).
 *   3. El Admin guarda la URL resultante en Supabase (image_url).
 *
 * ⚠️ Nunca importes este módulo desde un componente 'use client'.
 */

/** Configura la SDK de Cloudinary a partir de las variables de entorno. */
export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Faltan variables de entorno de Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)"
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

/** Datos que el cliente del Admin necesitará para subir la imagen. */
export interface UploadSignature {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
}

/**
 * Genera la firma para un upload firmado a Cloudinary.
 *
 * La firma se construye en el servidor con el API_SECRET. El navegador la
 * usa para subir la imagen directamente (upload widget / fetch) y luego
 * se persiste la URL en Supabase.
 */
export function generateUploadSignature(folder: string): UploadSignature {
  const cloud = getCloudinary();
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloud.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
    timestamp,
    signature,
  };
}
