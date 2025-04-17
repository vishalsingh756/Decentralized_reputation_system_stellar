
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { getIdentityVerificationStatus } from "@/utils/walletUtils";
import { Badge } from "@/components/ui/badge";

const Verification = () => {
  const { isWalletConnected, publicKey } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  // Get verification status for the connected wallet
  const verificationStatus = publicKey 
    ? getIdentityVerificationStatus(publicKey) 
    : 'none';
  
  const handleVerify = () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed with verification",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Verification submitted",
        description: "Your verification request has been submitted. 3 XLM fee has been charged.",
      });
      
      // Refresh the page after 2 seconds to show "pending" status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <section>
            <h1 className="text-3xl font-bold tracking-tight mb-3">Verification Center</h1>
            <p className="text-muted-foreground mb-6">
              Verify your identity on the Stellar blockchain to access premium features
            </p>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Identity Verification</CardTitle>
                <CardDescription>
                  Verify your Stellar identity to increase your trust score and access premium features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isWalletConnected ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                    <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-yellow-800">Wallet Not Connected</h3>
                      <p className="text-sm text-yellow-600">Connect your wallet to continue with verification</p>
                    </div>
                  </div>
                ) : verificationStatus === 'verified' ? (
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
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Verification Process</h3>
                      <ol className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge className="h-5 w-5 flex items-center justify-center text-white">1</Badge>
                          <span>Connect your Stellar wallet</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="h-5 w-5 flex items-center justify-center text-white">2</Badge>
                          <span>Pay the 3 XLM verification fee</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="h-5 w-5 flex items-center justify-center text-white">3</Badge>
                          <span>Our system will verify your identity</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="h-5 w-5 flex items-center justify-center text-white">4</Badge>
                          <span>Verification badge added to your profile</span>
                        </li>
                      </ol>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleVerify}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Verify Identity (3 XLM)
                        </span>
                      )}
                    </Button>
                  </>
                )}
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Benefits of verification:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Access to full reputation data</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Higher trust score and reputation</span>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Verification FAQ</CardTitle>
                <CardDescription>
                  Common questions about our verification process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-1">Why verify my identity?</h3>
                  <p className="text-sm text-muted-foreground">
                    Verification increases your trustworthiness on the platform, allowing you to access premium features and higher transaction limits.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">What is the verification fee?</h3>
                  <p className="text-sm text-muted-foreground">
                    The one-time verification fee is 3 XLM. This covers the cost of processing your verification and helps prevent spam.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">How long does verification take?</h3>
                  <p className="text-sm text-muted-foreground">
                    Most verifications are processed within 24-48 hours. You'll receive a notification once your verification is complete.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">What information is required?</h3>
                  <p className="text-sm text-muted-foreground">
                    Verification is done through your blockchain transaction history. No personal information beyond your Stellar address is required.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Is verification permanent?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, once verified your status remains unless suspicious activity is detected on your account.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  <p>Need help? Contact our support team at support@stellartrust.com</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Verification;
