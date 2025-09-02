// File: src/components/LowStockAlert.tsx


const LowStockAlert: React.FC = () => {
  // Mock data for low stock items
  const lowStockItems = [
    { id: 1, product: 'Wireless Earbuds', currentStock: 4, minStock: 10 },
    { id: 2, product: 'Phone Screen Protectors', currentStock: 7, minStock: 15 },
    { id: 3, product: 'USB-C to HDMI Adapters', currentStock: 3, minStock: 8 },
    { id: 4, product: 'Laptop Sleeves', currentStock: 5, minStock: 12 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h2>
      <div className="space-y-4">
        {lowStockItems.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
            <div>
              <h3 className="font-medium text-gray-900">{item.product}</h3>
              <p className="text-sm text-gray-500">Current: {item.currentStock} · Minimum: {item.minStock}</p>
            </div>
            <div>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Reorder</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;