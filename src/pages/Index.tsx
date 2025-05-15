
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image, Printer, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl font-bold mb-4">Quick and Easy Document Printing</h1>
            <p className="text-lg text-gray-600 mb-6">Upload your files, customize your print settings, and get your prints delivered fast</p>
            <Link to="/upload">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Upload className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Upload Your Files</h3>
                <p className="text-gray-500">PDF, Word, JPG, PNG and more</p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Printer className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Customize Print Settings</h3>
                <p className="text-gray-500">Color, paper type, size and more</p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Preview Your Document</h3>
                <p className="text-gray-500">Check each page before ordering</p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Fast Delivery</h3>
                <p className="text-gray-500">Free delivery on orders above ₹99</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Document printing"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-medium mb-2">Document Printing</h3>
                <p className="text-gray-500 mb-4">Print your documents in black & white (₹1.5/page) or color (₹4/page)</p>
                <Link to="/upload">
                  <Button className="w-full">Print Now</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Photo printing"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-medium mb-2">Photo Printing</h3>
                <p className="text-gray-500 mb-4">High quality color prints for your photos in various sizes</p>
                <Link to="/upload">
                  <Button className="w-full">Print Photos</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Bulk printing"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-medium mb-2">Bulk Printing</h3>
                <p className="text-gray-500 mb-4">Special rates for bulk orders with quick turnaround time</p>
                <Link to="/upload">
                  <Button className="w-full">Bulk Order</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Free Delivery on Orders Above ₹99</h2>
              <p className="text-gray-600">Upload your files now and get same day printing</p>
            </div>
            <Link to="/upload">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">Start Printing</Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
