import { Navbar } from "@/components/layout/Navbar";
import { WalletConnection } from "@/components/reputation/WalletConnection";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Award, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { GiveReputation } from "@/components/reputation/GiveReputation";
import { ReviewLookup } from "@/components/reputation/ReviewLookup";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { getIdentityVerificationStatus } from "@/utils/walletUtils";

const Dashboard = () => {
  const { isWalletConnected, trustScore, publicKey } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data refreshed",
        description: "Your dashboard has been updated with the latest data",
      });
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-3">Your Trust Dashboard</h1>
              <p className="text-muted-foreground mb-6">
                Monitor and manage your decentralized reputation across the Stellar blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <WalletConnection />
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  disabled={!isWalletConnected || isRefreshing}
                  onClick={handleRefresh}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? "Refreshing..." : "Refresh Data"}
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-r from-reputation-600/20 to-blue-500/20 p-8 rounded-lg flex items-center justify-center">
              <div className="text-center">
                {isWalletConnected ? (
                  <>
                    <div className="text-5xl font-bold mb-2 text-reputation-600">{trustScore || '0'}</div>
                    <div className="text-muted-foreground">Trust Score</div>
                    <Link to="/verification" className="mt-2 inline-flex items-center text-sm text-reputation-600 hover:underline">
                      <Shield className="h-3 w-3 mr-1" />
                      {getIdentityVerificationStatus(publicKey || "") === 'verified' ? 
                        'Verified' : 'Get Verified'}
                    </Link>
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

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Leases
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isWalletConnected ? '12' : '-'}</div>
                <p className="text-xs text-muted-foreground">
                  {isWalletConnected ? '+3 from last month' : 'Connect wallet to view'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Successful Returns
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isWalletConnected ? '10' : '-'}</div>
                <p className="text-xs text-muted-foreground">
                  {isWalletConnected ? '83% success rate' : 'Connect wallet to view'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Trust Growth
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isWalletConnected ? '+15%' : '-'}</div>
                <p className="text-xs text-muted-foreground">
                  {isWalletConnected ? 'Since last verification' : 'Connect wallet to view'}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Give Reputation & Review Lookup Sections */}
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GiveReputation />
            <ReviewLookup />
          </section>

          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {isWalletConnected ? (
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
                      <div>Lease #{i}</div>
                      <div>Digital Asset {i}</div>
                      <div>{new Date(Date.now() - i * 86400000).toLocaleDateString()}</div>
                      <div className="font-medium text-green-600">Completed</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="font-medium text-lg mb-2">No Wallet Connected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Connect your Stellar wallet to view your recent activity and reputation data
                </p>
                <WalletConnection />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
