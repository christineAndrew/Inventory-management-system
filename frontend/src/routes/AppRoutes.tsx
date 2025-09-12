// File: src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import ProductList from '../pages/Products/ProductList';
import SalesPage from '../pages/Sales/SalesPage';
import InventoryPage from '../pages/Inventory/InventoryPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/Inventory" element={<InventoryPage />} />
      
      {/* Optional: Redirect unknown routes to dashboard */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;