
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
    price: 0,
    fileCount: 0,
    printType: "bw",
    paperType: "standard",
    copies: 1
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
                <span className="text-green-600">#{orderDetails.orderId}</span>
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
              
              <div className="space-y-3">
                <h3 className="font-medium">Print Summary</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Files</span>
                  <span>{orderDetails.fileCount} file{orderDetails.fileCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Print Type</span>
                  <span>{orderDetails.printType === 'bw' ? 'Black & White' : 'Color'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paper Type</span>
                  <span>
                    {orderDetails.paperType === 'standard' ? 'Standard (70 GSM)' :
                     orderDetails.paperType === 'premium' ? 'Premium (90 GSM)' : 'Glossy (120 GSM)'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Copies</span>
                  <span>{orderDetails.copies}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹{orderDetails.price.toFixed(2)}</span>
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
                    {orderDetails.name}<br />
                    {orderDetails.address}<br />
                    {orderDetails.city}, {orderDetails.state} {orderDetails.pincode}
                  </address>
                </div>
                
                <div>
                  <h3 className="font-medium">Contact Information</h3>
                  <p className="text-gray-600 mt-1">{orderDetails.email}</p>
                  <p className="text-gray-600">{orderDetails.phone}</p>
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
