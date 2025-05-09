import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, RefreshCw, FileUp, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8081/api/dpp';

const DashboardApp = () => {
  const [passports, setPassports] = useState([]);
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'detail', 'create', 'addRepair', 'addCsv'
  const [searchTerm, setSearchTerm] = useState('');
  const [newPassport, setNewPassport] = useState({
    productName: '',
    manufacturer: '',
    serialNumber: '',
    manufacturingDate: '',
    productType: '',
    modelNumber: ''
  });
  const [newRepair, setNewRepair] = useState({
    repairDate: '',
    description: '',
    repairType: '',
    technician: ''
  });
  const [csvFileName, setCsvFileName] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [encryptFile, setEncryptFile] = useState(true); // New state for encryption toggle

  // Fetch all passports
  const fetchPassports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch passports');
      const data = await response.json();
      setPassports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch passport detail
  const fetchPassportDetails = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/detail?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch passport details');
      const data = await response.json();
      setSelectedPassport(data);
      setView('detail');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new passport
  const createPassport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dateTimeString = newPassport.manufacturingDate 
        ? new Date(newPassport.manufacturingDate).toISOString() 
        : new Date().toISOString();
        
      const passportData = {
        ...newPassport,
        manufacturingDate: dateTimeString
      };
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passportData)
      });
      
      if (!response.ok) throw new Error('Failed to create passport');
      
      const createdPassport = await response.json();
      setPassports([...passports, createdPassport]);
      setSelectedPassport(createdPassport);
      setView('detail');
      setNewPassport({
        productName: '',
        manufacturer: '',
        serialNumber: '',
        manufacturingDate: '',
        productType: '',
        modelNumber: ''
      });
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
        // Don't include passport here to avoid circular references
      };
      
      console.log('Sending repair data:', repairData);
      
      const response = await fetch(`${API_BASE_URL}/repairs?passportId=${selectedPassport.id}`, {
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
        fetchPassportDetails(selectedPassport.id);
        
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

  // Update CSV file name and upload actual file
  const updateCsvFileName = async () => {
    if (!csvFile) {
      setError("Please select a CSV file to upload");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', csvFile);
      formData.append('encrypt', encryptFile.toString()); // Send encryption preference
      
      // Use XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      // Set up progress event
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      // Create a promise to handle the XHR request
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.open('POST', `${API_BASE_URL}/upload-csv?id=${selectedPassport.id}`, true);
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error('Network error occurred during upload'));
        };
        
        xhr.send(formData);
      });
      
      // Wait for the upload to complete
      const response = await uploadPromise;
      const responseData = JSON.parse(response);
      
      // Extract the passport from the response
      const updatedPassport = responseData.passport;
      
      // Show encryption status if available
      if (responseData.encryptionEnabled) {
        console.log("File was encrypted during upload");
      }
      
      setSelectedPassport(updatedPassport);
      
      // Update passport in the list
      setPassports(passports.map(p => 
        p.id === updatedPassport.id ? updatedPassport : p
      ));
      
      setView('detail');
      setCsvFileName('');
      setCsvFile(null);
      setUploadProgress(0);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Download CSV file
  const downloadCsvFile = async (passportId, fileName) => {
    if (!fileName) {
      setError("No CSV file attached to download");
      return;
    }
    
    setIsDownloading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/download-csv?passportId=${passportId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      
      // Add to document, trigger click and remove
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err) {
      console.error("Error downloading file:", err);
      setError(err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle input change for new passport form
  const handlePassportInputChange = (e) => {
    const { name, value } = e.target;
    setNewPassport({
      ...newPassport,
      [name]: value
    });
  };

  // Handle input change for new repair form
  const handleRepairInputChange = (e) => {
    const { name, value } = e.target;
    setNewRepair({
      ...newRepair,
      [name]: value
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      setCsvFileName(file.name);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchPassports();
  }, []);

  // Filter passports based on search term
  const filteredPassports = passports.filter(passport => 
    passport.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passport.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passport.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold">Economic Operator Dashboard</h1>
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

        {/* List View */}
        {view === 'list' && (
          <div>
            <div className="mb-4 flex justify-between">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-2 pl-8 border rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button
                onClick={() => setView('create')}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manufacturer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manufacturing Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPassports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredPassports.map((passport) => (
                      <tr key={passport.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{passport.productName}</div>
                          <div className="text-sm text-gray-500">Model: {passport.modelNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passport.manufacturer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passport.serialNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passport.productType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(passport.manufacturingDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => fetchPassportDetails(passport.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FileText className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail View */}
        {view === 'detail' && selectedPassport && (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setView('list')}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Back to List
              </button>
              <h2 className="text-xl font-semibold flex-1">
                {selectedPassport.productName} - Details
              </h2>
              <button
                onClick={() => setView('addCsv')}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center mr-2"
              >
                <FileUp className="h-4 w-4 mr-2" />
                Add Materials CSV File
              </button>
              <button
                onClick={() => setView('addRepair')}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              >
                <span className="mr-2">🔧</span>
                Add Repair Entry
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Product Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Product Name</p>
                    <p className="font-medium">{selectedPassport.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Manufacturer</p>
                    <p className="font-medium">{selectedPassport.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Serial Number</p>
                    <p className="font-medium">{selectedPassport.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model Number</p>
                    <p className="font-medium">{selectedPassport.modelNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Product Type</p>
                    <p className="font-medium">{selectedPassport.productType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Manufacturing Date</p>
                    <p className="font-medium">{formatDate(selectedPassport.manufacturingDate)}</p>
                  </div>
                  {selectedPassport.csvFileName && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Attached CSV</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          {selectedPassport.csvFileName}
                          {selectedPassport.encrypted && 
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Encrypted
                            </span>
                          }
                        </p>
                        <button
                          onClick={() => downloadCsvFile(selectedPassport.id, selectedPassport.csvFileName)}
                          className="text-blue-600 hover:text-blue-900 flex items-center text-sm"
                          disabled={isDownloading}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {isDownloading ? 'Downloading...' : 'Download'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Repair History</h3>
                {selectedPassport.repairHistory && selectedPassport.repairHistory.length > 0 ? (
                  <div className="space-y-4">
                    {selectedPassport.repairHistory.map((repair) => (
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

        {/* Create New Passport Form */}
        {view === 'create' && (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setView('list')}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <h2 className="text-xl font-semibold">Add New Product</h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      name="productName"
                      value={newPassport.productName}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={newPassport.manufacturer}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={newPassport.serialNumber}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturing Date</label>
                    <input
                      type="datetime-local"
                      name="manufacturingDate"
                      value={newPassport.manufacturingDate}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Type</label>
                    <input
                      type="text"
                      name="productType"
                      value={newPassport.productType}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model Number</label>
                    <input
                      type="text"
                      name="modelNumber"
                      value={newPassport.modelNumber}
                      onChange={handlePassportInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={createPassport}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Product Passport'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Repair Entry Form */}
        {view === 'addRepair' && selectedPassport && (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setView('detail')}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <h2 className="text-xl font-semibold">
                Add Repair Entry for {selectedPassport.productName}
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
                  {isLoading ? 'Adding...' : 'Add Repair Entry'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add CSV File Form */}
        {view === 'addCsv' && selectedPassport && (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setView('detail')}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <h2 className="text-xl font-semibold">
                Upload Material CSV File for: {selectedPassport.productName}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload CSV File</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                  {csvFileName && (
                    <p className="mt-2 text-sm text-blue-500">Selected file: {csvFileName}</p>
                  )}
                  
                  {/* Warning message about file overwrite */}
                  <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <strong>Warning:</strong> Uploading a new file will overwrite any existing CSV file attached to this product passport.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* New encryption toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="encrypt-csv"
                    checked={encryptFile}
                    onChange={(e) => setEncryptFile(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="encrypt-csv" className="ml-2 block text-sm text-gray-900">
                    Encrypt file on server
                  </label>
                  <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Upload progress: {uploadProgress}%</p>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <button
                  onClick={updateCsvFileName}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={isLoading || !csvFile}
                >
                  {isLoading ? 'Uploading...' : 'Upload CSV File'}
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

export default DashboardApp;