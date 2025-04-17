
import React, { useState } from "react";
import { FeedbackEntry, formatDate } from "@/utils/walletUtils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, AlertTriangle, CheckCircle, Filter, Lock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface UserFeedbackProps {
  address: string;
  reviews: FeedbackEntry[];
  refreshData?: () => void;
  isVerified?: boolean;
}

export function UserFeedback({ address, reviews, refreshData, isVerified = false }: UserFeedbackProps) {
  const [filter, setFilter] = useState<'all' | 'general' | 'leasing' | 'return' | 'communication'>('all');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<'general' | 'leasing' | 'return' | 'communication'>('general');
  const { toast } = useToast();

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.category === filter);
    
  // Display a limited number of reviews for non-verified users
  const displayedReviews = isVerified 
    ? filteredReviews 
    : filteredReviews.slice(0, Math.min(2, filteredReviews.length));

  const handleSubmitFeedback = () => {
    toast({
      title: "Feedback submitted",
      description: "Your feedback has been recorded on the blockchain",
    });
    
    if (refreshData) {
      refreshData();
    }
    
    setComment('');
    setRating(5);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'leasing': return 'bg-green-100 text-green-800';
      case 'return': return 'bg-purple-100 text-purple-800';
      case 'communication': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Feedback</CardTitle>
            <CardDescription>Reviews and ratings from the Stellar community</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Submit Feedback
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Feedback</DialogTitle>
                <DialogDescription>
                  Your feedback will be recorded on the Stellar blockchain and will contribute to this user's reputation score.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-6 w-6 cursor-pointer ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => setRating(i + 1)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['general', 'leasing', 'return', 'communication'] as const).map((cat) => (
                      <Button 
                        key={cat}
                        type="button"
                        variant={category === cat ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setCategory(cat)}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Comment</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience working with this user..."
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" onClick={handleSubmitFeedback}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setFilter('all')}>All</TabsTrigger>
              <TabsTrigger value="general" onClick={() => setFilter('general')}>General</TabsTrigger>
              <TabsTrigger value="leasing" onClick={() => setFilter('leasing')}>Leasing</TabsTrigger>
              <TabsTrigger value="return" onClick={() => setFilter('return')}>Returns</TabsTrigger>
              <TabsTrigger value="communication" onClick={() => setFilter('communication')}>Communication</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium mb-1">No reviews yet</h3>
            <p className="text-muted-foreground">
              This user doesn't have any {filter !== 'all' ? filter : ''} reviews yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm font-medium">{review.rating} / 5</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      From: {review.fromAddress.slice(0, 6)}...{review.fromAddress.slice(-4)} • {formatDate(review.timestamp)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(review.category)}>
                      {review.category.charAt(0).toUpperCase() + review.category.slice(1)}
                    </Badge>
                    {review.verified ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
            
            {!isVerified && filteredReviews.length > 2 && (
              <div className="border border-dashed rounded-lg p-4">
                <div className="text-center">
                  <Lock className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                  <h3 className="font-medium mb-1">
                    {filteredReviews.length - 2} more {filteredReviews.length - 2 === 1 ? 'review' : 'reviews'} hidden
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Verify your account to see all reviews and detailed reputation data
                  </p>
                  <Link to="/verification">
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Get Verified
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
