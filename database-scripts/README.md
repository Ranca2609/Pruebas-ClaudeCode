# Scripts de Base de Datos

Esta carpeta contiene los scripts SQL necesarios para crear y poblar la base de datos del sistema de gestión de inventario.

## Archivos

### 1. `schema.sql`
Contiene el esquema completo de la base de datos:
- ✅ Definición de tablas (products, inventory, inventory_movements)
- ✅ Índices para optimizar consultas
- ✅ Restricciones de integridad referencial
- ✅ Triggers para actualización automática de timestamps
- ✅ Vistas útiles para consultas comunes

### 2. `seed.sql`
Contiene datos de ejemplo para pruebas:
- 15 productos de diferentes categorías
- Inventario inicial para cada producto
- ~30 movimientos de inventario simulando operaciones reales
- Productos con diferentes niveles de stock (incluyendo stock bajo)

## Cómo usar estos scripts

### Opción 1: Usando SQLite desde la línea de comandos

#### Crear la base de datos y el esquema:
```bash
# Crear base de datos e importar esquema
sqlite3 database.db < database-scripts/schema.sql

# Importar datos de ejemplo (opcional)
sqlite3 database.db < database-scripts/seed.sql
```

#### Verificar que se creó correctamente:
```bash
sqlite3 database.db "SELECT COUNT(*) as total FROM products;"
sqlite3 database.db "SELECT * FROM v_low_stock_products;"
```

### Opción 2: Usando la aplicación (Recomendado)

La aplicación crea automáticamente las tablas al iniciar si no existen. Solo necesitas:

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

La aplicación creará automáticamente el archivo `database.db` con todas las tablas.

Para agregar datos de ejemplo después:
```bash
sqlite3 database.db < database-scripts/seed.sql
```

### Opción 3: Usando un cliente gráfico de SQLite

1. Descarga un cliente como [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Crea una nueva base de datos o abre `database.db`
3. Ve a la pestaña "Execute SQL"
4. Copia y pega el contenido de `schema.sql`
5. Ejecuta el script
6. Repite con `seed.sql` si quieres datos de ejemplo

## Estructura de las Tablas

### products
Almacena la información de productos:
- `id`: Identificador único
- `name`: Nombre del producto
- `description`: Descripción detallada
- `sku`: Código único del producto (SKU)
- `price`: Precio del producto
- `category`: Categoría del producto
- `created_at`, `updated_at`: Timestamps

### inventory
Gestiona el stock actual:
- `id`: Identificador único
- `product_id`: Referencia al producto
- `quantity`: Cantidad actual en stock
- `min_stock`: Stock mínimo (para alertas)
- `max_stock`: Stock máximo
- `location`: Ubicación física en almacén
- `last_updated`: Última actualización

### inventory_movements
Historial de movimientos:
- `id`: Identificador único
- `product_id`: Referencia al producto
- `type`: Tipo de movimiento (IN/OUT/ADJUSTMENT)
- `quantity`: Cantidad del movimiento
- `reason`: Razón del movimiento
- `created_at`: Fecha del movimiento

## Vistas Útiles

El esquema incluye vistas para consultas comunes:

### v_inventory_full
Vista completa del inventario con información del producto:
```sql
SELECT * FROM v_inventory_full;
```

### v_movements_full
Movimientos con información del producto:
```sql
SELECT * FROM v_movements_full ORDER BY created_at DESC LIMIT 10;
```

### v_low_stock_products
Productos con stock bajo:
```sql
SELECT * FROM v_low_stock_products;
```

## Consultas Útiles

### Ver valor total del inventario:
```sql
SELECT
  SUM(quantity * price) as valor_total,
  COUNT(*) as total_productos,
  SUM(quantity) as total_unidades
FROM v_inventory_full;
```

### Ver productos más vendidos:
```sql
SELECT
  p.name,
  p.sku,
  SUM(m.quantity) as total_vendido
FROM inventory_movements m
JOIN products p ON m.product_id = p.id
WHERE m.type = 'OUT'
GROUP BY m.product_id
ORDER BY total_vendido DESC
LIMIT 10;
```

### Ver movimientos de un producto específico:
```sql
SELECT * FROM v_movements_full
WHERE product_id = 1
ORDER BY created_at DESC;
```

## Resetear la Base de Datos

Si necesitas empezar desde cero:

```bash
# Eliminar base de datos actual
rm database.db

# Recrear con esquema
sqlite3 database.db < database-scripts/schema.sql

# Agregar datos de ejemplo (opcional)
sqlite3 database.db < database-scripts/seed.sql
```

O usando SQL:
```sql
-- Eliminar todos los datos (mantiene estructura)
DELETE FROM inventory_movements;
DELETE FROM inventory;
DELETE FROM products;

-- Resetear autoincrement
DELETE FROM sqlite_sequence;
```

## Notas Importantes

1. **Orden de ejecución**: Siempre ejecuta `schema.sql` antes que `seed.sql`
2. **Integridad referencial**: Los datos se eliminan en cascada (producto → inventario → movimientos)
3. **Triggers**: Los timestamps se actualizan automáticamente, no necesitas hacerlo manualmente
4. **Vistas**: Son solo-lectura, usa las tablas directamente para INSERT/UPDATE/DELETE
5. **SQLite**: La base de datos está en un solo archivo, fácil de respaldar

## Troubleshooting

### "Error: table already exists"
La tabla ya existe. Si quieres recrearla:
```sql
DROP TABLE IF EXISTS inventory_movements;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS products;
```
Luego ejecuta `schema.sql` nuevamente.

### "Error: FOREIGN KEY constraint failed"
Asegúrate de ejecutar los scripts en orden y de que los productos existan antes de crear inventario.

### "Error: UNIQUE constraint failed"
El SKU ya existe. Cada producto debe tener un SKU único. Cambia el SKU o elimina el producto existente.

## Respaldo y Restauración

### Crear respaldo:
```bash
# Respaldo completo
sqlite3 database.db ".backup backup.db"

# Exportar a SQL
sqlite3 database.db .dump > backup.sql
```

### Restaurar desde respaldo:
```bash
# Desde archivo .db
cp backup.db database.db

# Desde SQL
sqlite3 database.db < backup.sql
```
