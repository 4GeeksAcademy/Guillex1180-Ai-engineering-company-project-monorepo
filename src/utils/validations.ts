import type { Carrier, Product, Shipment, ValidationResult } from "../types/models.js";

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

export function validateProduct(product: Product): ValidationResult {
  const errors: string[] = [];

  if (product.sku.trim().length === 0) {
    errors.push("sku must not be empty");
  }

  if (!isFiniteNumber(product.weightKg) || product.weightKg <= 0 || product.weightKg > 100) {
    errors.push("weightKg must be greater than 0 and less than or equal to 100");
  }

  if (!isFiniteNumber(product.dimensions.lengthCm) || product.dimensions.lengthCm <= 0 || product.dimensions.lengthCm > 200) {
    errors.push("dimensions.lengthCm must be greater than 0 and less than or equal to 200");
  }

  if (!isFiniteNumber(product.dimensions.widthCm) || product.dimensions.widthCm <= 0 || product.dimensions.widthCm > 200) {
    errors.push("dimensions.widthCm must be greater than 0 and less than or equal to 200");
  }

  if (!isFiniteNumber(product.dimensions.heightCm) || product.dimensions.heightCm <= 0 || product.dimensions.heightCm > 200) {
    errors.push("dimensions.heightCm must be greater than 0 and less than or equal to 200");
  }

  if (!isFiniteNumber(product.stockQuantity) || product.stockQuantity < 0) {
    errors.push("stockQuantity must be greater than or equal to 0");
  }

  if (!isFiniteNumber(product.minStockThreshold) || product.minStockThreshold < 0) {
    errors.push("minStockThreshold must be greater than or equal to 0");
  }

  if (!isFiniteNumber(product.unitCostUSD) || product.unitCostUSD <= 0) {
    errors.push("unitCostUSD must be greater than 0");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateShipment(shipment: Shipment): ValidationResult {
  const errors: string[] = [];

  if (!isFiniteNumber(shipment.quantity) || shipment.quantity <= 0) {
    errors.push("quantity must be greater than 0");
  }

  if (!isFiniteNumber(shipment.declaredValueUSD) || shipment.declaredValueUSD <= 0) {
    errors.push("declaredValueUSD must be greater than 0");
  }

  if (!isFiniteNumber(shipment.destination.distanceKm) || shipment.destination.distanceKm < 0) {
    errors.push("destination.distanceKm must be greater than or equal to 0");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateCarrier(carrier: Carrier): ValidationResult {
  const errors: string[] = [];

  if (carrier.operatesIn.length === 0) {
    errors.push("operatesIn must include at least one country");
  }

  if (!isFiniteNumber(carrier.baseRateUSD) || carrier.baseRateUSD < 0) {
    errors.push("baseRateUSD must be greater than or equal to 0");
  }

  if (!isFiniteNumber(carrier.ratePerKgUSD) || carrier.ratePerKgUSD < 0) {
    errors.push("ratePerKgUSD must be greater than or equal to 0");
  }

  if (!isFiniteNumber(carrier.ratePerKmUSD) || carrier.ratePerKmUSD < 0) {
    errors.push("ratePerKmUSD must be greater than or equal to 0");
  }

  if (!isFiniteNumber(carrier.avgDeliveryDays) || carrier.avgDeliveryDays <= 0) {
    errors.push("avgDeliveryDays must be greater than 0");
  }

  if (!isFiniteNumber(carrier.onTimeRate) || carrier.onTimeRate < 0 || carrier.onTimeRate > 100) {
    errors.push("onTimeRate must be between 0 and 100");
  }

  if (!isFiniteNumber(carrier.maxWeightKg) || carrier.maxWeightKg <= 0) {
    errors.push("maxWeightKg must be greater than 0");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateForProcessing(product: Product, shipment: Shipment, carrier: Carrier): ValidationResult {
  const productResult: ValidationResult = validateProduct(product);
  const shipmentResult: ValidationResult = validateShipment(shipment);
  const carrierResult: ValidationResult = validateCarrier(carrier);

  return {
    valid: productResult.valid && shipmentResult.valid && carrierResult.valid,
    errors: [...productResult.errors, ...shipmentResult.errors, ...carrierResult.errors]
  };
}