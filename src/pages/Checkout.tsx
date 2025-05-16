
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PrintSummary {
  paperType: string;
  printType: string;
  printSide: string;
  copies: number;
  pageRange: string;
  price: number;
  fileCount: number;
  totalPages: number;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printSummary: PrintSummary = location.state || {
    paperType: 'standard',
    printType: 'bw',
    printSide: 'single',
    copies: 1,
    pageRange: 'All Pages',
    price: 0,
    fileCount: 0,
    totalPages: 0
  };
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const { name, email, phone, address, city, state, pincode } = formData;
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      toast.error("Please fill all the required fields");
      return;
    }
    
    // Process order
    toast.success("Order placed successfully!");
    navigate("/order-confirmation", { 
      state: { 
        orderId: "PL" + Math.floor(100000 + Math.random() * 900000),
        ...printSummary,
        ...formData 
      } 
    });
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
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Delivery Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your street address"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="Pincode"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4"
                      size="lg"
                      onClick={handleSubmit}
                    >
                      Place Order
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Files</p>
                      <p>{printSummary.fileCount} file{printSummary.fileCount !== 1 ? 's' : ''}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Print Specifications</p>
                      <ul className="text-sm space-y-1">
                        <li>Paper: {getPaperTypeName(printSummary.paperType)}</li>
                        <li>Print: {printSummary.printType === 'bw' ? 'Black & White' : 'Color'}</li>
                        <li>Side: {printSummary.printSide === 'single' ? 'Single Sided' : 'Double Sided'}</li>
                        <li>Copies: {printSummary.copies}</li>
                        <li>Pages: {printSummary.pageRange}</li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>₹{printSummary.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p>Delivery Fee</p>
                      <p>{printSummary.price >= 99 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <span>₹20.00</span>
                      )}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold">
                      <p>Total</p>
                      <p>₹{(printSummary.price + (printSummary.price >= 99 ? 0 : 20)).toFixed(2)}</p>
                    </div>
                    
                    {printSummary.price >= 99 && (
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
