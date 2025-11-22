import { Request, Response } from 'express';
import { runQuery, getQuery, allQuery } from '../database/db';
import { InventoryItem, InventoryMovement } from '../types';

export const getAllInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await allQuery(`
      SELECT
        i.*,
        p.name as product_name,
        p.sku,
        p.price
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      ORDER BY i.last_updated DESC
    `);
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener el inventario' });
  }
};

export const getInventoryByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const inventory = await getQuery(`
      SELECT
        i.*,
        p.name as product_name,
        p.sku,
        p.price
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE i.product_id = ?
    `, [productId]);

    if (!inventory) {
      return res.status(404).json({ success: false, error: 'Inventario no encontrado' });
    }

    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener el inventario' });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity, min_stock, max_stock, location }: InventoryItem = req.body;

    const inventory = await getQuery('SELECT * FROM inventory WHERE product_id = ?', [productId]);
    if (!inventory) {
      return res.status(404).json({ success: false, error: 'Inventario no encontrado' });
    }

    await runQuery(
      `UPDATE inventory
       SET quantity = ?, min_stock = ?, max_stock = ?, location = ?, last_updated = CURRENT_TIMESTAMP
       WHERE product_id = ?`,
      [quantity, min_stock, max_stock, location, productId]
    );

    const updatedInventory = await getQuery('SELECT * FROM inventory WHERE product_id = ?', [productId]);
    res.json({ success: true, data: updatedInventory });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al actualizar el inventario' });
  }
};

export const addInventoryMovement = async (req: Request, res: Response) => {
  try {
    const { product_id, type, quantity, reason }: InventoryMovement = req.body;

    if (!product_id || !type || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'product_id, tipo y cantidad son obligatorios'
      });
    }

    if (!['IN', 'OUT', 'ADJUSTMENT'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Tipo debe ser IN, OUT o ADJUSTMENT'
      });
    }

    // Verificar que el producto existe
    const product = await getQuery('SELECT * FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    // Obtener inventario actual
    const inventory = await getQuery('SELECT * FROM inventory WHERE product_id = ?', [product_id]);
    if (!inventory) {
      return res.status(404).json({ success: false, error: 'Inventario no encontrado' });
    }

    // Calcular nueva cantidad
    let newQuantity = inventory.quantity;
    if (type === 'IN') {
      newQuantity += quantity;
    } else if (type === 'OUT') {
      newQuantity -= quantity;
      if (newQuantity < 0) {
        return res.status(400).json({
          success: false,
          error: 'Stock insuficiente'
        });
      }
    } else if (type === 'ADJUSTMENT') {
      newQuantity = quantity;
    }

    // Registrar movimiento
    const result = await runQuery(
      'INSERT INTO inventory_movements (product_id, type, quantity, reason) VALUES (?, ?, ?, ?)',
      [product_id, type, quantity, reason]
    );

    // Actualizar inventario
    await runQuery(
      'UPDATE inventory SET quantity = ?, last_updated = CURRENT_TIMESTAMP WHERE product_id = ?',
      [newQuantity, product_id]
    );

    const movement = await getQuery('SELECT * FROM inventory_movements WHERE id = ?', [result.id]);
    res.status(201).json({
      success: true,
      data: movement,
      new_quantity: newQuantity
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al registrar el movimiento' });
  }
};

export const getInventoryMovements = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    let movements;
    if (productId) {
      movements = await allQuery(`
        SELECT
          im.*,
          p.name as product_name,
          p.sku
        FROM inventory_movements im
        JOIN products p ON im.product_id = p.id
        WHERE im.product_id = ?
        ORDER BY im.created_at DESC
      `, [productId]);
    } else {
      movements = await allQuery(`
        SELECT
          im.*,
          p.name as product_name,
          p.sku
        FROM inventory_movements im
        JOIN products p ON im.product_id = p.id
        ORDER BY im.created_at DESC
      `);
    }

    res.json({ success: true, data: movements });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener los movimientos' });
  }
};

export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const lowStock = await allQuery(`
      SELECT
        i.*,
        p.name as product_name,
        p.sku,
        p.price
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE i.quantity <= i.min_stock
      ORDER BY i.quantity ASC
    `);

    res.json({ success: true, data: lowStock });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener productos con stock bajo' });
  }
};
