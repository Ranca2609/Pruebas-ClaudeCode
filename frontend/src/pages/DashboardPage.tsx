import { useState, useEffect } from 'react';
import { inventoryApi, productsApi } from '../services/api';
import { InventoryItem, Product } from '../types';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInventoryValue: 0,
    lowStockCount: 0,
    totalUnits: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar productos
      const productsResponse = await productsApi.getAll();
      const products: Product[] = productsResponse.data.data || [];

      // Cargar inventario
      const inventoryResponse = await inventoryApi.getAll();
      const inventory: InventoryItem[] = inventoryResponse.data.data || [];

      // Cargar productos con stock bajo
      const lowStockResponse = await inventoryApi.getLowStock();
      const lowStock: InventoryItem[] = lowStockResponse.data.data || [];

      // Calcular estadísticas
      const totalValue = inventory.reduce((sum, item) => {
        return sum + (item.quantity * (item.price || 0));
      }, 0);

      const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);

      setStats({
        totalProducts: products.length,
        totalInventoryValue: totalValue,
        lowStockCount: lowStock.length,
        totalUnits,
      });

      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      alert('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card info">
          <h3>Total Productos</h3>
          <div className="stat-value">{stats.totalProducts}</div>
        </div>

        <div className="stat-card success">
          <h3>Unidades en Stock</h3>
          <div className="stat-value">{stats.totalUnits}</div>
        </div>

        <div className="stat-card warning">
          <h3>Valor Total Inventario</h3>
          <div className="stat-value">${stats.totalInventoryValue.toFixed(2)}</div>
        </div>

        <div className="stat-card danger">
          <h3>Productos Stock Bajo</h3>
          <div className="stat-value">{stats.lowStockCount}</div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="card">
          <h2>Alertas de Stock Bajo</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Producto</th>
                  <th>Cantidad Actual</th>
                  <th>Stock Mínimo</th>
                  <th>Unidades Necesarias</th>
                  <th>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.sku}</strong></td>
                    <td>{item.product_name}</td>
                    <td>
                      <span className="badge badge-danger">
                        {item.quantity}
                      </span>
                    </td>
                    <td>{item.min_stock}</td>
                    <td>
                      <strong>{item.min_stock - item.quantity}</strong>
                    </td>
                    <td>{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {lowStockProducts.length === 0 && (
        <div className="card">
          <div className="alert alert-success">
            ✓ No hay productos con stock bajo en este momento
          </div>
        </div>
      )}
    </div>
  );
}
