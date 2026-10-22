"use client";

import { useParams } from "next/navigation";

import { useApiData } from "@/lib/api/use-api-data";
import { adminApi } from "@/lib/admin/api-client";
import type { HeroSlide } from "@/types/hero-slide";

import { HeroSlideForm } from "@/components/admin/forms/HeroSlideForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingState } from "@/components/admin/LoadingState";
import { ErrorState } from "@/components/admin/ErrorState";

export default function EditHeroSlidePage() {
  const params = useParams<{ id: string }>();
  const slideId = params.id;

  const { data, loading, error, refetch } = useApiData<HeroSlide>(
    () => adminApi.getHeroSlide(slideId),
    [slideId]
  );

  return (
    <>
      <PageHeader
        title="Editar imagen del Hero"
        description={data ? `Actualizando "${data.title}"` : "Actualizando imagen"}
      />

      {loading ? (
        <LoadingState label="Cargando imagen..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data ? (
        <HeroSlideForm mode="edit" initial={data} />
      ) : null}
    </>
  );
}
