# Documento de Diseño
## TrackFlow - Lógica de Negocio en TypeScript

Estado: Activo
Última actualización: 2026-07-21
Owner: Equipo de Ingeniería

## 1. Objetivo
Definir la arquitectura lógica del dominio de TrackFlow para soportar inventario y asignación de transportistas, con foco en mantenibilidad, trazabilidad y rendimiento para más de 2,000 envíos por semana.

## 2. Alcance
Incluye:
- Modelado de entidades Product, Shipment y Carrier.
- Utilidades puras para filtrado, ordenación, búsqueda y agregaciones.
- Reglas de validación y errores controlados.
- Selección de transportista por scoring y costo.

No incluye:
- Persistencia de datos (DB).
- Integraciones externas (APIs de carriers).
- UI o capa HTTP.

## 3. Estructura Técnica

```text
src/
├── types/
│   ├── index.ts
│   └── models.ts
├── utils/
│   ├── collections.ts
│   ├── search.ts
│   ├── transformations.ts
│   └── validations.ts

Notas:
- `src/types/index.ts` reexporta desde `src/types/models.ts`.
- La carpeta `src/__tests__/` se considera recomendada para evolucion del hito, aunque no es obligatoria para compilar.
```

Responsabilidades por módulo:
- src/types/index.ts: Tipos e interfaces de dominio.
- src/utils/collections.ts: Filtros y ordenamientos sin mutación.
- src/utils/search.ts: Búsqueda lineal y binaria sobre datos normalizados.
- src/utils/transformations.ts: Costos, scoring y agregaciones.
- src/utils/validations.ts: Validación robusta y estandarización de errores.

## 4. Decisiones de Diseño

### 4.1 Inmutabilidad por defecto
Todas las utilidades deben tratar entradas como inmutables. Cuando aplique ordenamiento, se opera sobre copia.

### 4.2 Validación fail-safe
Las validaciones retornan una estructura común:

```ts
{ valid: boolean, errors: string[] }
```

Nunca deben lanzar excepciones por datos esperables del negocio (nulos, rangos inválidos, campos vacíos).

### 4.3 Búsqueda eficiente
Se usa búsqueda binaria para catálogos ordenados por peso o clave comparable. Complejidad esperada: O(log n).

### 4.4 Scoring ponderado de carriers
Distribución base:
- País destino compatible: 20%
- Capacidad de peso: 20%
- Prioridad soportada: 15%
- Manejo de frágil: 15%
- Historial on-time: 30%

Umbral de descarte recomendado: score menor a 50.

### 4.5 Elegibilidad estricta previa
Antes de aplicar scoring final, un carrier se descarta si no cumple cualquiera de estas condiciones:
- Opera en el pais destino.
- Soporta la prioridad solicitada.
- Soporta el peso del producto.
- Si el producto es fragil, debe manejar fragil.

Solo los carriers elegibles pasan al filtro por score y desempate por costo.

## 5. Reglas de Calidad
- TypeScript en modo estricto.
- Funciones puras y deterministas.
- Nombres descriptivos y contratos estables.
- Cobertura de pruebas enfocada a reglas de negocio críticas.

## 6. Riesgos y Mitigaciones
- Riesgo: entrada incompleta o inconsistente.
	Mitigación: validaciones centralizadas y mensajes de error accionables.
- Riesgo: ranking injusto por pesos estáticos.
	Mitigación: parametrizar pesos y versionar configuración.
- Riesgo: regresiones al ajustar reglas.
	Mitigación: pruebas unitarias dirigidas por casos límite.

## 7. Checklist de Implementación
- Interfaces de dominio consolidadas en src/types/index.ts.
- Utilidades de colecciones sin mutación.
- Búsquedas lineal y binaria verificadas con casos borde.
- Cálculo de costo y scoring documentado con ejemplos.
- Validadores retornando contrato común.

## 8. Definición de Hecho (DoD)
Este diseño se considera implementado cuando:
1. Todas las funciones requeridas están en sus módulos esperados.
2. Los casos inválidos no rompen ejecución y entregan errores claros.
3. Se puede explicar por qué se eligió un carrier para un envío dado.
