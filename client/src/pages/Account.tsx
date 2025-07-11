
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, LogOut, Package, Truck, MapPin, PenLine } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const Account = () => {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Address form state
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  
  // Form submission state
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingAddress, setUpdatingAddress] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Populate form fields
        setName(userData.name || "");
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
        
        if (userData.address) {
          setStreet(userData.address.street || "");
          setCity(userData.address.city || "");
          setState(userData.address.state || "");
          setPincode(userData.address.pincode || "");
        }
      } catch (error) {
        console.error("Failed to parse user data", error);
        // Invalid user data, redirect to login
        setLocation("/login");
      }
    } else {
      // No user found, redirect to login
      setLocation("/login");
    }
    
    setLoading(false);
  }, []);
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    // Trigger custom event to update UI
    window.dispatchEvent(new Event('userStateChanged'));
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    // Redirect to home
    setLocation("/");
  };
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    
    // Validate form
    if (!name || !email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setUpdatingProfile(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      if (user) {
        const updatedUser = {
          ...user,
          name,
          email,
          phone
        };
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
      }
      setUpdatingProfile(false);
    }, 1000);
  };
  
  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingAddress(true);
    
    // Validate form
    if (!street || !city || !state || !pincode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setUpdatingAddress(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      if (user) {
        const updatedUser = {
          ...user,
          address: {
            street,
            city,
            state,
            pincode
          }
        };
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast({
          title: "Address updated",
          description: "Your address information has been updated successfully.",
        });
      }
      setUpdatingAddress(false);
    }, 1000);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <p>Loading your account information...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Account</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <User className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800">
                Welcome back, <span className="font-semibold">{user.name}</span>
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="+91 98765 43210" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={updatingProfile}>
                      {updatingProfile ? "Saving..." : (
                        <>
                          <PenLine className="mr-2 h-4 w-4" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and manage your previous orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500">Your order history is empty</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate("/track-order")}
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Track an Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                  <CardDescription>
                    Update your delivery address for orders
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateAddress}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input 
                        id="street" 
                        placeholder="123 Main Street" 
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          placeholder="Mumbai" 
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          placeholder="Maharashtra" 
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input 
                        id="pincode" 
                        placeholder="400001" 
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={updatingAddress}>
                      {updatingAddress ? "Saving..." : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Update Address
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
