import type { Product, Shipment } from "../types/models.js";

export function linearSearchByKey<T, K extends keyof T>(items: T[], key: K, value: T[K]): number {
  return items.findIndex((item) => item[key] === value);
}

export function binarySearchByNumber<T>(
  items: T[],
  selector: (item: T) => number,
  target: number
): number {
  let left: number = 0;
  let right: number = items.length - 1;

  while (left <= right) {
    const middle: number = Math.floor((left + right) / 2);
    const middleItem: T | undefined = items[middle];
    if (middleItem === undefined) {
      return -1;
    }
    const current: number = selector(middleItem);

    if (current === target) {
      return middle;
    }

    if (current < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}

export function findProductBySku(products: Product[], sku: string): Product | null {
  const normalizedSku: string = sku.trim().toLowerCase();
  const index: number = products.findIndex((product) => product.sku.toLowerCase() === normalizedSku);
  if (index < 0) {
    return null;
  }
  return products[index] ?? null;
}

export function findShipmentById(shipments: Shipment[], id: string): Shipment | null {
  const index: number = linearSearchByKey(shipments, "id", id);
  if (index < 0) {
    return null;
  }
  return shipments[index] ?? null;
}

export function binarySearchProductByWeight(sortedProductsByWeight: Product[], targetWeightKg: number): number {
  return binarySearchByNumber(sortedProductsByWeight, (product) => product.weightKg, targetWeightKg);
}