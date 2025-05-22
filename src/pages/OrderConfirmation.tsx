
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Printer, Truck, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OrderConfirmation = () => {
  const location = useLocation();
  const orderDetails = location.state || {
    orderId: "Unknown",
    orderItems: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  };

  const estimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 2); // Assuming 2-day delivery
    
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
            <p className="text-gray-600 mt-2">
              Thank you for your order. We'll send you a confirmation once your order ships.
            </p>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Order Details</span>
                <span className="text-green-600">#{orderDetails.orderId || 'Unknown'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status</span>
                <span className="font-medium">Processing</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">Online Payment</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Print Summary</h3>
                {orderDetails.orderItems && orderDetails.orderItems.map((item: any, index: number) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Print Job ({item.fileCount || 1} file{(item.fileCount || 1) !== 1 ? 's' : ''})</p>
                        <ul className="text-sm text-gray-500 mt-1 space-y-1">
                          <li>Paper: {getPaperTypeName(item.paperType)}</li>
                          <li>Print: {item.printType === 'bw' ? 'Black & White' : 'Color'}</li>
                          <li>Side: {item.printSide === 'single' ? 'Single Sided' : 'Double Sided'}</li>
                          <li>Copies: {item.copies}</li>
                          <li>Pages: {item.pageRange || 'All Pages'}</li>
                          <li>Total Pages: {item.totalPages || '—'}</li>
                        </ul>
                      </div>
                      <p className="font-bold">₹{item.price ? item.price.toFixed(2) : '0.00'}</p>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>₹{orderDetails.subtotal ? orderDetails.subtotal.toFixed(2) : '0.00'}</p>
                </div>
                
                <div className="flex justify-between">
                  <p>Delivery Fee</p>
                  <p>{orderDetails.deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>₹{orderDetails.deliveryFee ? orderDetails.deliveryFee.toFixed(2) : '0.00'}</span>
                  )}</p>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>₹{orderDetails.total ? orderDetails.total.toFixed(2) : '0.00'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium">Delivery Address</h3>
                  <address className="not-italic text-gray-600 mt-1">
                    {orderDetails.name || 'N/A'}<br />
                    {orderDetails.address || 'N/A'}<br />
                    {orderDetails.city || 'N/A'}, {orderDetails.state || 'N/A'} {orderDetails.pincode || 'N/A'}
                  </address>
                </div>
                
                <div>
                  <h3 className="font-medium">Contact Information</h3>
                  <p className="text-gray-600 mt-1">{orderDetails.email || 'N/A'}</p>
                  <p className="text-gray-600">{orderDetails.phone || 'N/A'}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <div className="mr-4">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Estimated Delivery</h3>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                        <span>{estimatedDelivery()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/order-tracking">Track Order</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center">
            <Link to="/">
              <Button variant="outline" className="mr-2">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
