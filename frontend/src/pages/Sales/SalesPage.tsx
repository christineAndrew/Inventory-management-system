// File: src/pages/SalesPage.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_SALES, CREATE_SALE } from '../../api/queries';
import type { Sale, SaleInput } from '../../types';
import SalesTable from './SalesTable';
import CreateSaleForm from './CreateSaleForm';
import SaleReceipt from './SaleReceipt';

// Define the type for the sales query response
interface SalesQueryResult {
  sales: Sale[];
}

// Main SalesPage Component
const SalesPage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  // Fixed: Properly type the error parameter and use onError in the correct way
  // Helper function to safely convert date string to ISO string
  const toISOString = (dateString: string): string | undefined => {
    if (!dateString) return undefined;
    
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date provided:', dateString);
        return undefined;
      }
      return date.toISOString();
    } catch (error) {
      console.warn('Error parsing date:', dateString, error);
      return undefined;
    }
  };

  const { data, loading, error, refetch } = useQuery<SalesQueryResult>(GET_SALES, {
    variables: {
      startDate: toISOString(filters.startDate),
      endDate: toISOString(filters.endDate)
    },
    errorPolicy: 'all'
  });

  // Log errors separately if they exist
  React.useEffect(() => {
    if (error) {
      console.error('GraphQL Error Details:', error.message);
    }
  }, [error]);

  // Fixed: Properly type the error parameter
  const [createSale] = useMutation(CREATE_SALE, {
    onCompleted: () => {
      refetch();
      setShowCreateForm(false);
    },
    onError: (error: Error) => {
      console.error('Create Sale Error:', error);
      alert(`Error creating sale: ${error.message}`);
    }
  });

  const handleCreateSale = (saleData: SaleInput) => {
    createSale({ variables: { input: saleData } });
  };

  const handleViewReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setShowReceipt(true);
  };

  const handleFilterChange = (newFilters: { startDate: string; endDate: string }) => {
    setFilters(newFilters);
  };

  // Fixed: Handle the case where data might be undefined or sales might be undefined
  const sales = data?.sales || [];

  if (loading) return <div className="text-center py-8">Loading sales...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          New Sale
        </button>
      </div>

      <SalesTable
        sales={sales}
        onViewReceipt={handleViewReceipt}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {showCreateForm && (
        <CreateSaleForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateSale}
        />
      )}

      {showReceipt && selectedSale && (
        <SaleReceipt
          sale={selectedSale}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default SalesPage;