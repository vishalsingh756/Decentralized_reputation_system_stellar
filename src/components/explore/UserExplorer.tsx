
import { useState } from "react";
import { Search, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { queryReputationData, getTrustScoreColor, getIdentityVerificationStatus } from "@/utils/walletUtils";

export function UserExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery) {
      toast({
        title: "Search query required",
        description: "Please enter a Stellar address or username to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // For demo purposes, we'll generate random users
      // In a real app, this would call an API
      const searchResults = [];
      
      // For exact address match
      if (searchQuery.startsWith("G") && searchQuery.length >= 10) {
        const userData = await queryReputationData(searchQuery);
        searchResults.push({
          address: userData.address,
          trustScore: userData.trustScore,
          totalFeedback: userData.reviews.length,
          averageRating: userData.reviews.length > 0 
            ? userData.reviews.reduce((acc, r) => acc + r.rating, 0) / userData.reviews.length
            : 0,
          tokenBalance: Math.floor(Math.random() * 1000),
          verificationStatus: getIdentityVerificationStatus(userData.address)
        });
      }
      
      // Add some random results
      for (let i = 0; i < 5; i++) {
        const address = `G${Array(55).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`;
        const totalFeedback = Math.floor(Math.random() * 20);
        const averageRating = Math.random() * 4 + 1;
        
        searchResults.push({
          address,
          trustScore: Math.floor(Math.random() * 100),
          totalFeedback,
          averageRating,
          tokenBalance: Math.floor(Math.random() * 1000),
          verificationStatus: Math.random() > 0.6 ? "verified" : Math.random() > 0.3 ? "pending" : "none"
        });
      }
      
      setUsers(searchResults);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by Stellar address or username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          className="whitespace-nowrap"
        >
          {isLoading ? "Searching..." : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search Users
            </>
          )}
        </Button>
      </div>
      
      {users.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.address}>
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      {user.verificationStatus === "verified" && (
                        <Shield className="h-3 w-3 text-reputation-600" />
                      )}
                      {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTrustScoreColor(user.trustScore)}>
                      {user.trustScore}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.totalFeedback}</TableCell>
                  <TableCell>{user.averageRating.toFixed(1)}</TableCell>
                  <TableCell>{user.tokenBalance} XLM</TableCell>
                  <TableCell>
                    <Link to={`/reputation/${user.address}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">No Results Yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Search for users by their Stellar address or username to see their reputation details
          </p>
        </div>
      )}
    </div>
  );
}
