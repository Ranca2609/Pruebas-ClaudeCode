# API de Gestión de Inventario - Documentación

## Información General

- **Base URL**: `http://localhost:3000`
- **Formato de respuesta**: JSON
- **Puerto por defecto**: 3000

## Estructura de Respuestas

Todas las respuestas siguen este formato:

```json
{
  "success": true|false,
  "data": {...} | [...],
  "error": "mensaje de error" // solo si success es false
}
```

---

## Endpoints de Productos

### 1. Obtener todos los productos

**GET** `/api/products`

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop Dell XPS 15",
      "description": "Laptop de alto rendimiento",
      "sku": "DELL-XPS-001",
      "price": 1299.99,
      "category": "Electrónica",
      "created_at": "2025-11-22 10:00:00",
      "updated_at": "2025-11-22 10:00:00"
    }
  ]
}
```

### 2. Obtener producto por ID

**GET** `/api/products/:id`

**Parámetros**:
- `id` (número) - ID del producto

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Dell XPS 15",
    "description": "Laptop de alto rendimiento",
    "sku": "DELL-XPS-001",
    "price": 1299.99,
    "category": "Electrónica",
    "created_at": "2025-11-22 10:00:00",
    "updated_at": "2025-11-22 10:00:00"
  }
}
```

**Error (404)**:
```json
{
  "success": false,
  "error": "Producto no encontrado"
}
```

### 3. Crear producto

**POST** `/api/products`

**Body (JSON)**:
```json
{
  "name": "Laptop Dell XPS 15",
  "description": "Laptop de alto rendimiento",
  "sku": "DELL-XPS-001",
  "price": 1299.99,
  "category": "Electrónica"
}
```

**Campos obligatorios**: `name`, `sku`, `price`

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Dell XPS 15",
    "description": "Laptop de alto rendimiento",
    "sku": "DELL-XPS-001",
    "price": 1299.99,
    "category": "Electrónica",
    "created_at": "2025-11-22 10:00:00",
    "updated_at": "2025-11-22 10:00:00"
  }
}
```

**Nota**: Al crear un producto, automáticamente se crea una entrada de inventario con cantidad 0.

### 4. Actualizar producto

**PUT** `/api/products/:id`

**Parámetros**:
- `id` (número) - ID del producto

**Body (JSON)**:
```json
{
  "name": "Laptop Dell XPS 15 Pro",
  "description": "Laptop de alto rendimiento actualizada",
  "sku": "DELL-XPS-001",
  "price": 1399.99,
  "category": "Electrónica"
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Dell XPS 15 Pro",
    "description": "Laptop de alto rendimiento actualizada",
    "sku": "DELL-XPS-001",
    "price": 1399.99,
    "category": "Electrónica",
    "created_at": "2025-11-22 10:00:00",
    "updated_at": "2025-11-22 11:30:00"
  }
}
```

### 5. Eliminar producto

**DELETE** `/api/products/:id`

**Parámetros**:
- `id` (número) - ID del producto

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "message": "Producto eliminado correctamente"
}
```

### 6. Buscar productos

**GET** `/api/products/search?query={término}`

**Query Parameters**:
- `query` (string) - Término de búsqueda (busca en name, sku, description, category)

**Ejemplo**: `/api/products/search?query=laptop`

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop Dell XPS 15",
      "description": "Laptop de alto rendimiento",
      "sku": "DELL-XPS-001",
      "price": 1299.99,
      "category": "Electrónica"
    }
  ]
}
```

---

## Endpoints de Inventario

### 1. Obtener todo el inventario

**GET** `/api/inventory`

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 50,
      "min_stock": 10,
      "max_stock": 100,
      "location": "Almacén principal",
      "last_updated": "2025-11-22 10:00:00",
      "product_name": "Laptop Dell XPS 15",
      "sku": "DELL-XPS-001",
      "price": 1299.99
    }
  ]
}
```

### 2. Obtener inventario por producto

**GET** `/api/inventory/product/:productId`

**Parámetros**:
- `productId` (número) - ID del producto

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_id": 1,
    "quantity": 50,
    "min_stock": 10,
    "max_stock": 100,
    "location": "Almacén principal",
    "last_updated": "2025-11-22 10:00:00",
    "product_name": "Laptop Dell XPS 15",
    "sku": "DELL-XPS-001",
    "price": 1299.99
  }
}
```

### 3. Actualizar inventario

**PUT** `/api/inventory/product/:productId`

**Parámetros**:
- `productId` (número) - ID del producto

**Body (JSON)**:
```json
{
  "quantity": 75,
  "min_stock": 15,
  "max_stock": 150,
  "location": "Almacén secundario"
}
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_id": 1,
    "quantity": 75,
    "min_stock": 15,
    "max_stock": 150,
    "location": "Almacén secundario",
    "last_updated": "2025-11-22 12:00:00"
  }
}
```

### 4. Registrar movimiento de inventario

**POST** `/api/inventory/movements`

**Body (JSON)**:
```json
{
  "product_id": 1,
  "type": "IN",
  "quantity": 20,
  "reason": "Compra de proveedor"
}
```

**Campos obligatorios**: `product_id`, `type`, `quantity`

**Tipos de movimiento**:
- `IN` - Entrada de stock
- `OUT` - Salida de stock
- `ADJUSTMENT` - Ajuste de inventario (establece la cantidad exacta)

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_id": 1,
    "type": "IN",
    "quantity": 20,
    "reason": "Compra de proveedor",
    "created_at": "2025-11-22 12:30:00"
  },
  "new_quantity": 70
}
```

**Errores comunes**:
- Stock insuficiente para salidas (400)
- Tipo de movimiento inválido (400)
- Producto no encontrado (404)

### 5. Obtener movimientos de inventario

**GET** `/api/inventory/movements`

Obtiene todos los movimientos de inventario.

**GET** `/api/inventory/movements/:productId`

Obtiene movimientos de un producto específico.

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "type": "IN",
      "quantity": 20,
      "reason": "Compra de proveedor",
      "created_at": "2025-11-22 12:30:00",
      "product_name": "Laptop Dell XPS 15",
      "sku": "DELL-XPS-001"
    }
  ]
}
```

### 6. Obtener productos con stock bajo

**GET** `/api/inventory/low-stock`

Retorna productos cuya cantidad es menor o igual al stock mínimo.

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "product_id": 2,
      "quantity": 5,
      "min_stock": 10,
      "max_stock": 50,
      "location": "Almacén principal",
      "last_updated": "2025-11-22 10:00:00",
      "product_name": "Mouse Logitech",
      "sku": "LOG-MOUSE-001",
      "price": 29.99
    }
  ]
}
```

---

## Códigos de Estado HTTP

- **200 OK** - Solicitud exitosa
- **201 Created** - Recurso creado exitosamente
- **400 Bad Request** - Datos inválidos o faltantes
- **404 Not Found** - Recurso no encontrado
- **500 Internal Server Error** - Error del servidor

---

## Ejemplos de Uso con cURL

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

### Obtener productos con stock bajo:
```bash
curl http://localhost:3000/api/inventory/low-stock
```

---

## Notas Importantes

1. Al crear un producto, se crea automáticamente una entrada de inventario con cantidad 0
2. Al eliminar un producto, se eliminan en cascada su inventario y movimientos
3. Los movimientos de tipo "OUT" validan que haya stock suficiente
4. Los movimientos de tipo "ADJUSTMENT" establecen la cantidad exacta
5. Las búsquedas de productos son case-insensitive y buscan en múltiples campos
