import type {
  Carrier,
  CarrierScoreBreakdown,
  CarrierSelection,
  Product,
  ProductCategory,
  Shipment,
  ShipmentPriority
} from "../types/models.js";

function getPrioritySurcharge(priority: ShipmentPriority): number {
  if (priority === "Express") {
    return 0.3;
  }
  if (priority === "Same-day") {
    return 0.6;
  }
  return 0;
}

export function calculateShipmentCostUSD(shipment: Shipment, product: Product, carrier: Carrier): number {
  const baseCost: number = carrier.baseRateUSD;
  const weightCost: number = carrier.ratePerKgUSD * product.weightKg * shipment.quantity;
  const distanceCost: number = carrier.ratePerKmUSD * shipment.destination.distanceKm;
  const subtotal: number = baseCost + weightCost + distanceCost;
  const surcharge: number = subtotal * getPrioritySurcharge(shipment.priority);
  return Number((subtotal + surcharge).toFixed(2));
}

export function scoreCarrierForShipment(shipment: Shipment, product: Product, carrier: Carrier): CarrierScoreBreakdown {
  const countryMatch: number = carrier.operatesIn.includes(shipment.destination.country) ? 20 : 0;
  const weightCapacity: number = product.weightKg <= carrier.maxWeightKg ? 20 : 0;
  const prioritySupport: number = carrier.acceptsPriority.includes(shipment.priority) ? 15 : 0;
  const fragileHandling: number = product.isFragile ? (carrier.handlesFragile ? 15 : 0) : 15;
  const reliability: number = Math.max(0, Math.min(30, (carrier.onTimeRate / 100) * 30));
  const totalScore: number = Number((countryMatch + weightCapacity + prioritySupport + fragileHandling + reliability).toFixed(2));

  return {
    countryMatch,
    weightCapacity,
    prioritySupport,
    fragileHandling,
    reliability: Number(reliability.toFixed(2)),
    totalScore
  };
}

function isCarrierEligible(shipment: Shipment, product: Product, carrier: Carrier): boolean {
  if (!carrier.operatesIn.includes(shipment.destination.country)) {
    return false;
  }

  if (!carrier.acceptsPriority.includes(shipment.priority)) {
    return false;
  }

  if (product.weightKg > carrier.maxWeightKg) {
    return false;
  }

  if (product.isFragile && !carrier.handlesFragile) {
    return false;
  }

  return true;
}

export function selectBestCarrier(
  shipment: Shipment,
  product: Product,
  carriers: Carrier[],
  minScore: number = 50
): CarrierSelection | null {
  const candidates: CarrierSelection[] = carriers
    .filter((carrier) => isCarrierEligible(shipment, product, carrier))
    .map((carrier) => {
      const scoreBreakdown: CarrierScoreBreakdown = scoreCarrierForShipment(shipment, product, carrier);
      const totalCostUSD: number = calculateShipmentCostUSD(shipment, product, carrier);
      return {
        carrier,
        score: scoreBreakdown.totalScore,
        totalCostUSD
      };
    })
    .filter((candidate) => candidate.score >= minScore);

  if (candidates.length === 0) {
    return null;
  }

  const sortedCandidates: CarrierSelection[] = [...candidates].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.totalCostUSD - b.totalCostUSD;
  });

  return sortedCandidates[0] ?? null;
}

export function countProductsByCategory(products: Product[]): Record<ProductCategory, number> {
  const initial: Record<ProductCategory, number> = {
    Fashion: 0,
    Electronics: 0,
    Cosmetics: 0,
    Home: 0,
    Other: 0
  };

  return products.reduce((accumulator, product) => {
    accumulator[product.category] += 1;
    return accumulator;
  }, initial);
}

export function calculateTotalInventoryValueUSD(products: Product[]): number {
  return Number(
    products
      .reduce((total, product) => total + product.stockQuantity * product.unitCostUSD, 0)
      .toFixed(2)
  );
}

export function calculateAverageShipmentDistanceKm(shipments: Shipment[]): number {
  if (shipments.length === 0) {
    return 0;
  }

  const distanceTotal: number = shipments.reduce((total, shipment) => total + shipment.destination.distanceKm, 0);
  return Number((distanceTotal / shipments.length).toFixed(2));
}

export function findMaxDeclaredValueShipment(shipments: Shipment[]): Shipment | null {
  if (shipments.length === 0) {
    return null;
  }

  const firstShipment: Shipment | undefined = shipments[0];
  if (!firstShipment) {
    return null;
  }

  let currentMax: Shipment = firstShipment;
  for (const shipment of shipments) {
    if (shipment.declaredValueUSD > currentMax.declaredValueUSD) {
      currentMax = shipment;
    }
  }

  return currentMax;
}

export function findMinDeclaredValueShipment(shipments: Shipment[]): Shipment | null {
  if (shipments.length === 0) {
    return null;
  }

  const firstShipment: Shipment | undefined = shipments[0];
  if (!firstShipment) {
    return null;
  }

  let currentMin: Shipment = firstShipment;
  for (const shipment of shipments) {
    if (shipment.declaredValueUSD < currentMin.declaredValueUSD) {
      currentMin = shipment;
    }
  }

  return currentMin;
}

export function countShipmentsByCarrier(shipments: Shipment[]): Record<string, number> {
  return shipments.reduce<Record<string, number>>((accumulator, shipment) => {
    const carrierKey: string = shipment.carrier ?? "Unassigned";
    accumulator[carrierKey] = (accumulator[carrierKey] ?? 0) + 1;
    return accumulator;
  }, {});
}