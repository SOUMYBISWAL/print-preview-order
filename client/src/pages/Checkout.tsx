
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PrintSummary {
  id?: string;
  price: number;
}

const Checkout = () => {
  const [, navigate] = useLocation();
  const [cartItems, setCartItems] = useState<PrintSummary[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("cutm-bbsr");

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('printCart') || '[]');
    setCartItems(items);
    const subtotal = items.reduce((sum: number, item: PrintSummary) => sum + item.price, 0);
    setTotalPrice(subtotal);
    setDeliveryFee(subtotal >= 99 ? 0 : 20);
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);
  const paymentMethod = "cash_on_delivery"; // Fixed to cash on delivery only

  const handleSubmit = () => {
    if (!name || !mobile) {
      alert("Please fill in name and mobile number");
      return;
    }
    // Directly proceed to place order with cash on delivery
    handlePayment();
  };

  const handlePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Get cart details and other data from localStorage
      const printSettings = JSON.parse(localStorage.getItem('printSettings') || '{}');
      
      // Get amplify files if they exist
      const amplifyFilesData = JSON.parse(localStorage.getItem('amplifyFiles') || '[]');
      
      const orderData = {
        customerName: name,
        email: name.toLowerCase().replace(/\s+/g, '') + '@gmail.com', // Generate email from name
        phone: mobile,
        totalAmount: (totalPrice + deliveryFee).toString(),
        totalPages: printSettings.totalPages || 1,
        printType: printSettings.printType === 'color' ? 'color' : 'black_white',
        paperSize: 'A4',
        paperType: printSettings.paperType || '70gsm',
        sides: printSettings.sides || 'single',
        binding: printSettings.binding || 'none',
        copies: printSettings.copies || 1,
        deliveryAddress: location === "cutm-bbsr" ? "CUTM Bhubaneswar" : "Other Location",
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed',
        fileNames: amplifyFilesData.length > 0 ? 
          amplifyFilesData.map((file: any) => file.name || 'uploaded_file') :
          cartItems.map(item => item.id || 'uploaded_file'),
        specialInstructions: null
      };

      console.log('Sending order data:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Order response:', result);
      
      if (result.success && result.order) {
        // Save order locally for tracking purposes
        const localOrderData = {
          orderId: result.order.id,
          customerName: name,
          files: orderData.fileNames,
          status: "Processing",
          totalAmount: totalPrice + deliveryFee,
          dateCreated: new Date().toISOString(),
          mobile,
          location: location === "cutm-bbsr" ? "CUTM Bhubaneswar" : "Other",
          paymentMethod,
          deliveryFee,
          subtotal: totalPrice
        };

        // Clear cart and navigate to confirmation
        localStorage.setItem('orderData', JSON.stringify(localOrderData));
        localStorage.setItem('printCart', JSON.stringify([]));
        localStorage.removeItem('printSettings');
        localStorage.removeItem('amplifyFiles');
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Navigate to confirmation page
        navigate("/order-confirmation");
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(`Failed to place order: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Delivery Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cutm-bbsr">CUTM Bhubaneswar</SelectItem>
                      <SelectItem value="other">Other Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
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
                  <p>{deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  )}</p>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>₹{(totalPrice + deliveryFee).toFixed(2)}</p>
                </div>
                {deliveryFee === 0 && (
                  <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free delivery applied!
                  </div>
                )}
                
                {/* Cash on Delivery Information */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Payment Method</h3>
                  <div className="flex items-center space-x-2 text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">Pay ₹{(totalPrice + deliveryFee).toFixed(2)} when your order is delivered</p>
                </div>

                <Button className="w-full mt-4" size="lg" onClick={handleSubmit} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Place Order - ₹${(totalPrice + deliveryFee).toFixed(2)}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
