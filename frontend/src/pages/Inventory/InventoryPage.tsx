// File: src/pages/InventoryPage.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_STOCKS, GET_STORES, UPDATE_STOCK, CREATE_STOCK_MOVEMENT } from '../../api/queries';
import type { Stock, Store, StockInput, StockMovementInput } from '../../types/inventory';
import type { GetStoresResponse, GetStocksResponse } from '../../types/graphql';
import StockTable from './StockTable';
import StockMovementForm from './StockMovementForm';
import StockAdjustmentForm from './StockAdjustmentForm';

const InventoryPage: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const { data: storesData, loading: storesLoading } = useQuery<GetStoresResponse>(GET_STORES);
  const { data: stocksData, loading: stocksLoading, refetch } = useQuery<GetStocksResponse>(GET_STOCKS, {
    variables: { storeId: selectedStore || null }
  });

  const [updateStock] = useMutation(UPDATE_STOCK);
  const [createStockMovement] = useMutation(CREATE_STOCK_MOVEMENT);

  const handleStoreChange = (storeId: number) => {
    setSelectedStore(storeId);
  };

  const handleAddMovement = (stock: Stock) => {
    setSelectedStock(stock);
    setShowMovementForm(true);
  };

  const handleAdjustStock = (stock: Stock) => {
    setSelectedStock(stock);
    setShowAdjustmentForm(true);
  };

  const handleUpdateStock = async (input: StockInput) => {
    try {
      await updateStock({ variables: { input } });
      refetch();
      setShowAdjustmentForm(false);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleCreateMovement = async (input: StockMovementInput) => {
    try {
      await createStockMovement({ variables: { input } });
      refetch();
      setShowMovementForm(false);
    } catch (error) {
      console.error('Error creating movement:', error);
    }
  };

  const handleFormClose = () => {
    setShowMovementForm(false);
    setShowAdjustmentForm(false);
    setSelectedStock(null);
  };

  if (storesLoading) return <div className="text-center py-8">Loading stores...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowMovementForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Add Movement
          </button>
          <button
            onClick={() => setShowAdjustmentForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Adjust Stock
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Store
        </label>
        <select
          value={selectedStore || ''}
          onChange={(e) => handleStoreChange(Number(e.target.value))}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Stores</option>
          {storesData?.stores.map((store) => {
            // Convert backend snake_case to frontend interface
            const storeObj: Store = {
              id: parseInt(store.id),
              name: store.name,
              location: store.location,
              address: store.address,
              is_active: store.is_active
            };
            return (
              <option key={storeObj.id} value={storeObj.id}>
                {storeObj.name} - {storeObj.location}
              </option>
            );
          })}
        </select>
      </div>

      <StockTable
        stocks={stocksData?.stocks.map(stock => ({
          ...stock,
          id: parseInt(stock.id),
          // Map backend snake_case to frontend camelCase for compatibility
          lowStockThreshold: stock.low_stock_threshold,
          lastUpdated: stock.last_updated,
          productName: stock.product_name,
          storeName: stock.store_name,
          product: {
            ...stock.product,
            id: parseInt(stock.product.id)
          },
          store: {
            ...stock.store,
            id: parseInt(stock.store.id)
          }
        })) || []}
        loading={stocksLoading}
        onAddMovement={handleAddMovement}
        onAdjustStock={handleAdjustStock}
      />

      {showMovementForm && (
        <StockMovementForm
          stock={selectedStock}
          onClose={handleFormClose}
          onSubmit={handleCreateMovement}
        />
      )}

      {showAdjustmentForm && (
        <StockAdjustmentForm
          stock={selectedStock}
          onClose={handleFormClose}
          onSubmit={handleUpdateStock}
        />
      )}
    </div>
  );
};

export default InventoryPage;