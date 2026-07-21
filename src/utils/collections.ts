import type { Carrier, Product, ProductCategory, WarehouseLocation } from "../types/models.js";

export type SortDirection = "asc" | "desc";

export function filterProductsByWarehouse(products: Product[], warehouse: WarehouseLocation): Product[] {
  return products.filter((product) => product.warehouse === warehouse);
}

export function filterProductsByCategory(products: Product[], category: ProductCategory): Product[] {
  return products.filter((product) => product.category === category);
}

export function filterLowStockProducts(products: Product[]): Product[] {
  return products.filter((product) => product.stockQuantity <= product.minStockThreshold);
}

export function sortProductsByStock(products: Product[], direction: SortDirection = "asc"): Product[] {
  const factor: number = direction === "asc" ? 1 : -1;
  return [...products].sort((a, b) => (a.stockQuantity - b.stockQuantity) * factor);
}

export function sortProductsByUnitCost(products: Product[], direction: SortDirection = "asc"): Product[] {
  const factor: number = direction === "asc" ? 1 : -1;
  return [...products].sort((a, b) => (a.unitCostUSD - b.unitCostUSD) * factor);
}

export function sortCarriersByReliability(carriers: Carrier[], direction: SortDirection = "desc"): Carrier[] {
  const factor: number = direction === "asc" ? 1 : -1;
  return [...carriers].sort((a, b) => (a.onTimeRate - b.onTimeRate) * factor);
}

export function groupProductsByCategory(products: Product[]): Record<ProductCategory, Product[]> {
  const initial: Record<ProductCategory, Product[]> = {
    Fashion: [],
    Electronics: [],
    Cosmetics: [],
    Home: [],
    Other: []
  };

  return products.reduce((accumulator, product) => {
    accumulator[product.category].push(product);
    return accumulator;
  }, initial);
}