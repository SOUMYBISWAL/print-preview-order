
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { LogIn, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registering, setRegistering] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    
    // Simulating authentication process
    setTimeout(() => {
      // In a real application, you would verify credentials against a backend
      if (loginEmail && loginPassword) {
        // Store user info in localStorage (in a real app, use tokens)
        const user = {
          email: loginEmail,
          name: loginEmail.split('@')[0], // Simple name extraction for demo
          isLoggedIn: true
        };
        localStorage.setItem('user', JSON.stringify(user));
        
        // Trigger custom event to update UI
        window.dispatchEvent(new Event('userStateChanged'));
        
        toast({
          title: "Login successful",
          description: "Welcome back to PrintLite!",
        });
        
        navigate("/");
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
    if (!registerName || !registerEmail || !registerPassword) {
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
        email: registerEmail,
        isLoggedIn: true
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      // Trigger custom event to update UI
      window.dispatchEvent(new Event('userStateChanged'));
      
      toast({
        title: "Registration successful",
        description: "Welcome to PrintLite!",
      });
      
      navigate("/");
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
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
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
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="name@example.com" 
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
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
