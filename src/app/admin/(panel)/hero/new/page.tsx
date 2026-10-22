"use client";

import { HeroSlideForm } from "@/components/admin/forms/HeroSlideForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default function NewHeroSlidePage() {
  return (
    <>
      <PageHeader
        title="Nueva imagen del Hero"
        description="Agrega una imagen al carrusel principal del Home. Se recomienda una imagen horizontal (p. ej. 1920×1080)."
      />
      <HeroSlideForm mode="create" />
    </>
  );
}
