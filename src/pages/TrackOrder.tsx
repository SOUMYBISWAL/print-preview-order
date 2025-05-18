
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Truck, Search, CheckCircle, Clock, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Sample order data - in a real app, this would come from a database
const sampleOrders = [
  {
    id: "ORD123456",
    date: "2025-05-10",
    status: "delivered",
    price: 120.50,
    items: 4,
    deliveryDate: "2025-05-12"
  },
  {
    id: "ORD123457",
    date: "2025-05-16",
    status: "processing",
    price: 85.00,
    items: 2,
    deliveryDate: "2025-05-20"
  },
  {
    id: "ORD123458",
    date: "2025-05-17",
    status: "shipped",
    price: 45.75,
    items: 1,
    deliveryDate: "2025-05-19"
  }
];

type OrderStatus = "processing" | "shipped" | "delivered";

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  price: number;
  items: number;
  deliveryDate: string;
}

const TrackOrder = () => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('user');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  
  React.useEffect(() => {
    // If user is logged in, load their orders
    // In a real app, this would be an API call with user authentication
    if (isLoggedIn) {
      setUserOrders(sampleOrders);
    }
  }, [isLoggedIn]);
  
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call to track order
    setTimeout(() => {
      const foundOrder = sampleOrders.find(order => order.id === orderNumber.toUpperCase());
      
      if (foundOrder) {
        setOrderDetails(foundOrder);
        toast({
          title: "Order found",
          description: `Details for order ${foundOrder.id} retrieved successfully.`,
        });
      } else {
        setOrderDetails(null);
        toast({
          title: "Order not found",
          description: "Please check your order number and try again.",
          variant: "destructive"
        });
      }
      
      setIsSearching(false);
      setHasSearched(true);
    }, 1000);
  };
  
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processing":
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      default:
        return status;
    }
  };
  
  const viewOrderDetails = (orderId: string) => {
    // In a real app, you would navigate to an order detail page
    // For this demo, we'll just show a toast
    toast({
      title: "View Order Details",
      description: `Viewing details for order ${orderId}`,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
          
          {!isLoggedIn && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-700">
                Already have an account? <Button variant="link" className="p-0" onClick={() => navigate("/login")}>Login</Button> to view all your orders automatically.
              </p>
            </div>
          )}
          
          {/* Order tracking form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Track by Order Number</CardTitle>
              <CardDescription>
                Enter your order number to check the status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <Label htmlFor="order-number" className="sr-only">Order Number</Label>
                    <Input 
                      id="order-number" 
                      placeholder="Enter your order number (e.g., ORD123456)" 
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSearching}
                  >
                    {isSearching ? "Searching..." : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Track
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Order details display */}
          {hasSearched && orderDetails && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
                <CardDescription>
                  Details and status for order {orderDetails.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p>{new Date(orderDetails.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p>{new Date(orderDetails.deliveryDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p>₹{orderDetails.price.toFixed(2)} Rs</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(orderDetails.status)}
                      <span className="font-medium">{getStatusText(orderDetails.status)}</span>
                    </div>
                    <p className="mt-2 text-gray-600 text-sm">
                      {orderDetails.status === "delivered" ? 
                        "Your order has been delivered successfully." : 
                        orderDetails.status === "shipped" ? 
                        "Your order is on the way and will be delivered soon." :
                        "Your order is being processed and will be shipped soon."
                      }
                    </p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-0 top-2 h-1 w-full bg-gray-200 rounded">
                      <div 
                        className={`h-1 bg-green-600 rounded ${
                          orderDetails.status === "processing" ? "w-1/3" :
                          orderDetails.status === "shipped" ? "w-2/3" : "w-full"
                        }`}
                      ></div>
                    </div>
                    <div className="pt-6 flex justify-between">
                      <div className="text-center">
                        <div className={`w-5 h-5 mx-auto rounded-full ${
                          orderDetails.status === "processing" || 
                          orderDetails.status === "shipped" || 
                          orderDetails.status === "delivered" ? "bg-green-600" : "bg-gray-300"
                        }`}></div>
                        <p className="text-xs mt-1">Processing</p>
                      </div>
                      <div className="text-center">
                        <div className={`w-5 h-5 mx-auto rounded-full ${
                          orderDetails.status === "shipped" || 
                          orderDetails.status === "delivered" ? "bg-green-600" : "bg-gray-300"
                        }`}></div>
                        <p className="text-xs mt-1">Shipped</p>
                      </div>
                      <div className="text-center">
                        <div className={`w-5 h-5 mx-auto rounded-full ${
                          orderDetails.status === "delivered" ? "bg-green-600" : "bg-gray-300"
                        }`}></div>
                        <p className="text-xs mt-1">Delivered</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {hasSearched && !orderDetails && (
            <Card className="mb-8 border-red-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-red-600">No order found with the number: {orderNumber}</p>
                  <p className="text-gray-500 mt-2">Please check the order number and try again</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* User's order history - only shown when logged in */}
          {isLoggedIn && (
            <Card>
              <CardHeader>
                <CardTitle>Your Order History</CardTitle>
                <CardDescription>
                  Recent orders placed with PrintLite
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span>{getStatusText(order.status)}</span>
                            </div>
                          </TableCell>
                          <TableCell>₹{order.price.toFixed(2)} Rs</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => viewOrderDetails(order.id)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">You haven't placed any orders yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate("/")}
                    >
                      Start Shopping
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrackOrder;
