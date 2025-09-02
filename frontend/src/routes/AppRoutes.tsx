// File: src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
// import ProductsPage from '../pages/Products/ProductsPage';
// import ProductForm from '../pages/Products/ProductForm';
import ProductList from '../pages/Products/ProductList';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<ProductList />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default AppRoutes;