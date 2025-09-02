// File: src/components/RecentSales.tsx


const RecentSales: React.FC = () => {
  // Mock data for recent sales
  const sales = [
    { id: 1, product: 'Wireless Headphones', quantity: 2, amount: 159.98, time: '10:24 AM' },
    { id: 2, product: 'Smartphone Case', quantity: 1, amount: 29.99, time: '09:45 AM' },
    { id: 3, product: 'Bluetooth Speaker', quantity: 1, amount: 89.99, time: '09:12 AM' },
    { id: 4, product: 'USB-C Cable', quantity: 3, amount: 35.97, time: '08:56 AM' },
    { id: 5, product: 'Wireless Charger', quantity: 1, amount: 45.00, time: '08:30 AM' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Sales</h2>
      <div className="space-y-4">
        {sales.map(sale => (
          <div key={sale.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
            <div>
              <h3 className="font-medium text-gray-900">{sale.product}</h3>
              <p className="text-sm text-gray-500">{sale.quantity} item{sale.quantity > 1 ? 's' : ''} · {sale.time}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${sale.amount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSales;