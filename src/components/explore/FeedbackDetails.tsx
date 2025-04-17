
import { useState, useEffect } from "react";
import { FileText, Search, Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/utils/walletUtils";

export function FeedbackDetails() {
  const [address, setAddress] = useState("");
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLookup = async () => {
    if (!address) {
      toast({
        title: "Address required",
        description: "Please enter a Stellar address to search",
        variant: "destructive",
      });
      return;
    }

    if (!address.startsWith("G") || address.length !== 56) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Stellar address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // For demo purposes, generate random feedback
      // In a real app, this would call an API
      await new Promise(r => setTimeout(r, 1000)); // Simulate API delay
      
      const feedbackCount = Math.floor(Math.random() * 10) + 1;
      const mockFeedbacks = [];
      
      const categories = ['general', 'leasing', 'return', 'communication'];
      const positiveComments = [
        "Very trustworthy user, great experience!",
        "Smooth transaction, would recommend.",
        "Asset returned in perfect condition.",
        "Great communication throughout.",
        "One of the best users I've dealt with."
      ];
      const neutralComments = [
        "Transaction completed as expected.",
        "No issues to report.",
        "Everything went fine.",
        "Average experience overall.",
        "Transaction completed on time."
      ];
      const negativeComments = [
        "Delayed return of assets.",
        "Communication could be better.",
        "Some minor issues with condition.",
        "Response time was slow.",
        "Would be cautious next time."
      ];
      
      for (let i = 0; i < feedbackCount; i++) {
        const rating = Math.floor(Math.random() * 5) + 1;
        let comment;
        
        if (rating >= 4) {
          comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
        } else if (rating >= 3) {
          comment = neutralComments[Math.floor(Math.random() * neutralComments.length)];
        } else {
          comment = negativeComments[Math.floor(Math.random() * negativeComments.length)];
        }
        
        mockFeedbacks.push({
          id: `feedback-${i}`,
          fromAddress: `G${Array(55).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`,
          rating,
          comment,
          category: categories[Math.floor(Math.random() * categories.length)],
          timestamp: Date.now() - Math.random() * 10000000000,
          helpful: Math.floor(Math.random() * 10),
          notHelpful: Math.floor(Math.random() * 5),
        });
      }
      
      setFeedbacks(mockFeedbacks);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast({
        title: "Lookup failed",
        description: "An error occurred while retrieving feedback",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Enter Stellar address (G...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full"
          />
        </div>
        <Button 
          onClick={handleLookup} 
          disabled={isLoading}
          className="whitespace-nowrap"
        >
          {isLoading ? "Searching..." : (
            <>
              <Search className="h-4 w-4 mr-2" />
              View Feedback
            </>
          )}
        </Button>
      </div>
      
      {feedbacks.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Feedback for {address.substring(0, 6)}...{address.substring(address.length - 4)}</h3>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{feedbacks.length} reviews</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4 bg-muted/5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{feedback.fromAddress.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-mono text-xs">
                        {feedback.fromAddress.substring(0, 6)}...{feedback.fromAddress.substring(feedback.fromAddress.length - 4)}
                      </div>
                      <div className="flex items-center mt-1">
                        {renderRatingStars(feedback.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(feedback.timestamp)}
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  {feedback.comment}
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    {feedback.category}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{feedback.helpful}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="h-3 w-3" />
                      <span>{feedback.notHelpful}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">No Feedback Found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Enter a Stellar address to view detailed feedback and reputation history
          </p>
        </div>
      )}
    </div>
  );
}
