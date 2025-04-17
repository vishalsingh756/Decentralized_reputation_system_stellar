
import { Navbar } from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { WalletConnection } from "@/components/reputation/WalletConnection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  TrendingUp, 
  Award, 
  Clock, 
  AlertTriangle, 
  Send,
  Download,
  Upload,
  RefreshCw,
  Search
} from "lucide-react";
import { getTrustScoreColor, getTrustScoreLabel, WalletInfo, queryReputationData } from "@/utils/walletUtils";
import { UserFeedback } from "@/components/reputation/UserFeedback";
import { IdentityVerification } from "@/components/reputation/IdentityVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { isWalletConnected, publicKey, trustScore } = useWallet();
  const [walletDetails, setWalletDetails] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const fetchReputationData = async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    try {
      const data = await queryReputationData(publicKey);
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
    if (isWalletConnected && publicKey) {
      fetchReputationData();
    } else {
      setWalletDetails(null);
    }
  }, [isWalletConnected, publicKey]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-3">Your Wallet Profile</h1>
              <p className="text-muted-foreground mb-6">
                Manage your wallet and view your trust score on the Stellar blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <WalletConnection />
                {isWalletConnected && publicKey && (
                  <Button 
                    variant="outline" 
                    onClick={fetchReputationData}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? "Fetching..." : "Refresh Data"}
                  </Button>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-r from-reputation-600/20 to-blue-500/20 p-8 rounded-lg flex items-center justify-center">
              <div className="text-center">
                {isWalletConnected && walletDetails ? (
                  <>
                    <div className={`text-5xl font-bold mb-2 ${getTrustScoreColor(walletDetails.trustScore)}`}>
                      {walletDetails.trustScore}
                    </div>
                    <div className="text-muted-foreground">
                      Trust Score - {getTrustScoreLabel(walletDetails.trustScore)}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Verified on Stellar Network</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle className="h-10 w-10 text-yellow-500" />
                    <div className="text-lg font-medium">Connect your wallet to view your Trust Score</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {isWalletConnected && walletDetails && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Wallet Balance
                    </CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,245 XLM</div>
                    <p className="text-xs text-muted-foreground">
                      + 3 other assets
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="text-xs flex items-center gap-1">
                        <Send className="h-3 w-3" /> Send
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs flex items-center gap-1">
                        <Download className="h-3 w-3" /> Receive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Contract Activity
                    </CardTitle>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{walletDetails.totalLeases} Contracts</div>
                    <p className="text-xs text-muted-foreground">
                      Success rate: {walletDetails.totalLeases > 0 
                        ? Math.round((walletDetails.successfulReturns / walletDetails.totalLeases) * 100)
                        : 0}%
                    </p>
                    <Button size="sm" variant="outline" className="text-xs flex items-center gap-1 mt-3">
                      <RefreshCw className="h-3 w-3" /> View Activity
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Trust Network
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">15 Connections</div>
                    <p className="text-xs text-muted-foreground">
                      Avg. trust score: 78
                    </p>
                    <Button size="sm" variant="outline" className="text-xs flex items-center gap-1 mt-3">
                      <Shield className="h-3 w-3" /> Manage Network
                    </Button>
                  </CardContent>
                </Card>
              </section>

              <Tabs defaultValue="feedback" className="mt-6">
                <TabsList className="grid grid-cols-3 w-[400px]">
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="identity">Identity</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="feedback" className="mt-6">
                  <UserFeedback 
                    address={publicKey} 
                    reviews={walletDetails.reviews} 
                    refreshData={fetchReputationData}
                  />
                </TabsContent>
                
                <TabsContent value="identity" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <IdentityVerification address={publicKey} />
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Reputation Ledger</CardTitle>
                        <CardDescription>Your on-chain reputation record</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Address:</span>
                            <span className="font-mono">{publicKey.slice(0, 10)}...{publicKey.slice(-6)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Trust Score:</span>
                            <span className={getTrustScoreColor(walletDetails.trustScore)}>{walletDetails.trustScore}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Reviews:</span>
                            <span>{walletDetails.reviews.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Contracts:</span>
                            <span>{walletDetails.totalLeases}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Success Rate:</span>
                            <span className="text-green-500">
                              {walletDetails.totalLeases > 0 
                                ? Math.round((walletDetails.successfulReturns / walletDetails.totalLeases) * 100)
                                : 0}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button variant="outline" className="w-full flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            View on Stellar Explorer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="transactions" className="mt-6">
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 p-3 text-sm grid grid-cols-4">
                        <div>Type</div>
                        <div>Asset</div>
                        <div>Date</div>
                        <div>Status</div>
                      </div>
                      <div className="divide-y">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-3 grid grid-cols-4 text-sm hover:bg-muted/20">
                            <div>Transaction #{i}</div>
                            <div>XLM</div>
                            <div>{new Date(Date.now() - i * 86400000).toLocaleDateString()}</div>
                            <div className="font-medium text-green-600">Completed</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </TabsContent>
              </Tabs>
            </>
          )}

          {!isWalletConnected && (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg mt-6">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="font-medium text-lg mb-2">No Wallet Connected</h3>
              <p className="text-muted-foreground text-center mb-4">
                Connect your Stellar wallet to view your profile and trust data
              </p>
              <WalletConnection />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
