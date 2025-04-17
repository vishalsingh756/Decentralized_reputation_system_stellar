
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  Search, 
  Users, 
  TrendingUp, 
  Award, 
  Network, 
  FileText,
  Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/contexts/WalletContext";
import { UserExplorer } from "@/components/explore/UserExplorer";
import { TransactionHistory } from "@/components/explore/TransactionHistory";
import { TopContributors } from "@/components/explore/TopContributors";
import { ContractStats } from "@/components/explore/ContractStats";
import { NetworkGraph } from "@/components/explore/NetworkGraph";
import { FeedbackDetails } from "@/components/explore/FeedbackDetails";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("users");
  const { isWalletConnected } = useWallet();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Explore TrustChain</h1>
          <p className="text-muted-foreground">
            Discover users, transactions, and insights across the TrustChain network
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-auto pb-2">
            <TabsList className="inline-flex h-auto p-1 w-full md:w-auto">
              <TabsTrigger value="users" className="flex items-center gap-2 py-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">User Explorer</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2 py-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Transaction History</span>
                <span className="sm:hidden">Transactions</span>
              </TabsTrigger>
              <TabsTrigger value="top" className="flex items-center gap-2 py-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Top Contributors</span>
                <span className="sm:hidden">Top</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2 py-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Contract Stats</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="network" className="flex items-center gap-2 py-2">
                <Network className="h-4 w-4" />
                <span className="hidden sm:inline">Network Graph</span>
                <span className="sm:hidden">Network</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2 py-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Feedback Details</span>
                <span className="sm:hidden">Feedback</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {!isWalletConnected ? (
            <div className="flex flex-col items-center justify-center p-12 border rounded-lg mt-4 bg-muted/20">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-center text-muted-foreground mb-4 max-w-md">
                Connect your Stellar wallet to explore the TrustChain network, view user reputation,
                and see transaction history.
              </p>
            </div>
          ) : (
            <>
              <TabsContent value="users" className="mt-6">
                <UserExplorer />
              </TabsContent>
              
              <TabsContent value="transactions" className="mt-6">
                <TransactionHistory />
              </TabsContent>
              
              <TabsContent value="top" className="mt-6">
                <TopContributors />
              </TabsContent>
              
              <TabsContent value="stats" className="mt-6">
                <ContractStats />
              </TabsContent>
              
              <TabsContent value="network" className="mt-6">
                <NetworkGraph />
              </TabsContent>
              
              <TabsContent value="feedback" className="mt-6">
                <FeedbackDetails />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Explore;
