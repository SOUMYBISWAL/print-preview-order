import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface ConnectionStatusProps {
  onTestComplete?: (success: boolean) => void;
}

export function ConnectionStatus({ onTestComplete }: ConnectionStatusProps) {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const testAmplifyConnection = async () => {
    setStatus('testing');
    setMessage('Checking AWS credentials...');

    try {
      // Test if Amplify is properly configured
      const { Amplify } = await import('aws-amplify');
      const config = Amplify.getConfig();
      
      if (config?.Auth?.Cognito) {
        setStatus('success');
        setMessage('AWS Amplify is properly configured');
        onTestComplete?.(true);
      } else {
        setStatus('error');
        setMessage('Amplify configuration incomplete');
        onTestComplete?.(false);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Connection test failed');
      onTestComplete?.(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'testing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Not tested</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">AWS Connection Status</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Test your AWS Amplify configuration and credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        )}
        
        <Button 
          onClick={testAmplifyConnection}
          disabled={status === 'testing'}
          className="w-full"
          data-testid="button-test-connection"
        >
          {status === 'testing' ? 'Testing Connection...' : 'Test AWS Connection'}
        </Button>
      </CardContent>
    </Card>
  );
}