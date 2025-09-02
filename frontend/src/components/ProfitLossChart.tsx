// File: src/components/ProfitLossChart.tsx


const ProfitLossChart: React.FC = () => {
  // Mock data for the chart
  const data = [
    { day: 'Mon', profit: 1200, loss: 300 },
    { day: 'Tue', profit: 1950, loss: 250 },
    { day: 'Wed', profit: 1800, loss: 400 },
    { day: 'Thu', profit: 2250, loss: 350 },
    { day: 'Fri', profit: 2100, loss: 200 },
    { day: 'Sat', profit: 2800, loss: 450 },
    { day: 'Sun', profit: 2450, loss: 320 },
  ];

  const maxValue = Math.max(...data.map(d => d.profit + d.loss));

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Profit & Loss Overview (Last 7 Days)</h2>
      <div className="flex items-end justify-between h-64">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center w-12">
            <div className="flex flex-col items-center justify-end h-48 w-full mb-2">
              <div 
                className="w-8 bg-green-400 rounded-t"
                style={{ height: `${(item.profit / maxValue) * 100}%` }}
              ></div>
              <div 
                className="w-8 bg-red-400"
                style={{ height: `${(item.loss / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{item.day}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Profit</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Loss</span>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossChart;