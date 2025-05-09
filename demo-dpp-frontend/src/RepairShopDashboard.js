import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, RefreshCw, ArrowLeft, Wrench } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/dpp';

const RepairShopDashboard = () => {
  const [searchId, setSearchId] = useState('');
  const [passport, setPassport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newRepair, setNewRepair] = useState({
    repairDate: '',
    description: '',
    repairType: '',
    technician: ''
  });
  const [view, setView] = useState('search'); // 'search', 'detail', 'add-repair'

  const searchPassport = async () => {
    if (!searchId.trim()) {
      setError('Please enter a product ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/detail?id=${searchId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found. Please check the ID and try again.');
        }
        throw new Error('Failed to fetch product details');
      }
      
      const data = await response.json();
      setPassport(data);
      setView('detail');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add repair entry
  const addRepairEntry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dateTimeString = newRepair.repairDate 
        ? new Date(newRepair.repairDate).toISOString() 
        : new Date().toISOString();
        
      // Create repair data without passport reference to avoid circular JSON
      const repairData = {
        description: newRepair.description,
        repairType: newRepair.repairType,
        repairDate: dateTimeString,
        technician: newRepair.technician
      };
      
      const response = await fetch(`${API_BASE_URL}/repairs?passportId=${passport.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repairData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Failed to add repair entry: ${response.status} ${response.statusText}`);
      }
      
      // Wait a moment before refreshing (to ensure the backend has processed the change)
      setTimeout(() => {
        // Refresh passport details to include the new repair entry
        searchPassport();
        
        setNewRepair({
          repairDate: '',
          description: '',
          repairType: '',
          technician: ''
        });
        
        setView('detail');
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error adding repair:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Handle input change for new repair form
  const handleRepairInputChange = (e) => {
    const { name, value } = e.target;
    setNewRepair({
      ...newRepair,
      [name]: value
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#005b96] text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/aut_logo_small_new.png" 
              alt="NTT Logo" 
              className="h-10 mr-4" 
            />
            <h1 className="text-2xl font-bold">Repair Shop Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/"
              className="text-white hover:text-gray-200 no-underline"
            >
              Economic Operator
            </Link>
            <Link 
              to="/repair"
              className="text-white hover:text-gray-200 no-underline"
            >
              Repair Shop
            </Link>
            <Link 
              to="/customer"
              className="text-white hover:text-gray-200 no-underline"
            >
              Customer
            </Link>
            <Link 
              to="/about"
              className="text-white hover:text-gray-200 no-underline"
            >
              About
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto p-4 overflow-auto">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Search View */}
        {view === 'search' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Repair Shop Product Search</h2>
              
              <div className="mb-6">
                <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Product ID
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="productId"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 py-3 sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Enter product ID number"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchPassport()}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <button
                onClick={searchPassport}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search Product
              </button>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  As a repair professional, you can access product details and add repair records to Digital Product Passports.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Detail View */}
        {view === 'detail' && passport && (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setView('search')}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded flex items-center mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </button>
              <h2 className="text-xl font-semibold flex-1">
                {passport.productName} - Product Details
              </h2>
              <button
                onClick={() => setView('add-repair')}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Add Repair Record
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Product Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Product Name</p>
                    <p className="font-medium">{passport.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Manufacturer</p>
                    <p className="font-medium">{passport.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Serial Number</p>
                    <p className="font-medium">{passport.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model Number</p>
                    <p className="font-medium">{passport.modelNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Product Type</p>
                    <p className="font-medium">{passport.productType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Manufacturing Date</p>
                    <p className="font-medium">{formatDate(passport.manufacturingDate)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Repair History</h3>
                {passport.repairHistory && passport.repairHistory.length > 0 ? (
                  <div className="space-y-4">
                    {passport.repairHistory.map((repair) => (
                      <div key={repair.id} className="border-l-4 border-blue-400 pl-4 py-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{repair.repairType}</span>
                          <span className="text-sm text-gray-500">{formatDate(repair.repairDate)}</span>
                        </div>
                        <p className="text-gray-700 mt-1">{repair.description}</p>
                        <p className="text-sm text-gray-500 mt-2">Technician: {repair.technician}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No repair history available.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Repair Entry Form */}
        {view === 'add-repair' && passport && (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setView('detail')}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <h2 className="text-xl font-semibold">
                Add Repair Record for {passport.productName}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Repair Type</label>
                    <input
                      type="text"
                      name="repairType"
                      value={newRepair.repairType}
                      onChange={handleRepairInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Repair Date</label>
                    <input
                      type="datetime-local"
                      name="repairDate"
                      value={newRepair.repairDate}
                      onChange={handleRepairInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Technician</label>
                    <input
                      type="text"
                      name="technician"
                      value={newRepair.technician}
                      onChange={handleRepairInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={newRepair.description}
                      onChange={handleRepairInputChange}
                      rows="5"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={addRepairEntry}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Repair Record'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#005b96] text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 UTCN</p>
        </div>
      </footer>
    </div>
  );
};

export default RepairShopDashboard;
