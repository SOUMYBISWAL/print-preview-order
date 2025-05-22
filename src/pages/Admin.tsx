
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

interface Order {
  id: string;
  customerName: string;
  files: string[];
  status: string;
  totalAmount: number;
  dateCreated: string;
  mobile: string;
  location: string;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    // Load orders from localStorage for demo
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
    
    // Calculate stats
    setStats({
      totalOrders: storedOrders.length,
      totalRevenue: storedOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0),
      pendingOrders: storedOrders.filter((order: Order) => order.status === 'Pending').length
    });
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Orders Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.mobile}</TableCell>
                      <TableCell>{order.location}</TableCell>
                      <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'Completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
