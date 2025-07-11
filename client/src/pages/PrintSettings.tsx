import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingCart, ArrowRight, Star, Plus, Minus } from "lucide-react";

interface PrintSettingsProps {}

interface RelatedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

const PrintSettings: React.FC<PrintSettingsProps> = () => {
  const [, setLocation] = useLocation();
  
  // Get file data from localStorage
  const storedFiles = localStorage.getItem('uploadedFiles');
  const storedTotalPages = localStorage.getItem('totalPages');
  const files = storedFiles ? JSON.parse(storedFiles) : [];
  const totalPages = storedTotalPages ? parseInt(storedTotalPages) : 5;
  const fileCount = files.length || 1;

  const [paperType, setPaperType] = useState("standard");
  const [printType, setPrintType] = useState("bw");
  const [printSide, setPrintSide] = useState("single");
  const [copies, setCopies] = useState(1);
  const [pageRangeType, setPageRangeType] = useState("all");
  const [customRange, setCustomRange] = useState("");
  const [price, setPrice] = useState(0);
  const [calculatedPages, setCalculatedPages] = useState(totalPages);
  const [rangeError, setRangeError] = useState<string | null>(null);
  const [uniquePages, setUniquePages] = useState<number[]>([]);
  
  const relatedProducts: RelatedProduct[] = [
    {
      id: "p1",
      name: "Fevistik Glue Stick",
      description: "15 g",
      price: 40,
      image: "https://m.media-amazon.com/images/I/61eDx+Xm+HL._AC_UF894,1000_QL80_.jpg",
      rating: 4.5,
      reviews: 6473
    },
    {
      id: "p2",
      name: "Faber-Castell Highlighter Pen",
      description: "Multicolor 5 pcs",
      price: 125,
      image: "https://m.media-amazon.com/images/I/71mCwUYaJQL._AC_UF350,350_QL80_.jpg",
      rating: 4.7,
      reviews: 1601
    },
    {
      id: "p3",
      name: "Classmate Exercise Single Line Notebook",
      description: "172 Pages",
      price: 60,
      image: "https://www.bigbasket.com/media/uploads/p/l/40199255_3-classmate-single-line-long-notebook-30x18-cm-172-pages.jpg",
      rating: 4.2,
      reviews: 7717
    }
  ];

  useEffect(() => {
    parseCustomRange();
  }, [pageRangeType, customRange, totalPages]);

  // Calculate price whenever settings change
  useEffect(() => {
    calculatePrice();
  }, [calculatedPages, printType, printSide, copies, paperType, uniquePages]);

  const parseCustomRange = () => {
    if (pageRangeType === "all") {
      setCalculatedPages(totalPages);
      setUniquePages(Array.from({ length: totalPages }, (_, i) => i + 1));
      setRangeError(null);
      return;
    }
    
    if (!customRange) {
      setCalculatedPages(0);
      setUniquePages([]);
      setRangeError(null);
      return;
    }
    
    try {
      // Parse custom range (e.g., "1-3,5,7-9")
      const ranges = customRange.split(",");
      const selectedPages: number[] = [];
      let invalidRange = false;
      let outOfBoundsPage = 0;
      
      for (const range of ranges) {
        const trimmedRange = range.trim();
        if (trimmedRange.includes("-")) {
          const [startStr, endStr] = trimmedRange.split("-").map(num => num.trim());
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          
          if (!isNaN(start) && !isNaN(end) && start <= end && start > 0 && end <= totalPages) {
            for (let i = start; i <= end; i++) {
              selectedPages.push(i);
            }
          } else if (!isNaN(start) && !isNaN(end) && (start > totalPages || end > totalPages)) {
            invalidRange = true;
            outOfBoundsPage = Math.max(start, end);
            break;
          }
        } else {
          const pageNum = parseInt(trimmedRange);
          if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
            selectedPages.push(pageNum);
          } else if (!isNaN(pageNum) && pageNum > totalPages) {
            invalidRange = true;
            outOfBoundsPage = pageNum;
            break;
          }
        }
      }
      
      if (invalidRange) {
        setRangeError(`Page ${outOfBoundsPage} exceeds the total page count (${totalPages})`);
        setCalculatedPages(0);
        setUniquePages([]);
      } else {
        // Remove duplicates by converting to Set and back to array
        const uniqueSelectedPages = [...new Set(selectedPages)].sort((a, b) => a - b);
        setRangeError(null);
        setCalculatedPages(uniqueSelectedPages.length);
        setUniquePages(uniqueSelectedPages);
      }
    } catch (error) {
      console.error("Error parsing custom range", error);
      setRangeError("Invalid range format");
      setCalculatedPages(0);
      setUniquePages([]);
    }
  };

  const calculatePrice = () => {
    // If no pages selected, price is 0
    if (calculatedPages === 0) {
      setPrice(0);
      return;
    }
    
    let totalPrice = 0;
    
    if (printSide === "single") {
      // Simple calculation for single-sided
      const basePricePerPage = printType === "bw" ? 1.5 : 4;
      const priceWithPaperType = paperType === "standard" ? basePricePerPage : 
                               paperType === "premium" ? basePricePerPage + 0.5 : 
                               basePricePerPage + 1.0; // glossy
      
      totalPrice = calculatedPages * priceWithPaperType;
    } else {
      // Double-sided printing calculation
      if (printType === "bw") {
        // For black and white double-sided
        const fullSheets = Math.floor(calculatedPages / 2);
        const hasExtraPage = calculatedPages % 2 !== 0;
        
        // Full double-sided sheets at ₹2.5 each
        totalPrice = fullSheets * 2.5;
        
        // Add cost for extra single-sided page if needed
        if (hasExtraPage) {
          totalPrice += 1.5;
        }
        
        // Apply paper type adjustments
        if (paperType === "premium") {
          totalPrice += calculatedPages * 0.25; // Half the premium cost per side
        } else if (paperType === "glossy") {
          totalPrice += calculatedPages * 0.5; // Half the glossy cost per side
        }
      } else {
        // For color double-sided
        const fullSheets = Math.floor(calculatedPages / 2);
        const hasExtraPage = calculatedPages % 2 !== 0;
        
        // Full double-sided sheets at ₹8 each (updated from ₹4)
        totalPrice = fullSheets * 8;
        
        // Add cost for extra single-sided page if needed
        if (hasExtraPage) {
          totalPrice += 4;
        }
        
        // Apply paper type adjustments
        if (paperType === "premium") {
          totalPrice += calculatedPages * 0.25; // Half the premium cost per side
        } else if (paperType === "glossy") {
          totalPrice += calculatedPages * 0.5; // Half the glossy cost per side
        }
      }
    }
    
    // Multiply by copies
    totalPrice *= copies;
    
    setPrice(totalPrice);
  };

  const handleAddRelatedProduct = (product: RelatedProduct) => {
    // Create a cart item for the related product
    const productItem = {
      id: `rel-${product.id}-${Math.random().toString(36).substr(2, 9)}`,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      type: 'related-product'
    };
    
    // Get existing cart items
    const cartItems = JSON.parse(localStorage.getItem('printCart') || '[]');
    
    // Add new item to cart
    cartItems.push(productItem);
    
    // Update localStorage
    localStorage.setItem('printCart', JSON.stringify(cartItems));
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Product Added",
      description: `${product.name} added to cart`
    });
  };

  const handleAddToCart = () => {
    if (pageRangeType === "custom" && !customRange) {
      toast({
        variant: "destructive",
        title: "Invalid page range",
        description: "Please enter a valid page range"
      });
      return;
    }
    
    if (pageRangeType === "custom" && calculatedPages === 0) {
      toast({
        variant: "destructive",
        title: "Invalid page range",
        description: rangeError || "The page range you entered is invalid or out of bounds"
      });
      return;
    }
    
    // Add to cart
    const cartItem = {
      paperType,
      printType,
      printSide,
      copies,
      pageRange: pageRangeType === "all" ? "All Pages" : customRange,
      price,
      fileCount,
      totalPages: pageRangeType === "all" ? totalPages : calculatedPages,
      actualPages: calculatedPages,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    // Save print settings for checkout
    const printSettings = {
      totalPages: calculatedPages,
      printType: printType === "bw" ? "black_white" : "color",
      paperSize: "A4",
      paperType: paperType === "standard" ? "70gsm" : paperType === "premium" ? "90gsm" : "120gsm",
      sides: printSide,
      binding: "none",
      copies: copies
    };
    localStorage.setItem('printSettings', JSON.stringify(printSettings));
    
    // Save amplify files for checkout if they exist
    if (amplifyFiles && amplifyFiles.length > 0) {
      localStorage.setItem('amplifyFiles', JSON.stringify(amplifyFiles));
    }
    
    // Store cart items
    const cartItems = JSON.parse(localStorage.getItem('printCart') || '[]');
    cartItems.push(cartItem);
    localStorage.setItem('printCart', JSON.stringify(cartItems));
    
    toast({
      title: "Added to cart",
      description: `Your print job has been added to the cart (${cartItems.length} items)`
    });
    
    // Navigate to cart page after adding to cart
    setLocation("/cart");
  };

  const incrementCopies = () => {
    setCopies(prev => prev + 1);
  };

  const decrementCopies = () => {
    setCopies(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleSeeMoreLikeThis = () => {
    // For now, just navigate to a section of the homepage or show a toast
    // In a real app, this would navigate to a category page
    toast({
      title: "More Products",
      description: "Navigating to more products like these"
    });
    
    // Navigate to home page with a category query parameter
    navigate("/?category=stationery");
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i - rating < 1) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Print Settings</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Print Options</h2>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="paper-type">Paper Type</Label>
                      <Select
                        value={paperType}
                        onValueChange={setPaperType}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select paper type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (70 GSM)</SelectItem>
                          <SelectItem value="premium">Premium (90 GSM)</SelectItem>
                          <SelectItem value="glossy">Glossy (120 GSM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Print Type</Label>
                      <RadioGroup
                        value={printType}
                        onValueChange={setPrintType}
                        className="flex space-x-4 mt-1"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="bw" id="bw" />
                          <Label htmlFor="bw" className="ml-2">Black & White (₹1.5 Rs/page)</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="color" id="color" />
                          <Label htmlFor="color" className="ml-2">Color (₹4 Rs/page)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label>Printing Side</Label>
                      <RadioGroup
                        value={printSide}
                        onValueChange={setPrintSide}
                        className="flex space-x-4 mt-1"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single" className="ml-2">Single Sided</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="double" id="double" />
                          <Label htmlFor="double" className="ml-2">
                            Double Sided ({printType === "bw" ? "₹2.5 Rs/page" : "₹8 Rs/page"})
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Additional Options</h2>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label>Page Range</Label>
                      <RadioGroup
                        value={pageRangeType}
                        onValueChange={setPageRangeType}
                        className="space-y-2 mt-1"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="all" id="all-pages" />
                          <Label htmlFor="all-pages" className="ml-2">All Pages ({totalPages} pages)</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="custom" id="custom-range" />
                          <Label htmlFor="custom-range" className="ml-2">Custom Range</Label>
                        </div>
                      </RadioGroup>
                      
                      {pageRangeType === "custom" && (
                        <div className="mt-2">
                          <Input
                            placeholder="E.g. 1-5,8,11-13"
                            value={customRange}
                            onChange={(e) => setCustomRange(e.target.value)}
                            className={`mt-1 ${rangeError ? 'border-red-500' : ''}`}
                          />
                          <div className="flex justify-between items-center mt-1">
                            <div>
                              <p className="text-sm text-gray-500">
                                Enter page numbers and/or range with hyphens
                              </p>
                              {rangeError && (
                                <p className="text-sm text-red-500">{rangeError}</p>
                              )}
                            </div>
                            <p className="text-sm font-medium">
                              {calculatedPages} pages selected
                            </p>
                          </div>
                          {printSide === "double" && calculatedPages > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-md">
                              <p className="text-sm text-blue-700">
                                {Math.ceil(calculatedPages / 2)} physical {Math.ceil(calculatedPages / 2) === 1 ? 'sheet' : 'sheets'} needed 
                                {calculatedPages % 2 !== 0 && " (1 page single-sided)"}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label>Number of Copies</Label>
                      <div className="flex items-center mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={decrementCopies}
                          disabled={copies <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={copies}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              setCopies(value);
                            }
                          }}
                          className="w-20 mx-2 text-center"
                          min="1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={incrementCopies}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">Estimated Price:</p>
                      <p className="text-sm text-gray-500">
                        Final price based on {calculatedPages} page{calculatedPages !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <p className="text-2xl font-bold">₹{price.toFixed(2)} Rs</p>
                  </div>
                  
                  {price >= 99 && (
                    <div className="mt-4 p-2 bg-green-50 text-green-700 rounded-md text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      You qualify for FREE delivery!
                    </div>
                  )}
                  
                  {/* Replace the buttons grid with just one "Add to Cart" button that will navigate to cart */}
                  <div className="mt-6">
                    <Button 
                      onClick={handleAddToCart}
                      className="flex items-center justify-center w-full"
                      disabled={pageRangeType === "custom" && !!rangeError}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* You Might Also Like Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="w-full h-48 flex items-center justify-center mb-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">{product.description}</p>
                      <h3 className="font-semibold">{product.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-1">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews.toLocaleString()})</span>
                      </div>
                      <p className="font-bold mt-1">₹{product.price}</p>
                    </div>
                    <Button 
                      onClick={() => handleAddRelatedProduct(product)} 
                      variant="outline" 
                      className="w-full border-green-500 text-green-600 hover:bg-green-50"
                    >
                      ADD
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="ghost" className="text-green-600" onClick={handleSeeMoreLikeThis}>
                See more like this
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => navigate("/upload")}>
              Back
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrintSettings;
