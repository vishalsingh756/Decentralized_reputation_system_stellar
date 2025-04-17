
import { useState, useEffect } from "react";
import { Award, Trophy, Star } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getTrustScoreColor } from "@/utils/walletUtils";

export function TopContributors() {
  const [contributors, setContributors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"reputation" | "tokens" | "verified">("reputation");

  // Load top contributors on component mount
  useEffect(() => {
    const loadContributors = async () => {
      setIsLoading(true);
      try {
        // For demo purposes, generate random contributors
        // In a real app, this would call an API
        await new Promise(r => setTimeout(r, 800)); // Simulate API delay
        
        const mockContributors = [];
        
        for (let i = 0; i < 9; i++) {
          const address = `G${Array(55).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`;
          const trustScore = 70 + Math.floor(Math.random() * 30);
          const positiveRatings = 10 + Math.floor(Math.random() * 90);
          const tokensReceived = 100 + Math.floor(Math.random() * 900);
          const verifiedInteractions = Math.floor(Math.random() * 50);
          
          mockContributors.push({
            id: `user-${i}`,
            address,
            trustScore,
            positiveRatings,
            tokensReceived,
            verifiedInteractions,
            isVerified: Math.random() > 0.3,
            memberSince: Date.now() - Math.random() * 31536000000 // Up to a year ago
          });
        }
        
        setContributors(mockContributors.sort((a, b) => {
          if (view === "reputation") return b.positiveRatings - a.positiveRatings;
          if (view === "tokens") return b.tokensReceived - a.tokensReceived;
          return b.verifiedInteractions - a.verifiedInteractions;
        }));
      } catch (error) {
        console.error("Error loading contributors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContributors();
  }, [view]);

  const getLeaderboardMetric = (contributor: any) => {
    if (view === "reputation") return contributor.positiveRatings;
    if (view === "tokens") return `${contributor.tokensReceived} XLM`;
    return contributor.verifiedInteractions;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Contributors
        </h2>
        
        <div className="flex gap-2">
          <Button 
            variant={view === "reputation" ? "default" : "outline"} 
            size="sm"
            onClick={() => setView("reputation")}
          >
            <Star className="h-4 w-4 mr-2" />
            By Reputation
          </Button>
          <Button 
            variant={view === "tokens" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("tokens")}
          >
            <Award className="h-4 w-4 mr-2" />
            By Tokens
          </Button>
          <Button 
            variant={view === "verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("verified")}
          >
            <Award className="h-4 w-4 mr-2" />
            By Verified Interactions
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Award className="h-8 w-8 animate-pulse text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading top contributors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contributors.map((contributor, index) => (
            <Card key={contributor.id} className={index === 0 ? "border-yellow-300 bg-yellow-50/30 dark:bg-yellow-950/10" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 bg-muted">
                      <AvatarFallback>
                        {index < 3 && (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-mono text-xs">
                        {contributor.address.substring(0, 6)}...{contributor.address.substring(contributor.address.length - 4)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {contributor.isVerified && (
                          <Badge variant="outline" className="text-reputation-600 text-xs py-0">Verified</Badge>
                        )}
                        <Badge className={getTrustScoreColor(contributor.trustScore)}>
                          Score: {contributor.trustScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-full p-2">
                      <Trophy className={`h-5 w-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-amber-700'}`} />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {view === "reputation" ? "Positive Ratings" : 
                       view === "tokens" ? "Tokens Received" : 
                       "Verified Interactions"}
                    </div>
                    <div className="text-2xl font-bold">
                      {getLeaderboardMetric(contributor)}
                    </div>
                  </div>
                  <Link to={`/reputation/${contributor.address}`}>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
