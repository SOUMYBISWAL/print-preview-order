import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { demoSignUp, demoSignIn, demoSignOut, demoGetCurrentUser } from "@/lib/auth-demo";

const AmplifyTestPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleSignUp = async () => {
    setLoading(true);
    const result = await demoSignUp(email, password);
    
    if (result.success) {
      toast({
        title: "Sign up attempt",
        description: result.isSignUpComplete ? "Account created successfully!" : "Check your email for verification",
      });
    } else {
      toast({
        title: "Sign up failed",
        description: result.error,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    const result = await demoSignIn(email, password);
    
    if (result.success) {
      toast({
        title: "Sign in attempt",
        description: result.isSignedIn ? "Signed in successfully!" : "Additional steps required",
      });
      if (result.isSignedIn) {
        await checkCurrentUser();
      }
    } else {
      toast({
        title: "Sign in failed",
        description: result.error,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    const result = await demoSignOut();
    
    if (result.success) {
      toast({
        title: "Sign out successful",
        description: "You have been signed out",
      });
      setCurrentUser(null);
    } else {
      toast({
        title: "Sign out failed",
        description: result.error,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const checkCurrentUser = async () => {
    const result = await demoGetCurrentUser();
    if (result.success) {
      setCurrentUser(result.user);
    } else {
      setCurrentUser(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">AWS Amplify Auth Testing</h1>
            <p className="text-gray-600">
              Test AWS Cognito authentication integration
            </p>
          </div>

          <ConnectionStatus />

          <Card>
            <CardHeader>
              <CardTitle>Authentication Test</CardTitle>
              <CardDescription>
                Enter credentials to test Amplify authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSignUp} 
                  disabled={loading || !email || !password}
                  variant="outline"
                  data-testid="button-signup"
                >
                  Sign Up
                </Button>
                <Button 
                  onClick={handleSignIn} 
                  disabled={loading || !email || !password}
                  data-testid="button-signin"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={handleSignOut} 
                  disabled={loading}
                  variant="destructive"
                  data-testid="button-signout"
                >
                  Sign Out
                </Button>
              </div>
              
              <Button 
                onClick={checkCurrentUser} 
                disabled={loading}
                variant="secondary"
                className="w-full"
                data-testid="button-check-user"
              >
                Check Current User
              </Button>
            </CardContent>
          </Card>

          {currentUser && (
            <Card>
              <CardHeader>
                <CardTitle>Current User</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(currentUser, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AmplifyTestPage;