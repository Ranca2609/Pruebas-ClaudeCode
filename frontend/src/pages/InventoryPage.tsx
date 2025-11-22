import { useState, useEffect } from 'react';
import { inventoryApi, productsApi } from '../services/api';
import { InventoryItem, Product } from '../types';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [inventoryForm, setInventoryForm] = useState({
    quantity: 0,
    min_stock: 0,
    max_stock: 0,
    location: '',
  });

  const [movementForm, setMovementForm] = useState({
    product_id: 0,
    type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT',
    quantity: 0,
    reason: '',
  });

  useEffect(() => {
    loadInventory();
    loadProducts();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryApi.getAll();
      setInventory(response.data.data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      alert('Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsApi.getAll();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setInventoryForm({
      quantity: item.quantity,
      min_stock: item.min_stock,
      max_stock: item.max_stock,
      location: item.location,
    });
    setShowModal(true);
  };

  const handleUpdateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      await inventoryApi.update(selectedItem.product_id, inventoryForm);
      alert('Inventario actualizado exitosamente');
      setShowModal(false);
      loadInventory();
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Error al actualizar inventario');
    }
  };

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await inventoryApi.addMovement(movementForm);
      alert(`Movimiento registrado. Nueva cantidad: ${response.data.new_quantity}`);
      setShowMovementModal(false);
      setMovementForm({
        product_id: 0,
        type: 'IN',
        quantity: 0,
        reason: '',
      });
      loadInventory();
    } catch (error: any) {
      console.error('Error adding movement:', error);
      alert(error.response?.data?.error || 'Error al registrar movimiento');
    }
  };

  const getStockBadge = (item: InventoryItem) => {
    if (item.quantity <= item.min_stock) {
      return <span className="badge badge-danger">Stock Bajo</span>;
    } else if (item.quantity >= item.max_stock) {
      return <span className="badge badge-warning">Stock Alto</span>;
    }
    return <span className="badge badge-success">Normal</span>;
  };

  if (loading) {
    return <div className="loading">Cargando inventario...</div>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Gestión de Inventario</h2>
          <button className="btn btn-primary" onClick={() => setShowMovementModal(true)}>
            + Registrar Movimiento
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Min/Max</th>
                <th>Estado</th>
                <th>Ubicación</th>
                <th>Precio Unit.</th>
                <th>Valor Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay inventario para mostrar
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.sku}</strong></td>
                    <td>{item.product_name}</td>
                    <td><strong>{item.quantity}</strong></td>
                    <td>{item.min_stock} / {item.max_stock}</td>
                    <td>{getStockBadge(item)}</td>
                    <td>{item.location}</td>
                    <td>${item.price?.toFixed(2)}</td>
                    <td><strong>${(item.quantity * (item.price || 0)).toFixed(2)}</strong></td>
                    <td className="table-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => openEditModal(item)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición de Inventario */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Inventario: {selectedItem.product_name}</h2>
            <form onSubmit={handleUpdateInventory}>
              <div className="form-group">
                <label>Cantidad Actual</label>
                <input
                  type="number"
                  required
                  value={inventoryForm.quantity}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Stock Mínimo</label>
                <input
                  type="number"
                  required
                  value={inventoryForm.min_stock}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, min_stock: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Stock Máximo</label>
                <input
                  type="number"
                  required
                  value={inventoryForm.max_stock}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, max_stock: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  value={inventoryForm.location}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, location: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  Actualizar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Movimiento */}
      {showMovementModal && (
        <div className="modal-overlay" onClick={() => setShowMovementModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Registrar Movimiento de Inventario</h2>
            <form onSubmit={handleAddMovement}>
              <div className="form-group">
                <label>Producto *</label>
                <select
                  required
                  value={movementForm.product_id}
                  onChange={(e) => setMovementForm({ ...movementForm, product_id: parseInt(e.target.value) })}
                >
                  <option value="">Seleccione un producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.sku} - {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Movimiento *</label>
                <select
                  required
                  value={movementForm.type}
                  onChange={(e) => setMovementForm({ ...movementForm, type: e.target.value as any })}
                >
                  <option value="IN">Entrada (IN)</option>
                  <option value="OUT">Salida (OUT)</option>
                  <option value="ADJUSTMENT">Ajuste (ADJUSTMENT)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cantidad *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm({ ...movementForm, quantity: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Razón</label>
                <textarea
                  rows={3}
                  value={movementForm.reason}
                  onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                  placeholder="Ej: Compra a proveedor, Venta a cliente, Ajuste por inventario físico..."
                />
              </div>

              <div className="alert alert-info">
                <strong>Nota:</strong>
                <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  <li><strong>IN:</strong> Suma la cantidad al stock actual</li>
                  <li><strong>OUT:</strong> Resta la cantidad del stock actual</li>
                  <li><strong>ADJUSTMENT:</strong> Establece la cantidad exacta</li>
                </ul>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  Registrar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMovementModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
