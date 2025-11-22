# Sistema de Gestión de Inventario

Sistema completo de gestión de productos e inventarios con backend Node.js y frontend React.

## Características

### Backend
- ✅ API RESTful completa
- ✅ CRUD de productos
- ✅ Gestión de inventario en tiempo real
- ✅ Registro de movimientos de stock (entradas, salidas, ajustes)
- ✅ Alertas de stock bajo
- ✅ Búsqueda de productos
- ✅ Base de datos SQLite con vistas y triggers
- ✅ TypeScript para type safety

### Frontend
- ✅ Interfaz web moderna con React + Vite
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión completa de productos (crear, editar, eliminar, buscar)
- ✅ Control de inventario con alertas visuales
- ✅ Registro de movimientos de stock
- ✅ Historial completo de operaciones
- ✅ Diseño responsive (móvil, tablet, desktop)

## Requisitos

- Node.js (v16 o superior)
- npm o yarn

## Inicio Rápido

### Backend

1. Instalar dependencias del backend:
```bash
npm install
```

2. Configurar variables de entorno (opcional):
```bash
cp .env.example .env
```

3. Iniciar el servidor backend:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Frontend

1. Ir a la carpeta frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar la aplicación web:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Opción: Cargar datos de ejemplo

```bash
# Desde la raíz del proyecto
sqlite3 database.db < database-scripts/seed.sql
```

Ahora puedes acceder a `http://localhost:5173` para ver la aplicación web funcionando.

## Scripts de Base de Datos

La carpeta `database-scripts/` contiene scripts SQL para crear y poblar la base de datos:

### Crear base de datos desde cero:
```bash
# Crear esquema (tablas, índices, vistas, triggers)
sqlite3 database.db < database-scripts/schema.sql

# Opcional: Cargar datos de ejemplo
sqlite3 database.db < database-scripts/seed.sql
```

**Nota**: La aplicación crea automáticamente las tablas al iniciar si no existen. Los scripts son útiles si prefieres crear la base de datos manualmente o necesitas cargar datos de ejemplo.

Ver [database-scripts/README.md](./database-scripts/README.md) para documentación detallada de los scripts.

## Estructura del Proyecto

```
Pruebas-ClaudeCode/
├── src/                      # Backend (Node.js + Express)
│   ├── controllers/          # Lógica de negocio
│   ├── routes/              # Definición de rutas API
│   ├── database/            # Configuración de SQLite
│   ├── types/               # Tipos TypeScript
│   └── index.ts            # Punto de entrada del servidor
│
├── frontend/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios API
│   │   ├── types/          # Tipos TypeScript
│   │   ├── App.tsx         # Componente principal
│   │   └── main.tsx        # Punto de entrada
│   ├── index.html
│   └── vite.config.ts
│
├── database-scripts/        # Scripts SQL
│   ├── schema.sql          # Esquema de base de datos
│   ├── seed.sql            # Datos de ejemplo
│   └── README.md           # Documentación
│
├── API_DOCUMENTATION.md     # Documentación del API
├── package.json            # Dependencias del backend
└── README.md              # Este archivo
```

## Endpoints Principales

### Productos
- `GET /api/products` - Obtener todos los productos
- `POST /api/products` - Crear producto
- `GET /api/products/:id` - Obtener producto por ID
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/search?query=...` - Buscar productos

### Inventario
- `GET /api/inventory` - Obtener todo el inventario
- `GET /api/inventory/low-stock` - Productos con stock bajo
- `GET /api/inventory/product/:productId` - Inventario de un producto
- `PUT /api/inventory/product/:productId` - Actualizar inventario
- `POST /api/inventory/movements` - Registrar movimiento
- `GET /api/inventory/movements` - Obtener todos los movimientos
- `GET /api/inventory/movements/:productId` - Movimientos de un producto

## Documentación Completa

Ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para documentación detallada de todos los endpoints con ejemplos.

## Ejemplo de Uso

### Crear un producto:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell XPS 15",
    "description": "Laptop de alto rendimiento",
    "sku": "DELL-XPS-001",
    "price": 1299.99,
    "category": "Electrónica"
  }'
```

### Registrar entrada de stock:
```bash
curl -X POST http://localhost:3000/api/inventory/movements \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "type": "IN",
    "quantity": 50,
    "reason": "Compra inicial"
  }'
```

## Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **SQLite** - Base de datos embebida
- **CORS** - Middleware para CORS
- **dotenv** - Gestión de variables de entorno

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **React Router** - Navegación
- **Axios** - Cliente HTTP

## Documentación Adicional

- [Documentación del API Backend](./API_DOCUMENTATION.md)
- [Scripts de Base de Datos](./database-scripts/README.md)
- [Frontend README](./frontend/README.md)

## Licencia

ISC