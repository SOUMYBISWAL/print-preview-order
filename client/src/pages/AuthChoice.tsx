import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Zap, Cloud } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AuthChoice = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Choose Your Authentication Method</h1>
            <p className="text-gray-600">
              Select how you'd like to sign in to PrintLite
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Local Authentication */}
            <Card className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-6 w-6 text-blue-600" />
                    <CardTitle>Local Account</CardTitle>
                  </div>
                  <Badge variant="secondary">Quick Setup</Badge>
                </div>
                <CardDescription>
                  Simple mobile number and password authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Instant access - no email verification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Mobile number based login</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Local storage for development</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-xs text-gray-500 mb-4">
                    Perfect for testing and quick access. Admin login: 9999999999 / admin123
                  </p>
                  <Link href="/login">
                    <Button className="w-full" data-testid="button-local-auth">
                      Continue with Local Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* AWS Amplify Authentication */}
            <Card className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cloud className="h-6 w-6 text-orange-600" />
                    <CardTitle>AWS Amplify</CardTitle>
                  </div>
                  <Badge variant="outline">Production Ready</Badge>
                </div>
                <CardDescription>
                  Secure cloud authentication with AWS Cognito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Enterprise-grade security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cloud className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Email verification & password recovery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Scalable cloud infrastructure</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-xs text-gray-500 mb-4">
                    Requires AWS credentials configuration. Best for production deployment.
                  </p>
                  <Link href="/amplify-auth">
                    <Button variant="outline" className="w-full" data-testid="button-amplify-auth">
                      Continue with AWS Amplify
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              You can always change your authentication method later in the settings.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthChoice;