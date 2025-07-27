import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUploader from "@/components/FileUploader";

const Upload = () => {
  const [, setLocation] = useLocation();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ key: string; name: string; size: number; type: string }>>([]);
  const [totalPageCount, setTotalPageCount] = useState(0);

  const handleFilesUploaded = (files: Array<{ key: string; name: string; size: number; type: string }>) => {
    setUploadedFiles(files);
    // Calculate total pages for pricing (simplified - each file counts as 1 page)
    const totalPages = files.length;
    setTotalPageCount(totalPages);
  };

  const handleProceedToPrint = () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    // Store file information in localStorage for the print settings page
    const fileData = uploadedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      key: file.key,
      pages: 1 // Default page count for uploaded files
    }));
    
    localStorage.setItem('uploadedFiles', JSON.stringify(fileData));
    localStorage.setItem('totalPages', totalPageCount.toString());

    // Navigate to print settings
    toast.success("Files ready for printing");
    setLocation("/print-settings");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Upload Your Files</h1>
          
          {/* File Upload Component */}
          <FileUploader
            onFilesUploaded={handleFilesUploaded}
            maxFileCount={10}
            acceptedFileTypes={[
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'image/*',
              'text/plain'
            ]}
          />

          {uploadedFiles.length > 0 && (
            <Card className="mb-6 mt-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="text-lg font-bold text-green-600">
                    Ready to Print! (Total Pages: {totalPageCount})
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleProceedToPrint}
                  size="lg"
                >
                  Configure Print Settings & Continue
                </Button>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setLocation("/")}>
              Cancel
            </Button>
            <Button onClick={handleProceedToPrint} disabled={uploadedFiles.length === 0}>
              Continue to Print Settings
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;