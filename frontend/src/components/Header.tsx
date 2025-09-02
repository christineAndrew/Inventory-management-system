// File: src/components/Header.tsx


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Shop Inventory Dashboard</h1>
          <p className="text-gray-600">Welcome to your inventory management system</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">Tuesday, March 12, 2023</p>
          <p className="font-medium text-gray-800">Store: Downtown Location</p>
        </div>
      </div>
    </header>
  );
};

export default Header;