
import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { LogIn, UserPlus, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAmplifyAuth } from "@/hooks/useAmplifyAuth";

const Login = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form state
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registering, setRegistering] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    
    // Simulating authentication process
    setTimeout(() => {
      // In a real application, you would verify credentials against a backend
      if (loginMobile && loginPassword) {
        // Store user info in localStorage (in a real app, use tokens)
        // Admin credentials check (for demo purposes - in production use proper authentication)
        const isAdmin = loginMobile === "9999999999" && loginPassword === "admin123";
        const user = {
          mobile: loginMobile,
          name: isAdmin ? "Admin" : `User-${loginMobile.substring(6)}`,
          isLoggedIn: true,
          isAdmin: isAdmin
        };
        localStorage.setItem('user', JSON.stringify(user));
        
        // Trigger custom event to update UI
        window.dispatchEvent(new Event('userStateChanged'));
        
        toast({
          title: "Login successful",
          description: "Welcome back to PrintLite!",
        });
        
        setLocation("/");
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
      setLoggingIn(false);
    }, 1000);
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    
    // Validate form
    if (!registerName || !registerMobile || !registerPassword) {
      toast({
        title: "Registration failed",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setRegistering(false);
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      setRegistering(false);
      return;
    }
    
    // Simulate registration process
    setTimeout(() => {
      // In a real application, you would send this data to a backend API
      const user = {
        name: registerName,
        mobile: registerMobile,
        isLoggedIn: true
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      // Trigger custom event to update UI
      window.dispatchEvent(new Event('userStateChanged'));
      
      toast({
        title: "Registration successful",
        description: "Welcome to PrintLite!",
      });
      
      setLocation("/");
      setRegistering(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your mobile number and password to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="mobile" 
                          type="tel"
                          pattern="[0-9]{10}" 
                          placeholder="10-digit mobile number" 
                          value={loginMobile}
                          onChange={(e) => setLoginMobile(e.target.value)}
                          className="rounded-l-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-blue-600">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={loggingIn}>
                      {loggingIn ? "Logging in..." : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Login
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your information to create a new account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-mobile">Mobile Number</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="register-mobile" 
                          type="tel"
                          pattern="[0-9]{10}" 
                          placeholder="10-digit mobile number" 
                          value={registerMobile}
                          onChange={(e) => setRegisterMobile(e.target.value)}
                          className="rounded-l-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={registering}>
                      {registering ? "Creating account..." : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Register
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

export default Login;
