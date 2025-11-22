import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import MovementsPage from './pages/MovementsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>📦 Sistema de Gestión de Inventario</h1>
          <div>
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/products">Productos</NavLink>
            <NavLink to="/inventory">Inventario</NavLink>
            <NavLink to="/movements">Movimientos</NavLink>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/movements" element={<MovementsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
