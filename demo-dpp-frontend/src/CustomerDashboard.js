import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Search, RefreshCw, Calendar, Wrench, Cloud } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/dpp';
const EDC_API_URL = 'http://localhost:8081/api/edc-transfer';
const DATA_TRANSFER_API_URL = 'http://localhost:8081/api/data-transfers';

const CustomerDashboard = () => {
  const [productId, setProductId] = useState('');
  const [passport, setPassport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isEdcTransferLoading, setIsEdcTransferLoading] = useState(false);
  const [edcTransferError, setEdcTransferError] = useState(null);
  const [edcTransferStatus, setEdcTransferStatus] = useState('');
  const [edcPollCount, setEdcPollCount] = useState(0);

  // Function to search for a product passport
  const searchPassport = async () => {
    if (!productId.trim()) {
      setError("Please enter a product ID");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/detail?id=${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found. Please check the ID and try again.");
        }
        throw new Error("Failed to fetch product information");
      }
      
      const data = await response.json();
      setPassport(data);
      setSearchPerformed(true);
    } catch (err) {
      setError(err.message);
      setPassport(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to initiate EDC transfer of product passport
  const initiateEdcTransfer = async () => {
    if (!productId.trim()) {
      setEdcTransferError("Please enter a product ID");
      return;
    }
    
    setIsEdcTransferLoading(true);
    setEdcTransferError(null);
    setEdcTransferStatus('initiated');
    setEdcPollCount(0); // Reset count for UI display
    
    try {
      const response = await fetch(`${EDC_API_URL}/initiate-async/${productId}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error("Failed to initiate EDC transfer");
      }
      
      const data = await response.json();
      const referenceId = data.referenceId;
      
      setEdcTransferStatus('checking');
      // Start polling with attempt 1
      pollForTransferResults(referenceId, 1); 
      
    } catch (err) {
      setEdcTransferError(err.message);
      setEdcTransferStatus('failed');
      setIsEdcTransferLoading(false);
    }
  };

  // Function to poll for transfer results, now takes attempt count
  const pollForTransferResults = async (referenceId, attempt) => {
    // Update UI state for the current attempt number
    setEdcPollCount(attempt); 

    // Check if we've exceeded the maximum attempts
    if (attempt > 10) {
      setEdcTransferError("Data transfer timed out. Please try again.");
      setEdcTransferStatus('failed');
      setIsEdcTransferLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${DATA_TRANSFER_API_URL}/by-reference/${referenceId}`);
      
      if (!response.ok) {
        // Consider specific error handling, maybe retry on certain statuses?
        // For now, treat any non-ok response as a failure for this attempt.
        throw new Error(`Failed to check transfer status: ${response.status}`);
      }
      
      const transferData = await response.json();
      
      if (transferData && transferData.length > 0) {
        // Data found, process it
        const latestTransfer = transferData[transferData.length - 1];
        const passportData = JSON.parse(latestTransfer.jsonData);
        
        setPassport(passportData);
        setSearchPerformed(true);
        setEdcTransferStatus('complete');
        setIsEdcTransferLoading(false);
      } else {
        // Data not found yet, schedule the next attempt
        setTimeout(() => pollForTransferResults(referenceId, attempt + 1), 2000);
      }
    } catch (err) {
      // Handle errors during fetch/processing
      // Decide if error is fatal or if retry makes sense
      // For now, treat fetch errors as fatal for the polling process
      setEdcTransferError(err.message);
      setEdcTransferStatus('failed');
      setIsEdcTransferLoading(false);
    }
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
            <h1 className="text-2xl font-bold">Product Passport Lookup</h1>
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Search for Product Passport</h2>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text"
                  placeholder="Enter Product ID"
                  className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPassport()}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                  onClick={searchPassport}
                  disabled={isLoading || isEdcTransferLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </button>
                
                {/* New EDC Transfer Button */}
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                  onClick={initiateEdcTransfer}
                  disabled={isLoading || isEdcTransferLoading}
                  title="Retrieve via EDC Transfer"
                >
                  {isEdcTransferLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {edcTransferStatus === 'initiated' ? 'Initiating...' : 'Transferring...'}
                    </>
                  ) : (
                    <>
                      <Cloud className="h-4 w-4 mr-2" />
                      EDC Transfer
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p>{error}</p>
              </div>
            )}

            {/* EDC Transfer Error message */}
            {edcTransferError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p className="font-bold">EDC Transfer Error:</p>
                <p>{edcTransferError}</p>
              </div>
            )}
            
            {/* EDC Transfer Status */}
            {isEdcTransferLoading && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
                <div className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  <p className="font-semibold">
                    {edcTransferStatus === 'initiated' ? 'Initiating EDC Transfer...' : 'Retrieving data from EDC system...'}
                  </p>
                </div>
                {edcTransferStatus === 'checking' && (
                  // Use edcPollCount directly from state for display
                  <p className="mt-2 text-sm">This may take a few seconds. Attempt {edcPollCount}/10</p> 
                )}
              </div>
            )}
            
            {/* Info message when no search performed */}
            {!searchPerformed && !error && !edcTransferError && !isEdcTransferLoading && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4">
                <p className="font-semibold">How to use this tool:</p>
                <p className="mt-2">Enter a product ID to view its digital product passport. Product IDs are usually found on product packaging, labels, or documentation.</p>
                <p className="mt-2">The digital passport contains information about the product's manufacturing details, materials, and repair history.</p>
                <p className="mt-2 font-medium">Data retrieval options:</p>
                <ul className="list-disc ml-5 mt-1">
                  <li><strong>Search</strong>: Direct database lookup (faster)</li>
                  <li><strong>EDC Transfer</strong>: Retrieve via EDC system (may take a few seconds)</li>
                </ul>
              </div>
            )}
            
            {/* No results message */}
            {searchPerformed && !passport && !error && !edcTransferError && !isLoading && !isEdcTransferLoading && (
              <div className="text-center p-8">
                <div className="inline-block p-4 rounded-full bg-gray-100">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <p className="mt-4 text-gray-600">No product found with that ID.</p>
              </div>
            )}
          </div>
          
          {/* Product Information */}
          {passport && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Product header */}
              <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-6">
                <h2 className="text-2xl font-bold">{passport.productName}</h2>
                <div className="flex flex-wrap gap-y-2 mt-2">
                  <div className="mr-6">
                    <span className="text-green-200">Manufacturer:</span>
                    <span className="ml-1 font-medium">{passport.manufacturer}</span>
                  </div>
                  <div className="mr-6">
                    <span className="text-green-200">Serial Number:</span>
                    <span className="ml-1 font-medium">{passport.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-green-200">Model:</span>
                    <span className="ml-1 font-medium">{passport.modelNumber}</span>
                  </div>
                </div>
              </div>
              
              {/* Product details */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Manufacturing Date</span>
                    </div>
                    <p>{formatDate(passport.manufacturingDate)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center mb-1">
                      <FileText className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Product Type</span>
                    </div>
                    <p>{passport.productType}</p>
                  </div>
                </div>
                
                {/* Material information notice */}
                {passport.csvFileName && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Material Information
                    </h4>
                    <p className="text-sm text-blue-600">
                      This product has detailed material information available. 
                      {passport.encrypted && (
                        <span className="text-blue-800"> The data is stored securely using encryption.</span>
                      )}
                    </p>
                  </div>
                )}
                
                {/* Repair history */}
                <h3 className="text-lg font-semibold mb-4">Repair History</h3>
                {passport.repairHistory && passport.repairHistory.length > 0 ? (
                  <div className="space-y-4">
                    {passport.repairHistory.map((repair) => (
                      <div key={repair.id} className="border rounded-md overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Wrench className="h-4 w-4 text-gray-600 mr-2" />
                              <span className="font-medium">{repair.repairType}</span>
                            </div>
                            <span className="text-sm text-gray-500">{formatDate(repair.repairDate)}</span>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-gray-700 mb-2">{repair.description}</p>
                          <p className="text-sm text-gray-500">Technician: {repair.technician}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No repair history available for this product.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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

export default CustomerDashboard;
