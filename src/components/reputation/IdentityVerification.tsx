
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check, Clock, AlertTriangle } from "lucide-react";
import { getIdentityVerificationStatus } from "@/utils/walletUtils";
import { useToast } from "@/hooks/use-toast";

interface IdentityVerificationProps {
  address: string;
}

export function IdentityVerification({ address }: IdentityVerificationProps) {
  const verificationStatus = getIdentityVerificationStatus(address);
  const { toast } = useToast();
  
  const handleVerifyClick = () => {
    toast({
      title: "Verification in progress",
      description: "Your identity verification request has been submitted. This process may take 1-2 business days.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>
          Verify your Stellar identity to increase your trust score and access more features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {verificationStatus === 'verified' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Verified</h3>
              <p className="text-sm text-green-600">Your identity has been verified on the Stellar network</p>
            </div>
          </div>
        ) : verificationStatus === 'pending' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium text-yellow-800">Verification in Progress</h3>
              <p className="text-sm text-yellow-600">Your verification is being processed</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium">Not Verified</h3>
                <p className="text-sm text-muted-foreground">Verify your identity to increase your trust score</p>
              </div>
            </div>
            <Button className="w-full" onClick={handleVerifyClick}>
              <Shield className="mr-2 h-4 w-4" />
              Verify Identity
            </Button>
          </>
        )}
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Benefits of verification:</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Higher trust score and reputation</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Access to premium features</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Higher transaction limits</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Priority dispute resolution</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
