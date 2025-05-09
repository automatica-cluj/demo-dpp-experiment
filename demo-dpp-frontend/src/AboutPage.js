import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AboutPage = () => {
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
            <h1 className="text-2xl font-bold">About DPP Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/"
              className="text-white hover:text-gray-200 no-underline"
            >
              Operator View
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
              Customer View
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
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 no-underline">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-[#2b463c] mb-4">About This Application</h2>
          
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Purpose</h3>
            <p className="mb-4">
              This is a concept application that demonstrates the process of managing simplified Digital Product Passport (DPP) records. 
              It serves as a proof of concept for Digital Product Passport, showing how digital product passport data can be managed by economic operators.
            </p>
          </section>
          
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Application Overview</h3>
            <p className="mb-4">
              This application demonstrates the management of Digital Product Passport (DPP) data in two views:
            </p>
            <div className="ml-4 mb-4">
              <h4 className="text-lg font-medium mb-1">1. Economic Operator View</h4>
              <p>
                The main dashboard where manufacturers, retailers, and repair professionals can manage product passports, 
                add repair records, and attach material information files.
              </p>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium mb-1">2. Customer View</h4>
              <p>
                A simplified interface where end customers can look up product information by entering a product ID.
                This view displays key product details and repair history to enhance transparency and support circular economy principles.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Key Features</h3>
            
            <div className="mb-4">
              <h4 className="text-lg font-medium mb-1">1. Repair Record Management</h4>
              <p className="ml-4">
                The application allows users to add repair records to a product's digital passport. Each repair entry includes:
              </p>
              <ul className="list-disc ml-8 mt-2">
                <li>Repair type</li>
                <li>Detailed description</li>
                <li>Date of repair</li>
                <li>Technician information</li>
              </ul>
              <p className="ml-4 mt-2">
                This feature demonstrates how a DPP can track the repair history of a product, supporting circular economy principles by facilitating repair and maintenance documentation.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-1">2. CSV Material Data Management</h4>
              <p className="ml-4">
                Users can upload CSV files containing detailed information about the product, such as:
              </p>
              <ul className="list-disc ml-8 mt-2">
                <li>Material composition</li>
                <li>Parts inventory</li>
                <li>Sourcing information</li>
                <li>Environmental impact data</li>
              </ul>
              <p className="ml-4 mt-2">
                The application provides an optional encryption feature for sensitive data:
              </p>
              <ul className="list-disc ml-8 mt-2">
                <li>Users can choose to encrypt CSV files during upload (encryption will be performed on server side)</li>
                <li>Encrypted files are stored securely on the server</li>
                <li>Downloaded files remain in their encrypted state</li>
                <li>Decryption must be performed by the user or user application</li>
              </ul>
              <p className="ml-4 mt-2">
                This demonstrates how sensitive material data can be protected while still being attached to a product's digital passport.
              </p>
            </div>
          </section>
          
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Limitations</h3>
            <p>
              As a concept demonstration, this application has several limitations:
            </p>
            <ul className="list-disc ml-4 mt-2">
              <li>Simplified DPP structure compared to full industry implementations</li>
              <li>Basic encryption implementation for demonstration purposes</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-2">Future Development</h3>
            <p>
              In a production environment, this concept could be expanded to include:
            </p>
            <ul className="list-disc ml-4 mt-2">
              <li>Advanced access control for different stakeholders</li>
              <li>More sophisticated encryption and data security measures</li>
            </ul>
          </section>
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

export default AboutPage;
