import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Check, Clock, Package } from 'lucide-react';
import Navbar from "@/components/Navbar";

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  files: string[];
  status: string;
  totalAmount: number;
  pages: number;
  dateCreated: string;
  printType: string;
  paperSize: string;
  sides: string;
  binding: string;
  deliveryAddress: string;
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  totalRevenue: number;
}

const Admin = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.isAdmin) {
      setLocation('/login');
    }
  }, []);

  useEffect(() => {
    // Fetch orders from API
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const ordersData = await response.json();
      const formattedOrders = ordersData.map((order: any) => ({
        id: order.id.toString(),
        customerName: order.customerName,
        email: order.email,
        phone: order.phone,
        files: order.fileNames || [],
        status: order.status.toLowerCase(),
        totalAmount: parseFloat(order.totalAmount),
        pages: order.totalPages,
        dateCreated: new Date(order.createdAt).toLocaleDateString(),
        printType: order.printType.replace('_', ' ').toLowerCase(),
        paperSize: order.paperSize,
        sides: order.sides.toLowerCase(),
        binding: order.binding?.toLowerCase() || 'none',
        deliveryAddress: order.deliveryAddress
      }));
      
      setOrders(formattedOrders);
      calculateStats(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders from backend:', error);
      // Fallback to sample data if backend API fails
      loadSampleOrders();
    }
  };

  const calculateStats = (ordersData: Order[]) => {
    const stats = {
      totalOrders: ordersData.length,
      pendingOrders: ordersData.filter(order => order.status === 'pending').length,
      inProgressOrders: ordersData.filter(order => order.status === 'processing' || order.status === 'printing').length,
      totalRevenue: ordersData.reduce((sum, order) => sum + order.totalAmount, 0)
    };
    setStats(stats);
  };

  const loadSampleOrders = () => {
    const sampleOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        files: ['Resume.pdf'],
        status: 'Delivered',
        totalAmount: 7.75,
        pages: 3,
        dateCreated: '2024-01-15',
        printType: 'Color',
        paperSize: 'A4',
        sides: 'single',
        binding: 'none',
        deliveryAddress: '123 Main St, New York, NY 10001'
      },
      {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 987-6543',
        files: ['Presentation.pdf', 'Handouts.pdf'],
        status: 'Printing',
        totalAmount: 11.25,
        pages: 25,
        dateCreated: '2024-01-16',
        printType: 'Color',
        paperSize: 'A4',
        sides: 'double',
        binding: 'spiral',
        deliveryAddress: '456 Oak Ave, Los Angeles, CA 90210'
      },
      {
        id: 'ORD-003',
        customerName: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1 (555) 456-7890',
        files: ['Document.pdf'],
        status: 'Pending',
        totalAmount: 7.00,
        pages: 8,
        dateCreated: '2024-01-17',
        printType: 'Black & White',
        paperSize: 'Letter',
        sides: 'single',
        binding: 'none',
        deliveryAddress: '789 Pine Rd, Chicago, IL 60601'
      }
    ];

    setOrders(sampleOrders);
    calculateStats(sampleOrders);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      calculateStats(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Check className="h-4 w-4" />;
      case 'Printing':
        return <Printer className="h-4 w-4" />;
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500';
      case 'Printing':
        return 'bg-blue-500';
      case 'Pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Printer className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-semibold">PrintExpress Admin</span>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">Customer Portal</Button>
          <Button variant="outline">Home</Button>
        </div>
      </div>

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage orders, printing, and deliveries.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="print-queue">Print Queue</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-3xl font-bold">{stats.totalOrders}</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-3xl font-bold">{stats.pendingOrders}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                        <p className="text-3xl font-bold">{stats.inProgressOrders}</p>
                      </div>
                      <Printer className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                        <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                      </div>
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <p className="text-sm text-gray-600">Latest orders requiring attention</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <p className="font-semibold">{order.id} - {order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.pages} pages • ${order.totalAmount.toFixed(2)}</p>
                          </div>
                        </div>
                        <Badge className={order.status === 'Delivered' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <p className="text-sm text-gray-600">Search and filter orders</p>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 mb-6">
                    <Input
                      placeholder="Search by customer name or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Status">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Printing">Printing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <h3 className="text-lg font-semibold">{order.id} - {order.customerName}</h3>
                              <Badge className={order.status === 'Delivered' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
                              <p className="text-sm text-gray-600">{order.pages} pages</p>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-4">{order.email} • {order.phone}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2">Files</h4>
                              {order.files.map((file, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm">{file}</span>
                                  <Button variant="ghost" size="sm">👁</Button>
                                  <Button variant="ghost" size="sm">⬇</Button>
                                </div>
                              ))}
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Print Options</h4>
                              <div className="text-sm space-y-1">
                                <p>Type: {order.printType}</p>
                                <p>Size: {order.paperSize}</p>
                                <p>Sides: {order.sides}</p>
                                <p>Binding: {order.binding}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Delivery Address</h4>
                              <p className="text-sm">{order.deliveryAddress}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <Select 
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Printing">Printing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="space-x-2">
                              <Button variant="outline">Print Label</Button>
                              <Button className="bg-black text-white hover:bg-gray-800">
                                {order.status === 'Pending' ? 'Start Printing' : 'Mark Complete'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="print-queue" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Print Queue</CardTitle>
                  <p className="text-sm text-gray-600">Manage printing jobs</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.filter(order => order.status === 'Printing' || order.status === 'Pending').map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Printer className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="font-semibold">{order.id} - {order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.pages} pages • {order.printType.toLowerCase()} • {order.paperSize.toLowerCase()}</p>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline">Preview</Button>
                          <Button className="bg-black text-white hover:bg-gray-800">
                            {order.status === 'Printing' ? 'Mark Complete' : 'Start Printing'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Management</CardTitle>
                  <p className="text-sm text-gray-600">Track and manage deliveries</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.filter(order => order.status === 'Delivered' || order.status === 'Shipped').map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-8 w-8 text-green-500">🚚</div>
                          <div>
                            <p className="font-semibold">{order.id} - {order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline">Track Package</Button>
                          <Button className="bg-black text-white hover:bg-gray-800">
                            {order.status}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
