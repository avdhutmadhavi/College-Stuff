import type { EnquiryPayload, PlantGuide, Product } from "./types";
import {
  findPreviewGuides,
  findPreviewProducts,
  previewGuideCategories,
  previewGuides,
  previewProductCategories,
  previewProducts,
} from "./previewData";

const apiBase = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api").replace(/\/$/, "");
export const isStaticPreview = import.meta.env.MODE === "preview";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error("We could not reach the server. Please check that the NAVRO Living API is running.");
  }
  const body = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) throw new Error(body.error || "The request could not be completed.");
  return body as T;
}

export interface ProductList {
  items: Product[];
  page: number;
  limit: number;
  total: number;
}

export interface GuideList {
  items: PlantGuide[];
  page: number;
  limit: number;
  total: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export const api = {
  products: (query = "") => isStaticPreview
    ? Promise.resolve(findPreviewProducts(query))
    : request<ProductList>(`/products${query}`),
  categories: () => isStaticPreview
    ? Promise.resolve(previewProductCategories)
    : request<Category[]>("/categories"),
  product: (slug: string) => isStaticPreview
    ? Promise.resolve(previewProducts.find((product) => product.slug === slug) || null)
    : request<Product>(`/products/${encodeURIComponent(slug)}`),
  guides: (query = "") => isStaticPreview
    ? Promise.resolve(findPreviewGuides(query))
    : request<GuideList>(`/guides${query}`),
  guideCategories: () => isStaticPreview
    ? Promise.resolve(previewGuideCategories)
    : request<Category[]>("/guide-categories"),
  guide: (slug: string) => isStaticPreview
    ? Promise.resolve(previewGuides.find((guide) => guide.slug === slug) || null)
    : request<PlantGuide>(`/guides/${encodeURIComponent(slug)}`),
  submitEnquiry: (payload: EnquiryPayload) => isStaticPreview
    ? Promise.reject(new Error("This public preview does not send or store enquiries."))
    : request<{ id: number; message: string }>("/enquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createOrder: (payload: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    items: { productId: number; quantity: number }[];
  }) => isStaticPreview
    ? Promise.reject(new Error("This public preview does not accept or store orders."))
    : request<{ id: number; total: number; status: string; paymentStatus: string }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
};
