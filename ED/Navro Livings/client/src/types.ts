export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  care_instructions?: string | null;
  price: number;
  stock_quantity: number;
  is_demo: boolean;
  category: string;
  category_slug: string;
  image?: string | null;
  images?: { image_url: string; alt_text: string }[];
}

export interface PlantGuide {
  slug: string;
  title: string;
  summary: string;
  content?: string;
  featured_image: string | null;
  featured_image_alt?: string | null;
  published_at: string | null;
  category: string;
  category_slug: string;
  is_demo?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  locality: string;
  gardenType: string;
  gardenSize: string;
  budget: string;
  contactMethod: string;
  message: string;
  consent: boolean;
}
