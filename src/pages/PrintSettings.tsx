
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
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  // Calculate price whenever settings change
  useEffect(() => {
    calculatePrice();
  }, [paperType, printType, printSide, copies, pageRangeType, customRange, totalPages]);

  const calculatePrice = () => {
    // Basic price per page
    const basePricePerPage = printType === "bw" ? 1.5 : 4;
    
    // Calculate number of pages to print
    let pagesToPrint = totalPages;
    
    if (pageRangeType === "custom" && customRange) {
      try {
        // Parse custom range (e.g., "1-3,5,7-9")
        const ranges = customRange.split(",");
        pagesToPrint = 0;
        
        for (const range of ranges) {
          if (range.includes("-")) {
            const [start, end] = range.split("-").map(num => parseInt(num.trim()));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
              pagesToPrint += (end - start + 1);
            }
          } else {
            const pageNum = parseInt(range.trim());
            if (!isNaN(pageNum)) {
              pagesToPrint += 1;
            }
          }
        }
      } catch (error) {
        console.error("Error parsing custom range", error);
      }
    }
    
    // Double the pages if double-sided (as we count per printed side)
    if (printSide === "double") {
      pagesToPrint = Math.ceil(pagesToPrint / 2);
    }
    
    // Multiply by copies
    pagesToPrint *= copies;
    
    // Calculate subtotal
    let subtotal = pagesToPrint * basePricePerPage;
    
    // Apply paper type markup if needed (currently no markup in the requirements)
    
    setPrice(subtotal);
  };

  const handleContinue = () => {
    if (pageRangeType === "custom" && !customRange) {
      toast.error("Please enter a custom page range");
      return;
    }
    
    toast.success("Print settings saved");
    navigate("/checkout", {
      state: {
        paperType,
        printType,
        printSide,
        copies,
        pageRange: pageRangeType === "all" ? "All Pages" : customRange,
        price,
        fileCount,
        totalPages
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
                          <Label htmlFor="double" className="ml-2">Double Sided</Label>
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
                          <Label htmlFor="all-pages" className="ml-2">All Pages</Label>
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
                            className="mt-1"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Enter page numbers and/or range with hyphens (e.g. 1-3,5,7-9)
                          </p>
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
                        Final price may vary based on actual page count
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
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => navigate("/upload")}>
              Back
            </Button>
            <Button onClick={handleContinue}>
              Continue to Checkout
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrintSettings;
