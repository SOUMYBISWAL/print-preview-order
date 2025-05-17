import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { ShoppingCart, ArrowRight } from "lucide-react";

interface PrintSettingsProps {}

const PrintSettings: React.FC<PrintSettingsProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileCount = 1, totalPages = 5 } = location.state || {};

  const [paperType, setPaperType] = useState("standard");
  const [printType, setPrintType] = useState("bw");
  const [printSide, setPrintSide] = useState("single");
  const [copies, setCopies] = useState(1);
  const [pageRangeType, setPageRangeType] = useState("all");
  const [customRange, setCustomRange] = useState("");
  const [price, setPrice] = useState(0);
  const [calculatedPages, setCalculatedPages] = useState(totalPages);
  const [rangeError, setRangeError] = useState<string | null>(null);
  
  useEffect(() => {
    parseCustomRange();
  }, [pageRangeType, customRange, totalPages]);

  // Calculate price whenever settings change
  useEffect(() => {
    calculatePrice();
  }, [calculatedPages, printType, printSide, copies, paperType]);

  const parseCustomRange = () => {
    if (pageRangeType === "all") {
      setCalculatedPages(totalPages);
      setRangeError(null);
      return;
    }
    
    if (!customRange) {
      setCalculatedPages(0);
      setRangeError(null);
      return;
    }
    
    try {
      // Parse custom range (e.g., "1-3,5,7-9")
      const ranges = customRange.split(",");
      let pageCount = 0;
      let invalidRange = false;
      let outOfBoundsPage = 0;
      
      for (const range of ranges) {
        const trimmedRange = range.trim();
        if (trimmedRange.includes("-")) {
          const [startStr, endStr] = trimmedRange.split("-").map(num => num.trim());
          const start = parseInt(startStr);
          const end = parseInt(endStr);
          
          if (!isNaN(start) && !isNaN(end) && start <= end && start > 0 && end <= totalPages) {
            pageCount += (end - start + 1);
          } else if (!isNaN(start) && !isNaN(end) && (start > totalPages || end > totalPages)) {
            invalidRange = true;
            outOfBoundsPage = Math.max(start, end);
            break;
          }
        } else {
          const pageNum = parseInt(trimmedRange);
          if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
            pageCount += 1;
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
      } else {
        setRangeError(null);
        setCalculatedPages(pageCount);
      }
    } catch (error) {
      console.error("Error parsing custom range", error);
      setRangeError("Invalid range format");
      setCalculatedPages(0);
    }
  };

  const calculatePrice = () => {
    // Basic price per page for standard printing
    let basePricePerPage = printType === "bw" ? 1.5 : 4;
    
    // Paper type adjustments
    if (paperType === "premium") {
      basePricePerPage += 0.5;
    } else if (paperType === "glossy") {
      basePricePerPage += 1.0;
    }
    
    // Calculate effective pages (for billing)
    let effectivePages = calculatedPages;
    
    // For double-sided printing, charge based on print type
    if (printSide === "double") {
      if (printType === "bw") {
        // Black & white double-sided price: ₹2.5 per page
        basePricePerPage = 2.5;
      } else {
        // Color double-sided price: ₹8 per page
        basePricePerPage = 8;
      }
    }
    
    // Multiply by copies
    effectivePages *= copies;
    
    // Calculate subtotal
    const subtotal = effectivePages * basePricePerPage;
    
    setPrice(subtotal);
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
    // In a real app, you would store this in localStorage or a state management system
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
    
    // For simplicity, we'll just store the latest cart item in localStorage
    const cartItems = JSON.parse(localStorage.getItem('printCart') || '[]');
    cartItems.push(cartItem);
    localStorage.setItem('printCart', JSON.stringify(cartItems));
    
    toast({
      title: "Added to cart",
      description: `Your print job has been added to the cart (${cartItems.length} items)`
    });
  };

  const handleContinue = () => {
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
    
    toast({
      title: "Print settings saved",
      description: "Your print settings have been saved successfully"
    });
    
    navigate("/checkout", {
      state: {
        paperType,
        printType,
        printSide,
        copies,
        pageRange: pageRangeType === "all" ? "All Pages" : customRange,
        price,
        fileCount,
        totalPages: pageRangeType === "all" ? totalPages : calculatedPages,
        actualPages: calculatedPages
      }
    });
  };

  const incrementCopies = () => {
    setCopies(prev => prev + 1);
  };

  const decrementCopies = () => {
    setCopies(prev => (prev > 1 ? prev - 1 : 1));
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
                          <Label htmlFor="bw" className="ml-2">Black & White</Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="color" id="color" />
                          <Label htmlFor="color" className="ml-2">Color</Label>
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
                          <Label htmlFor="double" className="ml-2">Double Sided (₹2.5/page)</Label>
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
                          -
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
                          +
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
                    <p className="text-2xl font-bold">₹{price.toFixed(2)}</p>
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
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <Button 
                      onClick={handleAddToCart}
                      variant="outline"
                      className="flex items-center justify-center"
                      disabled={pageRangeType === "custom" && !!rangeError}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                    
                    <Button 
                      onClick={handleContinue}
                      className="flex items-center justify-center"
                      disabled={pageRangeType === "custom" && !!rangeError}
                    >
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
