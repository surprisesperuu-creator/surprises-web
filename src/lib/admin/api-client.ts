import { apiRequest } from "@/lib/api/client";
import type { Category } from "@/types/category";
import type { Product, ProductWithCategory } from "@/types/product";
import type { HeroSlide } from "@/types/hero-slide";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/validations/category.schema";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/validations/product.schema";
import type {
  CreateHeroSlideInput,
  UpdateHeroSlideInput,
} from "@/lib/validations/hero-slide.schema";

/**
 * Cliente tipado para los endpoints existentes del backend (uso del Admin).
 * NO crea endpoints nuevos: solo consume los ya implementados.
 */
export const adminApi = {
  // ---- Categorías ----
  getCategories: () => apiRequest<Category[]>("/api/categories"),
  getCategory: (id: string) => apiRequest<Category>(`/api/categories/${id}`),
  createCategory: (input: CreateCategoryInput) =>
    apiRequest<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateCategory: (id: string, input: UpdateCategoryInput) =>
    apiRequest<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deleteCategory: (id: string) =>
    apiRequest<{ id: string }>(`/api/categories/${id}`, { method: "DELETE" }),

  // ---- Productos ----
  getProducts: (categoryId?: string) =>
    apiRequest<ProductWithCategory[]>(
      categoryId ? `/api/products?category_id=${categoryId}` : "/api/products"
    ),
  getProduct: (id: string) =>
    apiRequest<ProductWithCategory>(`/api/products/${id}`),
  createProduct: (input: CreateProductInput) =>
    apiRequest<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateProduct: (id: string, input: UpdateProductInput) =>
    apiRequest<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deleteProduct: (id: string) =>
    apiRequest<{ id: string }>(`/api/products/${id}`, { method: "DELETE" }),

  // ---- Hero del Home (carrusel) ----
  getHeroSlides: () => apiRequest<HeroSlide[]>("/api/hero-slides"),
  getHeroSlide: (id: string) => apiRequest<HeroSlide>(`/api/hero-slides/${id}`),
  createHeroSlide: (input: CreateHeroSlideInput) =>
    apiRequest<HeroSlide>("/api/hero-slides", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateHeroSlide: (id: string, input: UpdateHeroSlideInput) =>
    apiRequest<HeroSlide>(`/api/hero-slides/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deleteHeroSlide: (id: string) =>
    apiRequest<{ id: string }>(`/api/hero-slides/${id}`, { method: "DELETE" }),
};

