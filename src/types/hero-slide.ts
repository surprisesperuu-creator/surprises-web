/**
 * Entidad HeroSlide: una imagen del carrusel Hero del Home principal.
 */
export interface HeroSlide {
  id: string;
  title: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
