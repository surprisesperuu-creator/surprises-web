"use client";

import { CategoryForm } from "@/components/admin/forms/CategoryForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader
        title="Nueva categoría"
        description="Crea una categoría para agrupar tus productos."
      />
      <CategoryForm mode="create" />
    </>
  );
}
