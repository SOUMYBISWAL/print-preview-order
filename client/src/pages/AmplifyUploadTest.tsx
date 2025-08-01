import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmplifyFileUploader from "@/components/AmplifyFileUploader";

const AmplifyUploadTest = () => {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ key: string; name: string; size: number; type: string; pages: number }>>([]);
  const [totalPageCount, setTotalPageCount] = useState(0);

  const handleFilesUploaded = (files: Array<{ key: string; name: string; size: number; type: string; pages: number }>) => {
    setUploadedFiles(files);
    const totalPages = files.reduce((sum, file) => sum + file.pages, 0);
    setTotalPageCount(totalPages);
    
    toast.success(`Successfully uploaded ${files.length} file(s) to AWS S3!`);
    console.log('Files uploaded to S3:', files);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">AWS S3 File Upload Test</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Test AWS Amplify S3 Storage Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This page tests the AWS Amplify S3 storage integration. Files uploaded here will be stored directly in your AWS S3 bucket.
              </p>
              
              {/* AWS Amplify File Uploader */}
              <AmplifyFileUploader
                onFilesUploaded={handleFilesUploaded}
                maxFileCount={5}
                acceptedFileTypes={[
                  'application/pdf',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'image/*',
                  'text/plain'
                ]}
              />
            </CardContent>
          </Card>

          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Files:</span>
                    <span className="font-bold">{uploadedFiles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Pages:</span>
                    <span className="font-bold">{totalPageCount}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={file.key} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-gray-500">
                              {file.type} • {Math.round(file.size / 1024)} KB • {file.pages} pages
                            </div>
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            Stored in S3
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AmplifyUploadTest;