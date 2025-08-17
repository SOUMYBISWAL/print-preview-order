
import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image, Printer, Truck, Star, StarHalf, Clock, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

// Define product type
interface Product {
  id: string;
  title: string;
  image: string;
  pages: number;
  rating: number;
  reviews: number;
  timeMinutes: number;
  discount: number;
  price: number;
  originalPrice: number;
}

const Index = () => {
  // Sample products data
  const products: Product[] = [
    {
      id: "rent-receipt",
      title: "Print your Rent Receipt",
      image: "/placeholder.svg",
      pages: 15,
      rating: 3,
      reviews: 151,
      timeMinutes: 8,
      discount: 68,
      price: 30,
      originalPrice: 95
    },
    {
      id: "om-jai-jagdish",
      title: "Print Your Aarti - Om Jai Jagdish Hare (English/Hindi)",
      image: "/placeholder.svg",
      pages: 3,
      rating: 4,
      reviews: 87,
      timeMinutes: 8,
      discount: 50,
      price: 19,
      originalPrice: 38
    },
    {
      id: "lakshmi-aarti",
      title: "Print Your Aarti - Laxmi Ji Ki Aarti (English/Hindi)",
      image: "/placeholder.svg",
      pages: 3,
      rating: 4.5,
      reviews: 105,
      timeMinutes: 8,
      discount: 50,
      price: 19,
      originalPrice: 38
    },
    {
      id: "ganesh-aarti",
      title: "Print Your Aarti - Ganesh Ji Ki Aarti (English/Hindi)",
      image: "/placeholder.svg",
      pages: 3,
      rating: 5,
      reviews: 92,
      timeMinutes: 8,
      discount: 50,
      price: 19,
      originalPrice: 38
    }
  ];

  const [cartItems, setCartItems] = useState<string[]>([]);

  const handleAddToCart = (productId: string) => {
    // Create a basic cart item
    const cartItem = {
      id: `cart-${Date.now()}`,
      paperType: "standard",
      printType: "bw",
      printSide: "single",
      copies: 1,
      pageRange: "all",
      price: products.find(p => p.id === productId)?.price || 0,
      fileCount: 1,
      totalPages: products.find(p => p.id === productId)?.pages || 0
    };
    
    // Add to localStorage
    const currentCart = JSON.parse(localStorage.getItem('printCart') || '[]');
    localStorage.setItem('printCart', JSON.stringify([...currentCart, cartItem]));
    
    // Update cart items
    setCartItems([...cartItems, productId]);
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success("Product added to cart!");
  };

  // Render stars based on rating
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />);
    }
    
    return stars;
  };

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
          <h2 className="text-2xl font-bold mb-6">Print your Last Minute Needs</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <div className="mb-1 text-sm text-blue-600">{product.pages} pages</div>
                  <h3 className="text-base font-medium mb-2 line-clamp-2 h-12">{product.title}</h3>
                  
                  <div className="flex items-center mb-1">
                    <div className="flex">
                      {renderRatingStars(product.rating)}
                    </div>
                    <span className="text-gray-500 text-xs ml-1">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{product.timeMinutes} MINS</span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                    <div className="ml-2">
                      <span className="font-bold">₹{product.price}</span>
                      <span className="text-gray-400 text-sm ml-1 line-through">MRP ₹{product.originalPrice}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-white text-green-600 border border-green-600 hover:bg-green-50 mt-auto"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Print
                  </Button>
                </CardContent>
              </Card>
            ))}
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
