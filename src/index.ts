import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database/db';
import productRoutes from './routes/productRoutes';
import inventoryRoutes from './routes/inventoryRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API de Gestión de Inventario',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      inventory: '/api/inventory'
    }
  });
});

app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' });
});

// Inicializar base de datos y servidor
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Endpoints disponibles:`);
      console.log(`  - GET    http://localhost:${PORT}/api/products`);
      console.log(`  - POST   http://localhost:${PORT}/api/products`);
      console.log(`  - GET    http://localhost:${PORT}/api/products/:id`);
      console.log(`  - PUT    http://localhost:${PORT}/api/products/:id`);
      console.log(`  - DELETE http://localhost:${PORT}/api/products/:id`);
      console.log(`  - GET    http://localhost:${PORT}/api/products/search?query=...`);
      console.log(`  - GET    http://localhost:${PORT}/api/inventory`);
      console.log(`  - GET    http://localhost:${PORT}/api/inventory/low-stock`);
      console.log(`  - GET    http://localhost:${PORT}/api/inventory/product/:productId`);
      console.log(`  - PUT    http://localhost:${PORT}/api/inventory/product/:productId`);
      console.log(`  - POST   http://localhost:${PORT}/api/inventory/movements`);
      console.log(`  - GET    http://localhost:${PORT}/api/inventory/movements`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
