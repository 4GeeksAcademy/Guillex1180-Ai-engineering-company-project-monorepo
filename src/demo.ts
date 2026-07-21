import {
  calculateAverageShipmentDistanceKm,
  calculateTotalInventoryValueUSD,
  countProductsByCategory,
  findProductBySku,
  selectBestCarrier,
  type Carrier,
  type Product,
  type Shipment
} from "./index.js";

const products: Product[] = [
  {
    sku: "SKU-001",
    name: "Wireless Headphones",
    category: "Electronics",
    weightKg: 1.2,
    dimensions: { lengthCm: 20, widthCm: 18, heightCm: 10 },
    warehouse: "Los Angeles",
    stockQuantity: 120,
    minStockThreshold: 20,
    unitCostUSD: 45,
    isFragile: true,
    status: "Active"
  }
];

const shipment: Shipment = {
  id: "SHP-1001",
  sku: "SKU-001",
  quantity: 2,
  origin: "Los Angeles",
  destination: {
    city: "Madrid",
    country: "Spain",
    postalCode: "28001",
    distanceKm: 6200
  },
  priority: "Express",
  declaredValueUSD: 120,
  carrier: null,
  status: "Pending",
  createdAt: new Date("2026-07-21T10:00:00.000Z")
};

const carriers: Carrier[] = [
  {
    id: "C-001",
    name: "DHL",
    operatesIn: ["United States", "Spain"],
    baseRateUSD: 10,
    ratePerKgUSD: 3,
    ratePerKmUSD: 0.01,
    avgDeliveryDays: 3,
    onTimeRate: 96,
    maxWeightKg: 50,
    handlesFragile: true,
    acceptsPriority: ["Standard", "Express", "Same-day"]
  }
];

const productFound: Product | null = findProductBySku(products, "sku-001");
const bestCarrier = productFound ? selectBestCarrier(shipment, productFound, carriers) : null;

console.log("Products by category:", countProductsByCategory(products));
console.log("Total inventory value:", calculateTotalInventoryValueUSD(products));
console.log("Average shipment distance:", calculateAverageShipmentDistanceKm([shipment]));
console.log("Best carrier:", bestCarrier?.carrier.name ?? "No carrier found");