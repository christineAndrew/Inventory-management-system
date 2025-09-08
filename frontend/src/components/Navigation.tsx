// File: src/components/Navigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Shop Inventory
          </Link>
          
          <div className="flex space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            
            <Link
              to="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/products')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Products
            </Link>
            
            <Link
              to="/sales"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/sales')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Sales
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;