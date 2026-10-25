import { Prisma } from "@/generated/prisma/client";
import { ApiErrors } from "@/lib/api/errors";

interface DatabaseErrorOptions {
  resource?: string;
  conflictMessage?: string;
  inUseMessage?: string;
}

export function handleDatabaseError(
  error: unknown,
  options: DatabaseErrorOptions = {}
): never {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw error;
  }

  const {
    resource = "Recurso",
    conflictMessage,
    inUseMessage,
  } = options;

  switch (error.code) {
    case "P2002":
      throw ApiErrors.conflict(
        conflictMessage ?? "Ya existe un registro con el mismo valor único"
      );
    case "P2003":
      throw ApiErrors.conflict(
        inUseMessage ?? "No se puede eliminar el registro porque está en uso"
      );
    case "P2025":
      throw ApiErrors.notFound(resource);
    case "P2000":
    case "P2004":
    case "P2006":
    case "P2007":
    case "P2011":
    case "P2012":
      throw ApiErrors.validation("Los datos no cumplen las reglas requeridas");
    default:
      throw error;
  }
}
