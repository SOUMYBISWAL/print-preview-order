import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Check, Clock, Package, FileText, Download, Eye, Trash2 } from 'lucide-react';
import Navbar from "@/components/Navbar";
import { toast } from 'sonner';
import { 
  usePrintOrders, 
  useUpdateOrderStatus, 
  useDeleteOrder, 
  useFileMetadata, 
  useDeleteFileMetadata,
  useGetFileUrl,
  useDeleteFile 
} from '@/hooks/useAmplifyData';
import { storageUtils } from '@/lib/amplify-client';

interface Order {
  id: string;
  files: string[];
  paperType: string;
  colorOption: string;
  printSides: string;
  binding?: string;
  quantity: number;
  totalPages: number;
  totalPrice: number;
  status: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StorageFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  s3Key: string;
  pageCount?: number;
  orderId?: string;
  uploadedAt?: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Use Amplify hooks for data fetching
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = usePrintOrders();
  const { data: fileMetadata = [], isLoading: filesLoading, refetch: refetchFiles } = useFileMetadata();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();
  const deleteFileMutation = useDeleteFile();
  const deleteFileMetadataMutation = useDeleteFileMetadata();
  const getFileUrlMutation = useGetFileUrl();

  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.isAdmin) {
      setIsAuthenticated(true);
    }
  }, []);

  // Calculate stats when orders data changes
  useEffect(() => {
    if (orders.length > 0) {
      calculateStats(orders.map(order => ({
        ...order,
        files: order.files || [],
        totalPrice: order.totalPrice || 0
      })));
    }
  }, [orders]);

  // Handle order status updates
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ id: orderId, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrderMutation.mutateAsync(orderId);
        toast.success('Order deleted successfully');
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  // Handle file download
  const handleDownloadFile = async (s3Key: string, fileName: string) => {
    try {
      const url = await getFileUrlMutation.mutateAsync(s3Key);
      const link = document.createElement('a');
      link.href = url.toString();
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('File download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (fileId: string, s3Key: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        // Delete from S3
        await deleteFileMutation.mutateAsync(s3Key);
        // Delete metadata from DynamoDB
        await deleteFileMetadataMutation.mutateAsync(fileId);
        toast.success('File deleted successfully');
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error('Failed to delete file');
      }
    }
  };

  const calculateStats = (ordersData: Order[]) => {
    const stats = {
      totalOrders: ordersData.length,
      pendingOrders: ordersData.filter(order => order.status === 'pending').length,
      inProgressOrders: ordersData.filter(order => order.status === 'processing' || order.status === 'printing').length,
      totalRevenue: ordersData.reduce((sum, order) => sum + order.totalPrice, 0)
    };
    setStats(stats);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    
    setTimeout(() => {
      // Admin credentials check
      if (loginMobile === "9999999999" && loginPassword === "admin123") {
        const user = {
          mobile: loginMobile,
          name: "Admin",
          isLoggedIn: true,
          isAdmin: true
        };
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('userStateChanged'));
      } else {
        alert('Invalid admin credentials');
      }
      setLoggingIn(false);
    }, 1000);
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter files based on search
  const filteredFiles = fileMetadata.filter(file => 
    file.fileName.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
    file.s3Key.toLowerCase().includes(fileSearchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Printer className="h-6 w-6 text-blue-600" />
                <span>Admin Login</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter admin mobile number"
                    value={loginMobile}
                    onChange={(e) => setLoginMobile(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loggingIn}>
                  {loggingIn ? "Logging in..." : "Login to Admin Panel"}
                </Button>
              </form>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>Demo credentials:</p>
                <p>Mobile: 9999999999</p>
                <p>Password: admin123</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
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
                        <p className="text-3xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
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
                            <p className="text-sm text-gray-600">{order.pages} pages • ₹{order.totalAmount.toFixed(2)}</p>
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
                              <p className="text-lg font-bold">₹{order.totalAmount.toFixed(2)}</p>
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

            <TabsContent value="files" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files Management</CardTitle>
                  <p className="text-sm text-gray-600">View and manage files stored in Amplify Storage with their print settings</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-6">
                    <Input
                      placeholder="Search files by name or key..."
                      value={fileSearchTerm}
                      onChange={(e) => setFileSearchTerm(e.target.value)}
                      className="max-w-md"
                    />
                    <div className="flex space-x-2">
                      <Button 
                        onClick={fetchStorageFiles} 
                        disabled={loadingFiles}
                        variant="outline"
                      >
                        {loadingFiles ? 'Loading...' : 'Refresh Files'}
                      </Button>
                      <Badge variant="secondary">
                        {filteredFiles.length} files
                      </Badge>
                    </div>
                  </div>

                  {loadingFiles ? (
                    <div className="text-center py-12">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading files from storage...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredFiles.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No files found in storage</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Files uploaded through the system will appear here
                          </p>
                        </div>
                      ) : (
                        filteredFiles.map((file) => (
                          <Card key={file.key} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-6 w-6 text-blue-500" />
                                  <div>
                                    <h3 className="font-semibold text-lg">{file.name}</h3>
                                    <p className="text-sm text-gray-600">
                                      {formatFileSize(file.size)} • Uploaded {file.lastModified.toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Storage Key: {file.key}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadFile(file.key)}
                                    className="flex items-center space-x-1"
                                  >
                                    <Download className="h-4 w-4" />
                                    <span>Download</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteFile(file.key)}
                                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-3 text-gray-800">File Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Uploaded by:</span>
                                      <span className="font-medium">{file.uploadedBy}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">File size:</span>
                                      <span className="font-medium">{formatFileSize(file.size)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Upload date:</span>
                                      <span className="font-medium">{file.lastModified.toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-3 text-gray-800">Print Settings</h4>
                                  {file.printSettings ? (
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Paper size:</span>
                                        <Badge variant="outline">{file.printSettings.paperSize}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Print type:</span>
                                        <Badge variant="outline">{file.printSettings.printType}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Sides:</span>
                                        <Badge variant="outline">{file.printSettings.sides}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Binding:</span>
                                        <Badge variant="outline">{file.printSettings.binding}</Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Copies:</span>
                                        <Badge variant="outline">{file.printSettings.copies}</Badge>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-4">
                                      <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                      <p className="text-sm text-gray-600">No print settings configured</p>
                                      <p className="text-xs text-gray-500">
                                        Settings will appear when file is processed for printing
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {file.printSettings && (
                                <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Preview Print
                                  </Button>
                                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                                    <Printer className="h-4 w-4 mr-1" />
                                    Send to Print Queue
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
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
