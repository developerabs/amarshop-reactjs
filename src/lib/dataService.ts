import type { Product } from "../types";
import { PRODUCTS } from "../data/mockData";
import { slugify as makeSlug } from "./utils";

export function getProducts(): Product[] {
  return PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(
    (product) => makeSlug(product.name) === slug || product.name.toLowerCase() === slug.toLowerCase()
  );
}

export function filterProducts(options: { query?: string; category?: string } = {}): Product[] {
  const query = options.query?.trim().toLowerCase() ?? "";
  const category = options.category?.trim().toLowerCase() ?? "";

  return PRODUCTS.filter((product) => {
    if (category && category !== "all categories") {
      const normalizedCategory = product.category.toLowerCase();
      if (!normalizedCategory.includes(category)) {
        return false;
      }
    }

    if (query) {
      const searchString = `${product.name} ${product.category}`.toLowerCase();
      return searchString.includes(query);
    }

    return true;
  });
}

export function getFlashDeals(): Product[] {
  return PRODUCTS.filter((product) => typeof product.discount === "number" && product.discount > 0);
}

export function slugify(value: string): string {
  return makeSlug(value);
}
