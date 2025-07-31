import React from "react";
import { useLocation } from "wouter";
import AmplifyAuth from "@/components/AmplifyAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AmplifyAuthPage = () => {
  const [, setLocation] = useLocation();

  const handleSignedIn = () => {
    // Redirect to main app after successful authentication
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <AmplifyAuth>
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Welcome to PrintLite!</h2>
              <p className="text-gray-600 mb-6">
                You're successfully authenticated with AWS Amplify.
              </p>
              <button 
                onClick={handleSignedIn}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                data-testid="button-continue-app"
              >
                Continue to App
              </button>
            </div>
          </AmplifyAuth>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AmplifyAuthPage;