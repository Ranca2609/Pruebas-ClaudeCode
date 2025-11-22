-- ============================================
-- Script de creación de esquema de base de datos
-- Sistema de Gestión de Inventario
-- ============================================

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE NOT NULL,
  price REAL NOT NULL,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento de búsquedas
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Tabla de inventario
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER DEFAULT 1000,
  location TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(product_id)  -- Un producto solo puede tener una entrada de inventario
);

-- Índice para consultas de inventario
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);

-- Tabla de movimientos de inventario (historial)
CREATE TABLE IF NOT EXISTS inventory_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('IN', 'OUT', 'ADJUSTMENT')),
  quantity INTEGER NOT NULL,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Índices para consultas de movimientos
CREATE INDEX IF NOT EXISTS idx_movements_product_id ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_type ON inventory_movements(type);
CREATE INDEX IF NOT EXISTS idx_movements_created_at ON inventory_movements(created_at DESC);

-- ============================================
-- Triggers para mantener consistencia de datos
-- ============================================

-- Trigger para actualizar updated_at en productos
CREATE TRIGGER IF NOT EXISTS update_product_timestamp
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
  UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Trigger para actualizar last_updated en inventario
CREATE TRIGGER IF NOT EXISTS update_inventory_timestamp
AFTER UPDATE ON inventory
FOR EACH ROW
WHEN NEW.quantity != OLD.quantity
BEGIN
  UPDATE inventory SET last_updated = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- ============================================
-- Vistas útiles
-- ============================================

-- Vista de inventario completo con información del producto
CREATE VIEW IF NOT EXISTS v_inventory_full AS
SELECT
  i.id,
  i.product_id,
  p.name AS product_name,
  p.sku,
  p.description,
  p.price,
  p.category,
  i.quantity,
  i.min_stock,
  i.max_stock,
  i.location,
  i.last_updated,
  (i.quantity * p.price) AS total_value,
  CASE
    WHEN i.quantity <= i.min_stock THEN 'BAJO'
    WHEN i.quantity >= i.max_stock THEN 'ALTO'
    ELSE 'NORMAL'
  END AS stock_status
FROM inventory i
JOIN products p ON i.product_id = p.id;

-- Vista de movimientos con información del producto
CREATE VIEW IF NOT EXISTS v_movements_full AS
SELECT
  m.id,
  m.product_id,
  p.name AS product_name,
  p.sku,
  m.type,
  m.quantity,
  m.reason,
  m.created_at
FROM inventory_movements m
JOIN products p ON m.product_id = p.id;

-- Vista de productos con stock bajo
CREATE VIEW IF NOT EXISTS v_low_stock_products AS
SELECT
  p.id,
  p.name,
  p.sku,
  p.category,
  i.quantity,
  i.min_stock,
  i.location,
  (i.min_stock - i.quantity) AS units_needed
FROM products p
JOIN inventory i ON p.id = i.product_id
WHERE i.quantity <= i.min_stock
ORDER BY i.quantity ASC;

-- ============================================
-- Comentarios sobre el esquema
-- ============================================

-- PRODUCTOS:
-- - Almacena información básica de productos
-- - SKU es único y obligatorio
-- - Precio es obligatorio (tipo REAL para decimales)

-- INVENTARIO:
-- - Una entrada por producto (relación 1:1)
-- - Cantidad actual en stock
-- - Niveles mínimo y máximo para alertas
-- - Ubicación física del producto

-- MOVIMIENTOS:
-- - Historial completo de cambios en inventario
-- - Tipos: IN (entrada), OUT (salida), ADJUSTMENT (ajuste)
-- - Registra fecha y razón del movimiento

-- INTEGRIDAD REFERENCIAL:
-- - ON DELETE CASCADE: Al eliminar un producto se eliminan
--   sus registros de inventario y movimientos
