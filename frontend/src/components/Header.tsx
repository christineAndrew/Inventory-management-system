// File: src/components/Header.tsx


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">SAROMO SHOP</h1>
          <p className="text-gray-600">Welcome to Saromo inventory management system</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-gray-800">Store: SUA ROUNDABOUT</p>
        </div>
      </div>
    </header>
  );
};

export default Header;