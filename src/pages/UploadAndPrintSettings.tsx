
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload as UploadIcon, 
  FileText, 
  FileImage, 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus 
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface FileWithPages extends File {
  pageCount?: number;
}

interface RelatedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

const UploadAndPrintSettings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileWithPages[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCountingPages, setIsCountingPages] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [activeTab, setActiveTab] = useState("upload");

  // Print settings state
  const [paperType, setPaperType] = useState("standard");
  const [printType, setPrintType] = useState("bw");
  const [printSide, setPrintSide] = useState("single");
  const [copies, setCopies] = useState(1);
  const [pageRangeType, setPageRangeType] = useState("all");
  const [customRange, setCustomRange] = useState("");
  const [price, setPrice] = useState(0);
  const [calculatedPages, setCalculatedPages] = useState(0);
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

  // Upload functions
  const countPagesInFile = async (file: FileWithPages): Promise<number> => {
    return new Promise((resolve) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // For PDF files, we try to count pages
      if (extension === 'pdf') {
        const fileReader = new FileReader();
        fileReader.onload = function() {
          const typedArray = new Uint8Array(this.result as ArrayBuffer);
          
          // Simple page counting heuristic for PDF
          let text = '';
          for (let i = 0; i < typedArray.length; i++) {
            text += String.fromCharCode(typedArray[i]);
          }
          
          // Count pattern /Page objects in PDF
          const pagePattern = /\/Type[\s]*\/Page[^s]/g;
          const matches = text.match(pagePattern);
          const pageCount = matches ? matches.length : 1;
          
          resolve(pageCount);
        };
        fileReader.onerror = () => resolve(5); // Default if error
        fileReader.readAsArrayBuffer(file);
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
        // For images, count as 1 page
        resolve(1);
      } else {
        // For other documents like Word, etc., estimate based on size
        const sizeInKB = file.size / 1024;
        const estimatedPages = Math.max(1, Math.ceil(sizeInKB / 3));
        resolve(Math.min(estimatedPages, 20)); // Cap at 20 pages for estimation
      }
    });
  };

  const processFiles = async (newFiles: FileWithPages[]) => {
    setIsCountingPages(true);
    
    let pageCount = totalPageCount;
    const processedFiles = [...files];
    
    for (const file of newFiles) {
      try {
        const pages = await countPagesInFile(file);
        file.pageCount = pages;
        pageCount += pages;
        processedFiles.push(file);
      } catch (error) {
        console.error("Error counting pages:", error);
        file.pageCount = 5; // Default if error
        pageCount += 5;
        processedFiles.push(file);
      }
    }
    
    setFiles(processedFiles);
    setTotalPageCount(pageCount);
    setCalculatedPages(pageCount);
    setIsCountingPages(false);
    
    toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} uploaded successfully`);
    
    // Auto-switch to the print settings tab after files are processed
    setActiveTab("print-settings");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as FileWithPages[];
      processFiles(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files) as FileWithPages[];
      processFiles(newFiles);
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    const removedFile = updatedFiles[index];
    const pageCount = removedFile.pageCount || 0;
    
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    
    const newTotalPageCount = totalPageCount - pageCount;
    setTotalPageCount(newTotalPageCount);
    setCalculatedPages(newTotalPageCount);
    
    toast.info("File removed");
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    } else if (['pdf'].includes(extension || '')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  // Print settings functions
  React.useEffect(() => {
    parseCustomRange();
  }, [pageRangeType, customRange, totalPageCount]);

  // Calculate price whenever settings change
  React.useEffect(() => {
    calculatePrice();
  }, [calculatedPages, printType, printSide, copies, paperType, uniquePages]);

  const parseCustomRange = () => {
    if (pageRangeType === "all") {
      setCalculatedPages(totalPageCount);
      setUniquePages(Array.from({ length: totalPageCount }, (_, i) => i + 1));
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
          
          if (!isNaN(start) && !isNaN(end) && start <= end && start > 0 && end <= totalPageCount) {
            for (let i = start; i <= end; i++) {
              selectedPages.push(i);
            }
          } else if (!isNaN(start) && !isNaN(end) && (start > totalPageCount || end > totalPageCount)) {
            invalidRange = true;
            outOfBoundsPage = Math.max(start, end);
            break;
          }
        } else {
          const pageNum = parseInt(trimmedRange);
          if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPageCount) {
            selectedPages.push(pageNum);
          } else if (!isNaN(pageNum) && pageNum > totalPageCount) {
            invalidRange = true;
            outOfBoundsPage = pageNum;
            break;
          }
        }
      }
      
      if (invalidRange) {
        setRangeError(`Page ${outOfBoundsPage} exceeds the total page count (${totalPageCount})`);
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
        
        // Full double-sided sheets at ₹8 each
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
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      setActiveTab("upload");
      return;
    }
    
    if (pageRangeType === "custom" && !customRange) {
      toast.error("Please enter a valid page range");
      return;
    }
    
    if (pageRangeType === "custom" && calculatedPages === 0) {
      toast.error(rangeError || "The page range you entered is invalid or out of bounds");
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
      fileCount: files.length,
      totalPages: pageRangeType === "all" ? totalPageCount : calculatedPages,
      actualPages: calculatedPages,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    const cartItems = JSON.parse(localStorage.getItem('printCart') || '[]');
    cartItems.push(cartItem);
    localStorage.setItem('printCart', JSON.stringify(cartItems));
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success(`Your print job has been added to the cart (${cartItems.length} items)`);
    
    // Navigate to cart page after adding to cart
    navigate("/cart");
  };

  const incrementCopies = () => {
    setCopies(prev => prev + 1);
  };

  const decrementCopies = () => {
    setCopies(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleSeeMoreLikeThis = () => {
    toast.info("Navigating to more products like these");
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
          <h1 className="text-3xl font-bold mb-6">Upload & Print</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              <TabsTrigger value="print-settings" disabled={files.length === 0}>Print Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                      isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp"
                    />
                    
                    <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
                    <p className="text-gray-500 mb-4">
                      Support for PDF, Word, JPG, PNG and other image formats
                    </p>
                    <Button onClick={handleTriggerFileInput}>
                      Browse Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {isCountingPages && (
                <div className="text-center py-4">
                  <p className="text-blue-600">Analyzing files and counting pages...</p>
                </div>
              )}
              
              {files.length > 0 && (
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Uploaded Files ({files.length})</h3>
                      <div className="text-sm font-medium">
                        Total Pages: {totalPageCount}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            {getFileIcon(file)}
                            <div className="ml-3">
                              <p className="font-medium">{file.name}</p>
                              <div className="flex items-center space-x-4">
                                <p className="text-sm text-gray-500">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                                <p className="text-sm text-blue-600">
                                  {file.pageCount || "-"} pages
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={() => setActiveTab("print-settings")}
                        disabled={files.length === 0 || isCountingPages}
                        className="w-full"
                      >
                        Continue to Print Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="print-settings" className="mt-4">
              {files.length > 0 ? (
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
                                <Label htmlFor="all-pages" className="ml-2">All Pages ({totalPageCount} pages)</Label>
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
              ) : (
                <div className="text-center py-6">
                  <p className="text-lg text-gray-500">Please upload files first.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("upload")} 
                    className="mt-4"
                  >
                    Go to Upload
                  </Button>
                </div>
              )}
              
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
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadAndPrintSettings;
