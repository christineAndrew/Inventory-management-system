// File: src/components/Products/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../api/mutations';
import { GET_PRODUCTS } from '../../api/queries';
import type { Product, ProductFormData } from '../../types';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    costPrice: '',
    sellingPrice: ''
  });

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }]
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }]
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category,
        costPrice: product.costPrice.toString(),
        sellingPrice: product.sellingPrice.toString()
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const input = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      costPrice: parseFloat(formData.costPrice),
      sellingPrice: parseFloat(formData.sellingPrice)
    };

    try {
      if (product) {
        await updateProduct({ variables: { id: product.id, input } });
      } else {
        await createProduct({ variables: { input } });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost Price *
            </label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price *
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {product ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;