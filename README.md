# Backend de Gestión de Inventario

Sistema backend completo para gestión de productos e inventarios desarrollado con Node.js, TypeScript y SQLite.

## Características

- ✅ CRUD completo de productos
- ✅ Gestión de inventario en tiempo real
- ✅ Registro de movimientos de stock (entradas, salidas, ajustes)
- ✅ Alertas de stock bajo
- ✅ Búsqueda de productos
- ✅ API RESTful
- ✅ Base de datos SQLite
- ✅ TypeScript para type safety

## Requisitos

- Node.js (v16 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd Pruebas-ClaudeCode
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar `.env` si es necesario (opcional):
```
PORT=3000
DB_PATH=./database.db
```

## Uso

### Modo Desarrollo
```bash
npm run dev
```

### Modo Producción
```bash
# Compilar TypeScript
npm run build

# Ejecutar
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── controllers/          # Lógica de negocio
│   ├── productController.ts
│   └── inventoryController.ts
├── routes/              # Definición de rutas
│   ├── productRoutes.ts
│   └── inventoryRoutes.ts
├── database/            # Configuración de base de datos
│   └── db.ts
├── types/               # Tipos TypeScript
│   └── index.ts
└── index.ts            # Punto de entrada de la aplicación
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

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **SQLite** - Base de datos
- **CORS** - Middleware para CORS
- **dotenv** - Gestión de variables de entorno

## Licencia

ISC