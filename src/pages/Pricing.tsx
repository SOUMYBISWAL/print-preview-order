
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600">Choose the perfect printing option for your needs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="relative">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Black & White</h3>
              <div className="text-4xl font-bold mb-6">
                ₹1.50<span className="text-lg text-gray-500">/page</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Single-sided printing
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Standard paper quality
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Double-sided: ₹2.50/sheet
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/upload">Start Printing</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Color</h3>
              <div className="text-4xl font-bold mb-6">
                ₹4.00<span className="text-lg text-gray-500">/page</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Single-sided printing
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Standard paper quality
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Double-sided: ₹8.00/sheet
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/upload">Start Printing</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Premium Options</h3>
              <div className="text-4xl font-bold mb-6">
                +₹0.50<span className="text-lg text-gray-500">/page</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Premium paper quality
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Glossy option available
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Free delivery above ₹99
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/upload">Start Printing</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto text-center bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Bulk Orders?</h2>
          <p className="text-gray-600 mb-6">Contact us for special pricing on large orders</p>
          <Button asChild variant="outline">
            <Link to="/contact">Contact Sales</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
