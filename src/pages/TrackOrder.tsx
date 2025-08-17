import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, Check, Truck, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Define the order status type
type OrderStatus = "processing" | "printed" | "shipped" | "delivered";

// Define the order type
interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  price: number;
  items: number;
  deliveryDate: string;
}

const TrackOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingId, setTrackingId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setIsLoading(true);
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(storedOrders);
      setIsLoading(false);
    }
  }, []);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Try to fetch from the backend API first
      const response = await apiRequest(`/api/orders/${trackingId}`);
      if (response) {
        const formattedOrder: Order = {
          id: response.id,
          date: new Date(response.createdAt).toLocaleDateString(),
          status: response.status.toLowerCase() as OrderStatus,
          price: response.totalAmount,
          items: response.totalPages,
          deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
        };
        setTrackedOrder(formattedOrder);
      } else {
        setTrackedOrder(null);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      // Fallback to localStorage
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = storedOrders.find((order: any) => order.orderId === trackingId);
      
      if (foundOrder) {
        setTrackedOrder({
          id: foundOrder.orderId,
          date: foundOrder.dateCreated.split('T')[0],
          status: foundOrder.status.toLowerCase(),
          price: foundOrder.totalAmount,
          items: foundOrder.files.length,
          deliveryDate: new Date(foundOrder.dateCreated).toLocaleDateString(),
        });
      } else {
        setTrackedOrder(null);
      }
    }
    
    setIsLoading(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants = {
      processing: "bg-yellow-100 text-yellow-800",
      printed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800"
    };
    
    return <Badge className={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return <Package className="h-5 w-5 text-yellow-600" />;
      case "printed":
        return <Check className="h-5 w-5 text-blue-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-600" />;
      case "delivered":
        return <Check className="h-5 w-5 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
          
          <Tabs defaultValue="track" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="track">Track Order</TabsTrigger>
              <TabsTrigger value="history">Order History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="track" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Enter Tracking ID
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTrackOrder} className="space-y-4">
                    <div>
                      <Label htmlFor="tracking-id">Order ID</Label>
                      <Input
                        id="tracking-id"
                        type="text"
                        placeholder="Enter your order ID (e.g., ORD001)"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" disabled={isLoading || !trackingId.trim()}>
                      {isLoading ? "Tracking..." : "Track Order"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {trackedOrder && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Order Details</span>
                      {getStatusBadge(trackedOrder.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-500">Order ID</Label>
                        <p className="font-medium">{trackedOrder.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Order Date</Label>
                        <p className="font-medium">{trackedOrder.date}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Total Amount</Label>
                        <p className="font-medium">₹{trackedOrder.price}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Items</Label>
                        <p className="font-medium">{trackedOrder.items} items</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      {getStatusIcon(trackedOrder.status)}
                      <span className="font-medium">Status: {trackedOrder.status.charAt(0).toUpperCase() + trackedOrder.status.slice(1)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Expected delivery: {trackedOrder.deliveryDate}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {trackedOrder === null && trackingId && !isLoading && (
                <Card>
                  <CardContent className="text-center py-6">
                    <p className="text-gray-500">No order found with ID: {trackingId}</p>
                    <p className="text-sm text-gray-400 mt-2">Please check your order ID and try again.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-6">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-6">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No order history found</p>
                    <p className="text-sm text-gray-400 mt-2">Your recent orders will appear here.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.price}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrackOrder;