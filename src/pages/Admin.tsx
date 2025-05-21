
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Order {
  id: string;
  customerName: string;
  files: string[];
  status: string;
  totalAmount: number;
  dateCreated: string;
}

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      customerName: "John Doe",
      files: ["document1.pdf", "image1.jpg"],
      status: "Pending",
      totalAmount: 250,
      dateCreated: "2024-01-20"
    },
    // Add more mock data as needed
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.files.join(", ")}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>₹{order.totalAmount}</TableCell>
                      <TableCell>{order.dateCreated}</TableCell>
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
