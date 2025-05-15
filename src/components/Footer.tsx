
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">PrintLite</h3>
            <p className="text-gray-600 mb-4">
              Quick and affordable document printing service with fast delivery options.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Print Services</h3>
            <ul className="space-y-2">
              <li><Link to="/documents" className="text-gray-600 hover:text-gray-900">Document Printing</Link></li>
              <li><Link to="/photos" className="text-gray-600 hover:text-gray-900">Photo Printing</Link></li>
              <li><Link to="/bulk-orders" className="text-gray-600 hover:text-gray-900">Bulk Orders</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-600 hover:text-gray-900">FAQs</Link></li>
              <li><Link to="/track-order" className="text-gray-600 hover:text-gray-900">Track Order</Link></li>
              <li><Link to="/contact-us" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
              <li><Link to="/refund-policy" className="text-gray-600 hover:text-gray-900">Refund Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">Our Story</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} PrintLite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
