
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const handleSubmit = () => {
    if (!name || !mobile) {
      alert("Please fill in name and mobile number");
      return;
    }
    setPaymentStep(true);
  };

  const handlePayment = async () => {
    try {
      // Import Amplify API client
      const { generateClient } = await import('aws-amplify/api');
      const { createGuestOrder } = await import('@/lib/graphql-queries');
      
      const client = generateClient();
      
      // Get cart details and other data from localStorage
      const printSettings = JSON.parse(localStorage.getItem('printSettings') || '{}');
      
      // Get amplify files if they exist
      const amplifyFilesData = JSON.parse(localStorage.getItem('amplifyFiles') || '[]');
      
      const orderInput = {
        customerName: name,
        email: name.toLowerCase().replace(/\s+/g, '') + '@gmail.com', // Generate email from name
        phone: mobile,
        totalAmount: totalPrice + deliveryFee,
        totalPages: printSettings.totalPages || 1,
        printType: printSettings.printType === 'color' ? 'COLOR' : 'BLACK_WHITE',
        paperSize: 'A4',
        paperType: printSettings.paperType === '90gsm' ? 'PREMIUM_90GSM' : 
                   printSettings.paperType === '120gsm' ? 'GLOSSY_120GSM' : 'STANDARD_70GSM',
        sides: printSettings.sides === 'double' ? 'DOUBLE' : 'SINGLE',
        binding: 'NONE',
        copies: printSettings.copies || 1,
        deliveryAddress: location === "cutm-bbsr" ? "CUTM Bhubaneswar" : "Other Location",
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: 'COMPLETED',
        fileNames: cartItems.map(item => item.id || 'uploaded_file'),
        fileKeys: amplifyFilesData.map((file: any) => file.key || ''),
        specialInstructions: null
      };

      const result = await client.graphql({
        query: createGuestOrder,
        variables: { input: orderInput }
      });

      const order = result.data.createGuestOrder;
      
      if (order) {
        // Save order locally for tracking purposes
        const localOrderData = {
          orderId: order.id,
          customerName: name,
          files: cartItems.map(item => item.id || ''),
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
        navigate("/order-confirmation", { state: localOrderData });
        localStorage.setItem('printCart', JSON.stringify([]));
        localStorage.removeItem('printSettings');
        localStorage.removeItem('amplifyFiles');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
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
                {!paymentStep ? (
                  <Button className="w-full mt-4" size="lg" onClick={handleSubmit}>
                    Continue to Payment
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-medium">Select Payment Method</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="upi"
                          value="upi"
                          checked={paymentMethod === "upi"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <Label htmlFor="upi">UPI Payment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="card"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <Label htmlFor="card">Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="netbanking"
                          value="netbanking"
                          checked={paymentMethod === "netbanking"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <Label htmlFor="netbanking">Net Banking</Label>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="lg" onClick={handlePayment}>
                      Pay ₹{(totalPrice + deliveryFee).toFixed(2)}
                    </Button>
                  </div>
                )}
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
