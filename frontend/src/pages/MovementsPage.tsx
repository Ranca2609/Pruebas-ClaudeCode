import { useState, useEffect } from 'react';
import { inventoryApi } from '../services/api';
import { InventoryMovement } from '../types';

export default function MovementsPage() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      setLoading(true);
      const response = await inventoryApi.getMovements();
      setMovements(response.data.data || []);
    } catch (error) {
      console.error('Error loading movements:', error);
      alert('Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  };

  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case 'IN':
        return <span className="badge badge-success">ENTRADA</span>;
      case 'OUT':
        return <span className="badge badge-danger">SALIDA</span>;
      case 'ADJUSTMENT':
        return <span className="badge badge-warning">AJUSTE</span>;
      default:
        return <span className="badge">{type}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Cargando movimientos...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Historial de Movimientos de Inventario</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>SKU</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Razón</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay movimientos registrados
                  </td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{formatDate(movement.created_at!)}</td>
                    <td><strong>{movement.sku}</strong></td>
                    <td>{movement.product_name}</td>
                    <td>{getMovementTypeBadge(movement.type)}</td>
                    <td>
                      <strong>
                        {movement.type === 'OUT' ? '-' : '+'}
                        {movement.quantity}
                      </strong>
                    </td>
                    <td>{movement.reason || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
