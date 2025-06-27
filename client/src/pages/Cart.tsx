
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, FileText } from "lucide-react";

interface CartItem {
  id: string;
  paperType: string;
  printType: string;
  printSide: string;
  copies: number;
  pageRange: string;
  price: number;
  fileCount: number;
  totalPages: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = () => {
      const items = JSON.parse(localStorage.getItem('printCart') || '[]');
      setCartItems(items);
      
      // Calculate total price
      const total = items.reduce((sum: number, item: CartItem) => sum + item.price, 0);
      setTotalPrice(total);
    };
    
    loadCartItems();
    
    // Listen for storage changes
    window.addEventListener('storage', loadCartItems);
    return () => {
      window.removeEventListener('storage', loadCartItems);
    };
  }, []);
  
  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('printCart', JSON.stringify(updatedCart));
    
    // Calculate new total price
    const total = updatedCart.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(total);
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success("Item removed from cart");
  };
  
  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('printCart', JSON.stringify([]));
    setTotalPrice(0);
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success("Cart cleared");
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    // For now, just checkout with the first item
    // In a real app, you would handle multiple items
    navigate("/checkout", { state: cartItems[0] });
  };
  
  const getPaperTypeName = (type: string) => {
    switch (type) {
      case "standard": return "Standard (70 GSM)";
      case "premium": return "Premium (90 GSM)";
      case "glossy": return "Glossy (120 GSM)";
      default: return type;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Your Cart</h1>
            {cartItems.length > 0 && (
              <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
            )}
          </div>
          
          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added any print job to your cart yet.
                </p>
                <Button onClick={() => navigate("/upload")}>
                  Upload Files to Print
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cartItems.map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium mb-2">
                            Print Job ({item.fileCount} file{item.fileCount !== 1 ? 's' : ''})
                          </h3>
                          <div className="text-sm space-y-1 text-gray-500">
                            <p>Paper: {getPaperTypeName(item.paperType)}</p>
                            <p>Print: {item.printType === 'bw' ? 'Black & White' : 'Color'}</p>
                            <p>Side: {item.printSide === 'single' ? 'Single Sided' : 'Double Sided'}</p>
                            <p>Copies: {item.copies}</p>
                            <p>Pages: {item.pageRange}</p>
                            <p>Total Pages: {item.totalPages}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <p className="text-lg font-bold">₹{item.price.toFixed(2)}</p>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>₹{totalPrice.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p>Delivery Fee</p>
                      <p>{totalPrice >= 99 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <span>₹20.00</span>
                      )}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold">
                      <p>Total</p>
                      <p>₹{(totalPrice + (totalPrice >= 99 ? 0 : 20)).toFixed(2)}</p>
                    </div>
                    
                    {totalPrice >= 99 && (
                      <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Free delivery applied!
                      </div>
                    )}
                    
                    <Button className="w-full mt-4" size="lg" onClick={handleCheckout}>
                      Proceed to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
