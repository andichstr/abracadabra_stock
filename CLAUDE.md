# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack clothing store management app with two sub-projects:
- `clothing-store-backend/` — Spring Boot 3.5 REST API (Java 17, Maven)
- `clothing-store-frontend/` — React + Vite SPA

## Running with Docker (recommended)

All services (MySQL, backend, frontend) are orchestrated via `docker-compose.yml` at the root.

```bash
# Levantar todo (primera vez: construye imágenes, crea DB y corre schema.sql)
docker compose up --build

# Levantar en background
docker compose up -d --build

# Ver logs de un servicio
docker compose logs -f backend

# Detener todo (preserva volúmenes/datos)
docker compose down

# Detener y eliminar datos de MySQL
docker compose down -v
```

- Frontend: `http://localhost` (puerto 80, nginx)
- Backend API: `http://localhost:8080`
- MySQL: `localhost:3306` — usuario `root`, contraseña `root`, base `clothing_store`

El schema SQL se inicializa automáticamente en el primer `up` vía `/docker-entrypoint-initdb.d/`. Si el volumen `mysql_data` ya existe, el init script **no** vuelve a ejecutarse.

## Local Development (sin Docker)

### Environment Requirements

- **Java 17**: `C:\Program Files\Microsoft\jdk-17.0.12.7-hotspot`
- **Maven**: usar el wrapper `mvnw` en `clothing-store-backend/` (no hay Maven global)
- **MySQL**: local en puerto 3306 con base `clothing_store`
- **Node.js**: v24+ / npm 11+

### Backend

```bash
export JAVA_HOME="C:/Program Files/Microsoft/jdk-17.0.12.7-hotspot"
cd clothing-store-backend

./mvnw compile
./mvnw spring-boot:run          # puerto 8080
./mvnw test
./mvnw test -Dtest=SaleServiceTest
./mvnw package -DskipTests
```

Configurar contraseña local en `src/main/resources/application.properties`:
```
spring.datasource.password=YOUR_PASSWORD
```

### Frontend

```bash
cd clothing-store-frontend

npm run dev     # puerto 5173, proxea /api → localhost:8080
npm run build
npm run lint
```

### Database Setup (local, primera vez)

```bash
mysql -u root -p < clothing-store-backend/src/main/resources/schema.sql
```

## Architecture

### Backend (`com.clothingstore`)

Standard Spring Boot layered architecture:

- **`model/`** — JPA entities: `Category`, `Product`, `Sale`, `SaleItem`
- **`repository/`** — Spring Data JPA interfaces. `ProductRepository` and `SaleRepository` extend `JpaSpecificationExecutor` for dynamic filter queries
- **`service/`** — Business logic. `SaleService.createSale()` is the most critical method: it runs `@Transactional`, validates stock, decrements `Product.stockQuantity`, snapshots `unitPrice` from the current sale price, and persists `Sale` + `SaleItem` in one transaction
- **`controller/`** — REST controllers. `ProductController` declares `/qr/{qrCode}` before `/{id}` intentionally (literal path takes precedence)
- **`dto/`** — Data transfer objects for API input/output. `SaleItem.unitPrice` is a historical snapshot — never derive it from `Product.salePrice` when displaying past sales
- **`config/`** — `CorsConfig` (reads `APP_CORS_ALLOWED_ORIGINS` env var; `localhost:5173` for local dev, `http://localhost` in Docker), `WebMvcConfig` (serves uploaded images from `./uploads/`)
- **`exception/`** — `GlobalExceptionHandler` maps `ResourceNotFoundException` → 404, `IllegalArgumentException` → 400, `IllegalStateException` → 409

**Key constraint**: Products referenced in any `SaleItem` cannot be deleted (returns 409). Check `SaleItemRepository.existsByProductId()` before delete.

### Docker Setup

```
docker-compose.yml
├── mysql         — MySQL 8.0, volumen persistente, healthcheck antes de arrancar backend
├── backend       — imagen multi-stage (Maven build → JRE 17 Alpine), volumen ./uploads
└── frontend      — imagen multi-stage (Node build → nginx Alpine), nginx proxea /api al backend
```

Variables de entorno que docker-compose inyecta al backend (sobreescriben `application.properties`):
- `SPRING_DATASOURCE_URL` — apunta a `mysql` (nombre del servicio Docker) en vez de `localhost`
- `SPRING_DATASOURCE_USERNAME/PASSWORD` — `root/root`
- `APP_CORS_ALLOWED_ORIGINS` — `http://localhost`

### Frontend (`src/`)

- **`context/CartContext.jsx`** — Global cart state via `useReducer`. Actions: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QTY`, `CLEAR_CART`. Shared between `QRScanner` and `Cart` components via `useCart()` hook
- **`api/`** — Thin Axios wrappers per domain (`productApi`, `categoryApi`, `saleApi`). All use `axiosInstance.js` with `baseURL: '/api'` (proxied by Vite in dev, by nginx in Docker)
- **`components/QRScanner.jsx`** — Uses `html5-qrcode`. Camera is started/stopped in `useEffect` with cleanup on unmount. The `lastScanned` debounce in `Home.jsx` prevents duplicate ADD_ITEM dispatches for the same QR code within 1.5s
- **`components/FilterBar.jsx`** — Reusable filter UI. Which filters render is determined by which keys exist in the `filters` prop object (presence-based, not config). Stock page passes `priceMin/priceMax/size/color`; Sales page passes `amountMin/amountMax`
- **Pages** debounce filter changes by 400ms before firing API calls

### Data Flow: QR Scan → Sale

1. `QRScanner` decodes QR text → calls `Home.handleScan(qrCode)`
2. `handleScan` calls `GET /api/products/qr/{qrCode}` → dispatches `ADD_ITEM` to cart
3. User confirms → `POST /api/sales` with `{ items: [{productId, quantity}] }`
4. `SaleService` decrements stock, snapshots prices, returns `SaleResponseDTO`
5. Frontend clears cart, navigates to `/sales/{id}`

### CSS Strategy

CSS Modules (`*.module.css`) for component-scoped styles. Global utility classes (`btn`, `btn-primary`, `card`, `badge-*`, `error-msg`, `loading`, `empty-state`) defined in `src/styles/global.css`.
