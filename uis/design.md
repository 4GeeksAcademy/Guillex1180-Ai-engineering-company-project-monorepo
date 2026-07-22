# Diseño Técnico y Arquitectura

## Stack Tecnológico
- **Framework**: Next.js (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Gestión de Estado**: React Hooks nativos (`useState`, `useEffect`, `useContext`). Sin librerías externas.
- **Data Fetching**: Funciones asíncronas con `async/await` integradas con el ecosistema de Next.js.

## Estructura de Directorios
Se mantendrá una separación estricta de responsabilidades:
- `/app`: Rutas principales de la aplicación (`/` para el listado, `/candidates/[id]` para el detalle).
- `/components`: Componentes modulares y reutilizables (ej. Formularios, Tarjetas, Filtros).
- `/hooks`: Custom hooks para abstraer lógica (ej. `useCandidates`, `useNotes`).
- `/types`: Interfaces TypeScript para tipar estrictamente los *payloads* y respuestas de la API.
- `/services`: Funciones encargadas exclusivamente de la comunicación HTTP con la API REST.
- `/lib`: Funciones utilitarias generales.

## Patrones de Diseño Requeridos
- **Navegación Fluida**: Uso extensivo del sistema de enrutamiento de Next.js y `useSearchParams` para los filtros.
- **Feedback de Interfaz**: Implementación obligatoria de los tres estados de UI (cargando, éxito, error) en toda operación de red.
- **Optimización de Renderizado**: Actualizaciones optimistas o refetching focalizado tras operaciones `POST`, `PUT`, `PATCH`, evitando recargas completas.

## Rutas y Peticiones API (`/api/v1`)
- **GET** `/records`: Listado general.
- **GET, PUT, PATCH** `/records/:id`: Detalle y actualización (estado/etapa, datos generales).
- **POST** `/records`: Creación.
- **GET, POST, DELETE** `/records/:id/notes`: Gestión de notas de la entrevista.
