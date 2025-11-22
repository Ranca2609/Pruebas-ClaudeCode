import sqlite3 from 'sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database.db');

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabla de productos
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          sku TEXT UNIQUE NOT NULL,
          price REAL NOT NULL,
          category TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creando tabla products:', err);
          reject(err);
          return;
        }
      });

      // Tabla de inventario
      db.run(`
        CREATE TABLE IF NOT EXISTS inventory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          min_stock INTEGER DEFAULT 0,
          max_stock INTEGER DEFAULT 1000,
          location TEXT,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creando tabla inventory:', err);
          reject(err);
          return;
        }
      });

      // Tabla de movimientos de inventario
      db.run(`
        CREATE TABLE IF NOT EXISTS inventory_movements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('IN', 'OUT', 'ADJUSTMENT')),
          quantity INTEGER NOT NULL,
          reason TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creando tabla inventory_movements:', err);
          reject(err);
          return;
        }
        console.log('Base de datos inicializada correctamente');
        resolve();
      });
    });
  });
};

export const runQuery = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

export const getQuery = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

export const allQuery = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
