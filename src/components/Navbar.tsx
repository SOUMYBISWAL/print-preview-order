
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, User, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    // Load cart items from localStorage
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('printCart') || '[]');
      setCartCount(cartItems.length);
    };
    
    // Update cart count on mount
    updateCartCount();
    
    // Listen for storage changes to update cart count
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates without page reload
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-green-600 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
              />
            </svg>
            <span className="text-xl font-bold">PrintLite</span>
          </Link>
          
          <div className="hidden md:flex items-center flex-grow mx-10">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search for documents, templates and more" 
                className="w-full pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/upload">
              <Button variant="outline">Upload</Button>
            </Link>
            <Link to="/track-order">
              <Button variant="ghost">Track Order</Button>
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-600">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
