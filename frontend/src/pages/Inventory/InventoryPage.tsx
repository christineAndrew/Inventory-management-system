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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleUpdateStock = async (input: StockInput) => {
    setIsSubmitting(true);
    clearMessages();
    try {
      await updateStock({ variables: { input } });
      await refetch();
      setSuccessMessage('Stock updated successfully!');
      setShowAdjustmentForm(false);
      setSelectedStock(null);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Error updating stock:', error);
      setError(error.message || 'Failed to update stock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMovement = async (input: StockMovementInput) => {
    setIsSubmitting(true);
    clearMessages();
    try {
      await createStockMovement({ variables: { input } });
      await refetch();
      setSuccessMessage('Stock movement created successfully!');
      setShowMovementForm(false);
      setSelectedStock(null);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Error creating movement:', error);
      setError(error.message || 'Failed to create stock movement. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-red-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-700">{error}</p>
            <button
              onClick={clearMessages}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-green-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-700">{successMessage}</p>
            <button
              onClick={clearMessages}
              className="ml-auto text-green-400 hover:text-green-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

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
            const storeId = parseInt(store.id);
            return (
              <option key={storeId} value={storeId}>
                {store.name} - {store.location}
              </option>
            );
          })}
        </select>
      </div>

      <StockTable
        stocks={stocksData?.stocks.map(stock => ({
          ...stock,
          id: parseInt(stock.id),
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