
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
      // Try to fetch from local API or localStorage
      
      const client = generateClient();
      
      const result = await client.graphql({
        query: getOrderByID,
        variables: { id: trackingId.trim() }
      });

      const orderData = result.data.getOrderByID;
      
      if (orderData) {
        const formattedOrder: Order = {
          id: orderData.id,
          date: new Date(orderData.createdAt).toLocaleDateString(),
          status: orderData.status.toLowerCase() as OrderStatus,
          price: orderData.totalAmount,
          items: orderData.totalPages,
          deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString() // Estimated 2 days from now
        };
        
        setTrackedOrder(formattedOrder);
      } else {
        // Check localStorage as fallback
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
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return "bg-yellow-500";
      case "printed":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusStepCompleted = (orderStatus: OrderStatus, step: OrderStatus): boolean => {
    const statuses: OrderStatus[] = ["processing", "printed", "shipped", "delivered"];
    const orderIndex = statuses.indexOf(orderStatus);
    const stepIndex = statuses.indexOf(step);
    return stepIndex <= orderIndex;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

        <Tabs defaultValue="track">
          <TabsList className="mb-4">
            <TabsTrigger value="track">Track by Order ID</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="track">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Enter Order ID</CardTitle>
              </CardHeader>
              <form onSubmit={handleTrackOrder}>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tracking-id">Order ID</Label>
                    <Input
                      id="tracking-id"
                      placeholder="e.g. ORD-1234567"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading || !trackingId}>
                    {isLoading ? "Tracking..." : "Track Order"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {trackedOrder && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>Order {trackedOrder.id}</span>
                    <Badge className={getStatusColor(trackedOrder.status)}>
                      {trackedOrder.status.charAt(0).toUpperCase() + trackedOrder.status.slice(1)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">{trackedOrder.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Items</p>
                      <p className="font-medium">{trackedOrder.items}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-medium">₹{trackedOrder.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expected Delivery</p>
                      <p className="font-medium">{trackedOrder.deliveryDate}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tracking Progress</h3>
                    <div className="flex flex-col md:flex-row justify-between items-start">
                      <div className="flex flex-col items-center mb-4 md:mb-0">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getStatusStepCompleted(trackedOrder.status, "processing") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                          <Package className="h-6 w-6" />
                        </div>
                        <p className="mt-2 text-sm font-medium">Processing</p>
                      </div>

                      <div className="hidden md:block w-full mx-2 h-0.5 mt-6 bg-gray-200 flex-grow relative">
                        <div className={`absolute top-0 left-0 h-full ${getStatusStepCompleted(trackedOrder.status, "printed") ? "bg-green-500 w-full" : "w-0"} transition-all duration-500`}></div>
                      </div>

                      <div className="flex flex-col items-center mb-4 md:mb-0">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getStatusStepCompleted(trackedOrder.status, "printed") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                          <Check className="h-6 w-6" />
                        </div>
                        <p className="mt-2 text-sm font-medium">Printed</p>
                      </div>

                      <div className="hidden md:block w-full mx-2 h-0.5 mt-6 bg-gray-200 flex-grow relative">
                        <div className={`absolute top-0 left-0 h-full ${getStatusStepCompleted(trackedOrder.status, "shipped") ? "bg-green-500 w-full" : "w-0"} transition-all duration-500`}></div>
                      </div>

                      <div className="flex flex-col items-center mb-4 md:mb-0">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getStatusStepCompleted(trackedOrder.status, "shipped") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                          <Truck className="h-6 w-6" />
                        </div>
                        <p className="mt-2 text-sm font-medium">Shipped</p>
                      </div>

                      <div className="hidden md:block w-full mx-2 h-0.5 mt-6 bg-gray-200 flex-grow relative">
                        <div className={`absolute top-0 left-0 h-full ${getStatusStepCompleted(trackedOrder.status, "delivered") ? "bg-green-500 w-full" : "w-0"} transition-all duration-500`}></div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getStatusStepCompleted(trackedOrder.status, "delivered") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                          <Calendar className="h-6 w-6" />
                        </div>
                        <p className="mt-2 text-sm font-medium">Delivered</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            {isLoading ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">Loading your orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between text-base">
                        <span>Order {order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Order Date</p>
                          <p className="font-medium">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Items</p>
                          <p className="font-medium">{order.items}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total</p>
                          <p className="font-medium">₹{order.price}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Delivery Date</p>
                          <p className="font-medium">{order.deliveryDate}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" onClick={() => setTrackedOrder(order)}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <h3 className="text-lg font-medium mb-2">No orders found</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
                <Button variant="outline" asChild>
                  <a href="/upload">Upload a document to print</a>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
