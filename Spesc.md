# TrackFlow - Especificación Técnica
## Hito 2: Lógica de Inventario y Asignación de Carriers

Estado: Activo
Versión: 1.0
Última actualización: 2026-07-21

## 1. Contexto
TrackFlow opera en Los Ángeles y Zaragoza para gestión de almacenes y entrega de última milla.
Este hito define la lógica de negocio en TypeScript puro para:
- Control de inventario.
- Validación de datos de negocio.
- Selección de transportista por costo e idoneidad.

## 2. Objetivos Funcionales
1. Modelar entidades clave con tipos estrictos.
2. Implementar utilidades puras para operaciones de dominio.
3. Garantizar que datos inválidos no rompan el flujo.
4. Poder justificar, con reglas trazables, la elección de carrier.

## 3. Contratos de Datos

### 3.1 Product

```typescript
interface Product {
  sku: string;
  name: string;
  category: ProductCategory;
  weightKg: number;
  dimensions: Dimensions;
  warehouse: WarehouseLocation;
  stockQuantity: number;
  minStockThreshold: number;
  unitCostUSD: number;
  isFragile: boolean;
  status: ProductStatus;
}

interface Dimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

type ProductCategory = "Fashion" | "Electronics" | "Cosmetics" | "Home" | "Other";
type WarehouseLocation = "Los Angeles" | "Zaragoza";
type ProductStatus = "Active" | "Low stock" | "Out of stock" | "Discontinued";
```

Reglas mínimas:
- sku no vacío.
- weightKg mayor que 0 y menor o igual a 100.
- dimensiones mayores que 0 y menores o iguales a 200.
- stockQuantity y minStockThreshold mayores o iguales a 0.
- unitCostUSD mayor que 0.

### 3.2 Shipment

```typescript
interface Shipment {
  id: string;
  sku: string;
  quantity: number;
  origin: WarehouseLocation;
  destination: Destination;
  priority: ShipmentPriority;
  declaredValueUSD: number;
  carrier: string | null;
  status: ShipmentStatus;
  createdAt: Date;
}

interface Destination {
  city: string;
  country: Country;
  postalCode: string;
  distanceKm: number;
}

type Country = "United States" | "Spain";
type ShipmentPriority = "Standard" | "Express" | "Same-day";
type ShipmentStatus = "Pending" | "Assigned" | "In transit" | "Delivered" | "Failed";
```

Reglas mínimas:
- quantity mayor que 0.
- declaredValueUSD mayor que 0.
- distanceKm mayor o igual a 0.

### 3.3 Carrier

```typescript
interface Carrier {
  id: string;
  name: string;
  operatesIn: Country[];
  baseRateUSD: number;
  ratePerKgUSD: number;
  ratePerKmUSD: number;
  avgDeliveryDays: number;
  onTimeRate: number;
  maxWeightKg: number;
  handlesFragile: boolean;
  acceptsPriority: ShipmentPriority[];
}
```

Reglas mínimas:
- tarifas mayores o iguales a 0.
- avgDeliveryDays mayor que 0.
- onTimeRate entre 0 y 100.
- maxWeightKg mayor que 0.
- operatesIn con al menos un país.

## 4. Módulos y Funciones Requeridas
- src/utils/collections.ts: filtros por almacén, categoría y stock; ordenamientos sin mutar entrada.
- src/utils/search.ts: búsqueda por SKU (insensible a mayúsculas), por ID y binaria por peso.
- src/utils/transformations.ts: costo de envío, scoring de carrier, selección de mejor opción y agregaciones.
- src/utils/validations.ts: validación robusta con contrato uniforme.

Contrato esperado para validaciones:

```typescript
{ valid: boolean, errors: string[] }
```

## 5. Reglas de Negocio Clave
- Un carrier no elegible por país, prioridad o peso máximo debe descartarse antes del cálculo final.
- Carriers con score menor al umbral operativo se consideran no aptos.
- Ante empate de score, se prioriza menor costo total.

## 6. Criterios de Aceptación
1. TypeScript estricto en todos los módulos del hito.
2. Sin mutaciones sobre arrays u objetos de entrada.
3. Errores de validación claros y acumulables.
4. Resultado de selección de carrier reproducible y explicable.

## 7. Entregables
1. Tipos e interfaces en src/types/index.ts.
2. Implementación de utilidades en src/utils.
3. Documento de diseño alineado en Dising.md.
4. Evidencia de pruebas unitarias del dominio.

## 8. Checklist de Configuración
- Variables de scoring definidas y documentadas.
- Umbral mínimo de score acordado con operaciones.
- Reglas de validación centralizadas.
- Casos borde identificados para pruebas.

## 9. Comandos de Desarrollo
- Validación de tipos: npm run typecheck
- Ejecución de demo local: npm run demo
