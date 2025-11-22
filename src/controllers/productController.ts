import { Request, Response } from 'express';
import { runQuery, getQuery, allQuery } from '../database/db';
import { Product } from '../types';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await allQuery('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener productos' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getQuery('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener el producto' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, sku, price, category }: Product = req.body;

    if (!name || !sku || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, SKU y precio son obligatorios'
      });
    }

    const result = await runQuery(
      'INSERT INTO products (name, description, sku, price, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, sku, price, category]
    );

    // Crear entrada de inventario para el nuevo producto
    await runQuery(
      'INSERT INTO inventory (product_id, quantity, location) VALUES (?, ?, ?)',
      [result.id, 0, 'Almacén principal']
    );

    const newProduct = await getQuery('SELECT * FROM products WHERE id = ?', [result.id]);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ success: false, error: 'El SKU ya existe' });
    }
    res.status(500).json({ success: false, error: 'Error al crear el producto' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, sku, price, category }: Product = req.body;

    const product = await getQuery('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    await runQuery(
      `UPDATE products
       SET name = ?, description = ?, sku = ?, price = ?, category = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, sku, price, category, id]
    );

    const updatedProduct = await getQuery('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ success: false, error: 'El SKU ya existe' });
    }
    res.status(500).json({ success: false, error: 'Error al actualizar el producto' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await getQuery('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    await runQuery('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar el producto' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, error: 'Parámetro de búsqueda requerido' });
    }

    const products = await allQuery(
      `SELECT * FROM products
       WHERE name LIKE ? OR sku LIKE ? OR description LIKE ? OR category LIKE ?
       ORDER BY created_at DESC`,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al buscar productos' });
  }
};
