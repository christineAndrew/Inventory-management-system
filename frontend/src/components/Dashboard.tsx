// File: src/components/Dashboard.tsx
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your shop inventory management system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">$0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Add Product
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
            View Reports
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
            Manage Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;