
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, AlertCircle, Shield, Loader2 } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { isConnected } from "@stellar/freighter-api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { processStellarPayment, checkAccountExists, PLATFORM_FEE_ADDRESS } from "@/utils/stellarUtils";

export function ReviewLookup() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isWalletConnected, publicKey } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateAddress = async (stellarAddress: string): Promise<boolean> => {
    if (!stellarAddress) {
      toast({
        title: "Address required",
        description: "Please enter a Stellar address to search",
        variant: "destructive",
      });
      return false;
    }

    if (!stellarAddress.startsWith("G") || stellarAddress.length !== 56) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Stellar address",
        variant: "destructive",
      });
      return false;
    }

    setIsChecking(true);
    try {
      // Check if the account exists on the Stellar network
      const exists = await checkAccountExists(stellarAddress);
      if (!exists) {
        toast({
          title: "Account not found",
          description: "This Stellar address does not exist on the testnet network",
          variant: "destructive",
        });
        setError("Account not found on the Stellar testnet network. Please enter a valid testnet account address.");
        return false;
      }
      setError(null);
      return true;
    } catch (error) {
      console.error("Error checking account:", error);
      setError("Error verifying account. Please try again.");
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleLookup = async () => {
    if (!isWalletConnected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Stellar wallet first",
        variant: "destructive",
      });
      return;
    }

    // Validate the address format and existence
    const isValid = await validateAddress(address);
    if (!isValid) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Check if Freighter is available
      const freighterConnected = await isConnected();
      if (!freighterConnected.isConnected) {
        throw new Error("Freighter wallet is not connected");
      }
      
      // Process payment to the platform fee address
      // The payment goes directly to the fee address, not the lookup address
      const txHash = await processStellarPayment(publicKey, null, 0.5);
      console.log("Transaction completed with hash:", txHash);

      // Store the address in recent searches
      const recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      if (!recentSearches.includes(address)) {
        const updatedSearches = [address, ...recentSearches].slice(0, 5);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      }
      
      // Add to paid views for the RepScore component
      const paidViews = JSON.parse(localStorage.getItem("paidViews") || "[]");
      if (!paidViews.includes(address)) {
        const updatedViews = [address, ...paidViews];
        localStorage.setItem("paidViews", JSON.stringify(updatedViews));
      }
      
      // Navigate to reputation page
      navigate(`/reputation/${address}`);
      
      // Show success toast
      toast({
        title: "Transaction completed",
        description: `0.5 XLM has been sent to the platform for this lookup. Transaction ID: ${txHash.substring(0, 8)}...`,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      let errorMessage = "Failed to process payment. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Transaction failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reputation Lookup</CardTitle>
        <CardDescription>
          Check the trust score and feedback for any Stellar address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Enter Stellar address (G...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              A fee of 0.5 XLM will be deducted from your wallet for each lookup
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleLookup} 
            className="w-full"
            disabled={!isWalletConnected || isLoading || isChecking}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing transaction...
              </span>
            ) : isChecking ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Lookup Reputation
              </span>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t pt-4">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-reputation-600" />
          <span>Connect your wallet to search any Stellar address</span>
        </div>
      </CardFooter>
    </Card>
  );
}
