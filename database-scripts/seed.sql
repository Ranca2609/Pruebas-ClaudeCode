-- ============================================
-- Script de datos de ejemplo (seed)
-- Sistema de Gestión de Inventario
-- ============================================

-- Insertar productos de ejemplo
INSERT INTO products (name, description, sku, price, category) VALUES
  ('Laptop Dell XPS 15', 'Laptop de alto rendimiento con procesador Intel i7', 'DELL-XPS-001', 1299.99, 'Electrónica'),
  ('Mouse Logitech MX Master 3', 'Mouse inalámbrico ergonómico', 'LOG-MOUSE-001', 99.99, 'Accesorios'),
  ('Teclado Mecánico Corsair K95', 'Teclado mecánico RGB gaming', 'CORS-KB-001', 199.99, 'Accesorios'),
  ('Monitor LG UltraWide 34"', 'Monitor panorámico 34 pulgadas 1440p', 'LG-MON-001', 699.99, 'Electrónica'),
  ('Webcam Logitech C920', 'Cámara web Full HD 1080p', 'LOG-CAM-001', 79.99, 'Accesorios'),
  ('Auriculares Sony WH-1000XM4', 'Auriculares inalámbricos con cancelación de ruido', 'SONY-AUD-001', 349.99, 'Audio'),
  ('Disco SSD Samsung 1TB', 'Unidad de estado sólido NVMe 1TB', 'SAMS-SSD-001', 129.99, 'Almacenamiento'),
  ('RAM Corsair Vengeance 16GB', 'Memoria RAM DDR4 16GB 3200MHz', 'CORS-RAM-001', 79.99, 'Componentes'),
  ('Hub USB-C Anker', 'Hub multipuerto USB-C con HDMI y USB 3.0', 'ANK-HUB-001', 49.99, 'Accesorios'),
  ('Silla Ergonómica Herman Miller', 'Silla de oficina ergonómica premium', 'HM-CHAIR-001', 1499.99, 'Mobiliario'),
  ('Tablet iPad Air', 'Tablet Apple iPad Air 256GB', 'APL-TAB-001', 749.99, 'Electrónica'),
  ('Impresora HP LaserJet', 'Impresora láser monocromática', 'HP-PRINT-001', 299.99, 'Oficina'),
  ('Router WiFi 6 TP-Link', 'Router inalámbrico WiFi 6 de doble banda', 'TPL-ROUT-001', 149.99, 'Redes'),
  ('Cable HDMI 2.1', 'Cable HDMI 2.1 certificado 2 metros', 'GEN-HDMI-001', 19.99, 'Cables'),
  ('Mousepad RGB Razer', 'Alfombrilla gaming con iluminación RGB', 'RAZ-PAD-001', 39.99, 'Accesorios');

-- Insertar inventario inicial para cada producto
INSERT INTO inventory (product_id, quantity, min_stock, max_stock, location) VALUES
  (1, 15, 5, 50, 'Almacén Principal - Pasillo A1'),
  (2, 45, 10, 100, 'Almacén Principal - Pasillo B2'),
  (3, 30, 10, 80, 'Almacén Principal - Pasillo B2'),
  (4, 8, 5, 30, 'Almacén Principal - Pasillo A1'),
  (5, 25, 8, 60, 'Almacén Principal - Pasillo B3'),
  (6, 12, 5, 40, 'Almacén Principal - Pasillo C1'),
  (7, 60, 15, 150, 'Almacén Principal - Pasillo D1'),
  (8, 40, 12, 120, 'Almacén Principal - Pasillo D1'),
  (9, 35, 10, 80, 'Almacén Principal - Pasillo B3'),
  (10, 4, 2, 15, 'Almacén Principal - Pasillo E1'),
  (11, 20, 8, 50, 'Almacén Principal - Pasillo A2'),
  (12, 6, 3, 20, 'Almacén Principal - Pasillo F1'),
  (13, 18, 5, 40, 'Almacén Principal - Pasillo G1'),
  (14, 100, 30, 200, 'Almacén Principal - Pasillo B1'),
  (15, 22, 10, 60, 'Almacén Principal - Pasillo B2');

-- Insertar movimientos de inventario de ejemplo
INSERT INTO inventory_movements (product_id, type, quantity, reason) VALUES
  -- Movimientos de entrada inicial
  (1, 'IN', 15, 'Stock inicial - Compra a proveedor Dell'),
  (2, 'IN', 50, 'Stock inicial - Compra a distribuidor'),
  (3, 'IN', 35, 'Stock inicial - Compra a Corsair'),
  (4, 'IN', 10, 'Stock inicial - Compra a LG'),
  (5, 'IN', 30, 'Stock inicial - Compra a distribuidor'),

  -- Movimientos de salida (ventas)
  (2, 'OUT', 5, 'Venta a cliente - Pedido #1001'),
  (3, 'OUT', 5, 'Venta a cliente - Pedido #1002'),
  (4, 'OUT', 2, 'Venta corporativa - Empresa XYZ'),
  (5, 'OUT', 5, 'Venta a cliente - Pedido #1003'),

  -- Ajustes de inventario
  (1, 'ADJUSTMENT', 15, 'Ajuste post-auditoría física'),
  (6, 'IN', 12, 'Stock inicial - Compra a Sony'),
  (7, 'IN', 60, 'Stock inicial - Compra a Samsung'),
  (8, 'IN', 40, 'Stock inicial - Compra a Corsair'),

  -- Más ventas
  (7, 'OUT', 10, 'Venta mayorista - Distribuidor ABC'),
  (8, 'OUT', 8, 'Venta a clientes varios - Pedidos múltiples'),
  (14, 'IN', 100, 'Stock inicial - Compra a mayorista'),

  -- Devoluciones (entradas)
  (2, 'IN', 2, 'Devolución de cliente - Producto defectuoso'),
  (3, 'IN', 1, 'Devolución de cliente'),

  -- Más compras
  (9, 'IN', 35, 'Stock inicial - Compra a Anker'),
  (10, 'IN', 4, 'Stock inicial - Compra a Herman Miller'),
  (11, 'IN', 20, 'Stock inicial - Compra a Apple'),
  (12, 'IN', 6, 'Stock inicial - Compra a HP'),
  (13, 'IN', 18, 'Stock inicial - Compra a TP-Link'),
  (15, 'IN', 25, 'Stock inicial - Compra a Razer'),

  -- Ventas recientes
  (11, 'OUT', 3, 'Venta corporativa - Startup Tech'),
  (15, 'OUT', 3, 'Venta a clientes gaming'),

  -- Ajustes por inventario físico
  (2, 'ADJUSTMENT', 45, 'Ajuste tras conteo físico trimestral'),
  (14, 'ADJUSTMENT', 100, 'Ajuste tras conteo físico trimestral');

-- ============================================
-- Verificación de datos insertados
-- ============================================

-- Contar productos insertados
-- SELECT COUNT(*) as total_productos FROM products;

-- Contar entradas de inventario
-- SELECT COUNT(*) as total_inventario FROM inventory;

-- Contar movimientos registrados
-- SELECT COUNT(*) as total_movimientos FROM inventory_movements;

-- Ver productos con stock bajo (usando la vista)
-- SELECT * FROM v_low_stock_products;

-- Ver valor total del inventario
-- SELECT
--   SUM(quantity * price) as valor_total_inventario,
--   COUNT(*) as total_productos,
--   SUM(quantity) as total_unidades
-- FROM v_inventory_full;

-- ============================================
-- Notas sobre los datos de ejemplo
-- ============================================

-- Este script crea:
-- - 15 productos de diferentes categorías
-- - 15 entradas de inventario (una por producto)
-- - ~30 movimientos de inventario simulando:
--   * Compras iniciales (IN)
--   * Ventas (OUT)
--   * Devoluciones (IN)
--   * Ajustes de inventario (ADJUSTMENT)

-- Los productos incluyen diferentes niveles de stock:
-- - Algunos con stock normal
-- - Algunos con stock bajo (para probar alertas)
-- - Variedad de ubicaciones en el almacén

-- Para reiniciar los datos:
-- DELETE FROM inventory_movements;
-- DELETE FROM inventory;
-- DELETE FROM products;
-- Luego volver a ejecutar este script
