
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Printer, Check, X } from 'lucide-react';
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";

interface UploadedFile {
  file: File;
  preview: string;
  pages: number;
  id: string;
}

const UploadAndPrintSettings = () => {
  const [, setLocation] = useLocation();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [printSettings, setPrintSettings] = useState({
    colorType: 'black-white',
    paperSize: 'A4',
    orientation: 'portrait',
    copies: 1,
    doubleSided: false,
    binding: 'none',
    paperQuality: 'standard'
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      pages: Math.floor(Math.random() * 20) + 1, // Mock page count
      id: Math.random().toString(36).substr(2, 9)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const calculateTotal = () => {
    const totalPages = uploadedFiles.reduce((sum, file) => sum + file.pages, 0);
    const pricePerPage = printSettings.colorType === 'color' ? 4.00 : 1.50;
    const multiplier = printSettings.doubleSided ? 0.5 : 1;
    const qualityExtra = printSettings.paperQuality === 'premium' ? 0.50 : 0;
    
    return (totalPages * pricePerPage * multiplier * printSettings.copies) + (totalPages * qualityExtra);
  };

  const handleProceedToCheckout = () => {
    if (uploadedFiles.length === 0) return;
    
    const orderData = {
      files: uploadedFiles,
      settings: printSettings,
      total: calculateTotal()
    };
    
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    setLocation('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Upload & Print Settings</h1>
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              <TabsTrigger value="settings">Print Settings</TabsTrigger>
              <TabsTrigger value="review">Review & Order</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    {isDragActive ? (
                      <p className="text-lg">Drop the files here...</p>
                    ) : (
                      <>
                        <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                        <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX, TXT files</p>
                      </>
                    )}
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h3 className="font-semibold">Uploaded Files:</h3>
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">{file.file.name}</p>
                              <p className="text-sm text-gray-500">{file.pages} pages</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Print Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="colorType">Print Type</Label>
                      <Select value={printSettings.colorType} onValueChange={(value) => setPrintSettings(prev => ({ ...prev, colorType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select print type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="black-white">Black & White (₹1.50/page)</SelectItem>
                          <SelectItem value="color">Color (₹4.00/page)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paperSize">Paper Size</Label>
                      <Select value={printSettings.paperSize} onValueChange={(value) => setPrintSettings(prev => ({ ...prev, paperSize: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select paper size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4">A4</SelectItem>
                          <SelectItem value="A3">A3</SelectItem>
                          <SelectItem value="Letter">Letter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orientation">Orientation</Label>
                      <Select value={printSettings.orientation} onValueChange={(value) => setPrintSettings(prev => ({ ...prev, orientation: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select orientation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">Portrait</SelectItem>
                          <SelectItem value="landscape">Landscape</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="copies">Number of Copies</Label>
                      <Input
                        type="number"
                        min="1"
                        value={printSettings.copies}
                        onChange={(e) => setPrintSettings(prev => ({ ...prev, copies: parseInt(e.target.value) || 1 }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paperQuality">Paper Quality</Label>
                      <Select value={printSettings.paperQuality} onValueChange={(value) => setPrintSettings(prev => ({ ...prev, paperQuality: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select paper quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium (+₹0.50/page)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="binding">Binding</Label>
                      <Select value={printSettings.binding} onValueChange={(value) => setPrintSettings(prev => ({ ...prev, binding: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select binding" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Binding</SelectItem>
                          <SelectItem value="spiral">Spiral Binding</SelectItem>
                          <SelectItem value="staple">Staple Binding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="doubleSided"
                      checked={printSettings.doubleSided}
                      onChange={(e) => setPrintSettings(prev => ({ ...prev, doubleSided: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="doubleSided">Double-sided printing (saves paper)</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Files to Print:</h3>
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex justify-between items-center py-2">
                          <span>{file.file.name}</span>
                          <Badge variant="secondary">{file.pages} pages</Badge>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Print Settings:</h3>
                      <div className="space-y-1 text-sm">
                        <p>Type: {printSettings.colorType === 'color' ? 'Color' : 'Black & White'}</p>
                        <p>Paper: {printSettings.paperSize} - {printSettings.paperQuality}</p>
                        <p>Orientation: {printSettings.orientation}</p>
                        <p>Copies: {printSettings.copies}</p>
                        <p>Double-sided: {printSettings.doubleSided ? 'Yes' : 'No'}</p>
                        <p>Binding: {printSettings.binding}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleProceedToCheckout}
                      className="w-full"
                      disabled={uploadedFiles.length === 0}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Proceed to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UploadAndPrintSettings;
