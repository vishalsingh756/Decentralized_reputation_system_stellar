
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { queryReputationData, WalletInfo, getTrustScoreColor, getTrustScoreLabel, getIdentityVerificationStatus } from "@/utils/walletUtils";
import { UserFeedback } from "@/components/reputation/UserFeedback";
import { ChevronLeft, Search, AlertTriangle, Shield, RefreshCw, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { processStellarPayment, PLATFORM_FEE_ADDRESS } from "@/utils/stellarUtils";

const RepScore = () => {
  const { address } = useParams<{ address: string }>();
  const [walletDetails, setWalletDetails] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [hasViewPaid, setHasViewPaid] = useState(false);
  const { toast } = useToast();
  const { isWalletConnected, publicKey } = useWallet();
  
  // Check if current user is verified
  const isUserVerified = publicKey ? 
    getIdentityVerificationStatus(publicKey) === 'verified' : false;

  const fetchReputationData = async (forceRefresh = false) => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const data = await queryReputationData(address);
      setWalletDetails(data);
    } catch (error) {
      console.error("Error fetching reputation data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reputation data from Stellar network",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (address) {
      // Check if we've already paid for this address in this session
      const paidViews = JSON.parse(localStorage.getItem("paidViews") || "[]");
      if (paidViews.includes(address)) {
        setHasViewPaid(true);
        fetchReputationData();
      }
    }
  }, [address]);
  
  const handleViewReputation = async () => {
    if (!isWalletConnected || !publicKey || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Stellar wallet first",
        variant: "destructive",
      });
      return;
    }
    
    setIsPaying(true);
    try {
      // Process 0.5 XLM payment to the platform fee address, not the viewed address
      const txHash = await processStellarPayment(publicKey, null, 0.5);
      
      // Save address to paid views
      const paidViews = JSON.parse(localStorage.getItem("paidViews") || "[]");
      if (!paidViews.includes(address)) {
        const updatedViews = [address, ...paidViews];
        localStorage.setItem("paidViews", JSON.stringify(updatedViews));
      }
      
      setHasViewPaid(true);
      
      // Now fetch the reputation data
      await fetchReputationData(true);
      
      toast({
        title: "Payment successful",
        description: `0.5 XLM payment processed. Transaction: ${txHash.substring(0, 8)}...`,
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsPaying(false);
    }
  };
  
  if (!address) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="container mx-auto py-20 px-4 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-3xl font-bold mb-4">No Address Provided</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Please provide a Stellar address to view their reputation score.
          </p>
          <Link to="/dashboard">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </Link>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link to="/dashboard">
              <Button variant="ghost" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            
            {hasViewPaid && (
              <Button
                variant="outline"
                onClick={() => fetchReputationData(true)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            )}
          </div>
          
          {!isWalletConnected && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <p className="text-yellow-800">Connect your wallet to view reputation data</p>
                <Link to="/dashboard" className="ml-auto">
                  <Button size="sm" variant="outline">Connect Wallet</Button>
                </Link>
              </CardContent>
            </Card>
          )}
          
          {!hasViewPaid && isWalletConnected && (
            <Card className="bg-muted/20 border">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Shield className="h-12 w-12 mx-auto text-primary/60" />
                  <h3 className="text-xl font-semibold">View Reputation Score</h3>
                  <p className="text-muted-foreground">
                    View detailed reputation data for address:
                    <br />
                    <span className="font-mono">{address.slice(0, 10)}...{address.slice(-4)}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    A fee of 0.5 XLM will be deducted from your wallet
                  </p>
                  <Button 
                    onClick={handleViewReputation} 
                    disabled={isPaying}
                    className="w-full mt-4"
                  >
                    {isPaying ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processing payment...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Pay 0.5 XLM to view
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {hasViewPaid && (
            <section className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl">Reputation Score</CardTitle>
                      <CardDescription>
                        View the trust score for address: <span className="font-mono">{address.slice(0, 10)}...{address.slice(-4)}</span>
                      </CardDescription>
                    </div>
                    {getIdentityVerificationStatus(address) === 'verified' && (
                      <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        <Shield className="h-3 w-3" />
                        Verified
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-48 flex items-center justify-center">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Fetching on-chain reputation data...</p>
                      </div>
                    </div>
                  ) : walletDetails ? (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="h-32 w-32 rounded-full flex items-center justify-center bg-gradient-to-br from-reputation-600/20 to-innovation-600/20 border-4 border-background shadow-lg">
                          <div className={`text-4xl font-bold ${getTrustScoreColor(walletDetails.trustScore)}`}>
                            {walletDetails.trustScore}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-xl font-bold">{getTrustScoreLabel(walletDetails.trustScore)}</h3>
                        <p className="text-muted-foreground">Trust Score</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-xl font-bold">{walletDetails.totalLeases}</div>
                          <div className="text-xs text-muted-foreground">Total Contracts</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-xl font-bold text-green-500">{walletDetails.successfulReturns}</div>
                          <div className="text-xs text-muted-foreground">Successful Returns</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-xl font-bold text-red-500">{walletDetails.failedReturns}</div>
                          <div className="text-xs text-muted-foreground">Failed Returns</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="text-xl font-bold text-yellow-500">{walletDetails.disputesRaised}</div>
                          <div className="text-xs text-muted-foreground">Disputes</div>
                        </div>
                      </div>
                      
                      <Button className="w-full flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4" />
                        Verify On-Chain
                      </Button>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center">
                      <div className="text-center">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-yellow-500" />
                        <p className="text-muted-foreground">Could not load reputation data for this address</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>On-Chain Activity</CardTitle>
                    <CardDescription>
                      Reputation data from the Stellar blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isWalletConnected ? (
                      <div className="text-center py-6">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <p className="mb-4">Connect your wallet to view data</p>
                        <Link to="/dashboard">
                          <Button size="sm">Connect Wallet</Button>
                        </Link>
                      </div>
                    ) : !isUserVerified ? (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Address:</span>
                          <span className="font-mono">{address.slice(0, 10)}...{address.slice(-6)}</span>
                        </div>
                        
                        {walletDetails && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">First Seen:</span>
                              <span>April 2024</span>
                            </div>
                            
                            <div className="border-t border-dashed pt-4 mt-4">
                              <div className="bg-gray-50 p-3 rounded-lg text-center">
                                <div className="flex justify-center mb-2">
                                  <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <h3 className="font-medium mb-1">Detailed data requires verification</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Verify your account to access detailed reputation data
                                </p>
                                <Link to="/verification">
                                  <Button variant="outline" size="sm" className="w-full">
                                    Get Verified
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                        
                        <a 
                          href={`https://stellar.expert/explorer/public/account/${address}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="block mt-4"
                        >
                          <Button variant="outline" className="w-full flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            View on Stellar Explorer
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Address:</span>
                          <span className="font-mono">{address.slice(0, 10)}...{address.slice(-6)}</span>
                        </div>
                        
                        {walletDetails && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">First Seen:</span>
                              <span>April 2024</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Success Rate:</span>
                              <span className="text-green-500">
                                {walletDetails.totalLeases > 0 
                                  ? Math.round((walletDetails.successfulReturns / walletDetails.totalLeases) * 100)
                                  : 0}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Review Count:</span>
                              <span>{walletDetails.reviews.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Trust Network:</span>
                              <span>{Math.floor(Math.random() * 10) + 5} connections</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Verification:</span>
                              <span>{getIdentityVerificationStatus(address) === 'verified' ? 
                                '✅ Verified' : '❌ Not Verified'}</span>
                            </div>
                          </>
                        )}
                        
                        <a 
                          href={`https://stellar.expert/explorer/public/account/${address}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="block mt-4"
                        >
                          <Button variant="outline" className="w-full flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            View on Stellar Explorer
                          </Button>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {isWalletConnected && isUserVerified && walletDetails && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Trust Network</CardTitle>
                      <CardDescription>
                        Connected addresses in the trust network
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-2 border rounded hover:bg-muted/20">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-mono">G{Array(10).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}...</span>
                            </div>
                            <div className="text-xs bg-muted px-2 py-1 rounded-full">
                              Trust: {Math.floor(Math.random() * 40) + 60}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          )}
          
          {walletDetails && hasViewPaid && (
            <section className="mt-4">
              <UserFeedback 
                address={address} 
                reviews={walletDetails.reviews} 
                refreshData={fetchReputationData}
                isVerified={isUserVerified}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default RepScore;
