export type UploadFolder = "products" | "categories" | "hero";

interface UploadSignatureResponse {
  data: {
    cloudName: string;
    apiKey: string;
    folder: string;
    timestamp: number;
    signature: string;
  };
  error: null;
}

/**
 * Sube un archivo directo a Cloudinary con una firma pedida a `POST /api/upload`
 * (el API_SECRET nunca sale del servidor). Devuelve la `secure_url`.
 */
export async function uploadToCloudinary(file: File, folder: UploadFolder): Promise<string> {
  // 1. Firma firmada desde el servidor.
  const response = await fetch(`/api/upload?folder=${encodeURIComponent(folder)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const body = (await response.json()) as
    | UploadSignatureResponse
    | { data: null; error: { message: string } };

  if (!response.ok || body.error !== null || !body.data) {
    const reason =
      typeof body.error === "object" && body.error && body.error.message
        ? body.error.message
        : "No se pudo iniciar la subida";
    throw new Error(reason);
  }

  const { cloudName, apiKey, folder: folderName, timestamp, signature } = body.data;

  // 2. Subida directa a Cloudinary con la firma.
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folderName);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    { method: "POST", body: formData }
  );
  const uploadBody = (await uploadResponse.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };

  if (!uploadResponse.ok || !uploadBody.secure_url) {
    throw new Error(uploadBody.error?.message ?? "No se pudo subir la imagen a Cloudinary");
  }

  return uploadBody.secure_url;
}
