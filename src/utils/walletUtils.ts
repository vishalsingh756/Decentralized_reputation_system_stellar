export type WalletInfo = {
  address: string;
  trustScore: number;
  totalLeases: number;
  successfulReturns: number;
  failedReturns: number;
  disputesRaised: number;
  reviews: FeedbackEntry[];
};

export type FeedbackEntry = {
  id: string;
  fromAddress: string;
  rating: number; // 1-5 star rating
  comment: string;
  timestamp: number;
  category: 'general' | 'leasing' | 'return' | 'communication';
  verified: boolean;
};

export const generateTrustInfo = (address: string): WalletInfo => {
  // Use a seeded random based on the address to get consistent results
  let seedValue = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seededRandom = (min: number, max: number): number => {
    const x = Math.sin(seedValue++) * 10000;
    const rand = x - Math.floor(x);
    return Math.floor(rand * (max - min + 1)) + min;
  };
  
  const totalLeases = seededRandom(0, 20);
  
  // Generate mock reviews
  const reviewCount = seededRandom(0, 5);
  const reviews: FeedbackEntry[] = [];
  
  for (let i = 0; i < reviewCount; i++) {
    const categories = ['general', 'leasing', 'return', 'communication'] as const;
    const category = categories[seededRandom(0, 3)] as 'general' | 'leasing' | 'return' | 'communication';
    const rating = seededRandom(1, 5);
    
    reviews.push({
      id: `review-${i}-${address.slice(0, 6)}`,
      fromAddress: `G${Array(55).fill(0).map(() => seededRandom(0, 9)).join('')}`,
      rating,
      comment: getRandomFeedback(rating),
      timestamp: Date.now() - seededRandom(0, 30) * 24 * 60 * 60 * 1000, // Random time up to 30 days ago
      category,
      verified: seededRandom(0, 10) > 2 // Most reviews are verified
    });
  }
  
  // Calculate trust score based on reviews and lease history
  const reviewScore = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 3;
    
  // Success rate depends on the trust score
  const baseScore = Math.min(0.95, reviewScore / 5 + 0.2);
  const successfulReturns = Math.floor(totalLeases * baseScore);
  const failedReturns = totalLeases - successfulReturns;
  const disputesRaised = seededRandom(0, 3);
  
  // Final weighted score calculation
  const trustScore = calculateWeightedScore({
    reviewAverage: reviewScore,
    reviewCount: reviews.length,
    successRate: totalLeases > 0 ? successfulReturns / totalLeases : 0.5,
    disputeRate: totalLeases > 0 ? disputesRaised / totalLeases : 0
  });
  
  return {
    address,
    trustScore,
    totalLeases,
    successfulReturns,
    failedReturns,
    disputesRaised,
    reviews
  };
};

// Trust scoring algorithm
interface ScoreFactors {
  reviewAverage: number;     // 1-5 scale
  reviewCount: number;       // Number of reviews
  successRate: number;       // 0-1 scale
  disputeRate: number;       // 0-1 scale
}

export const calculateWeightedScore = (factors: ScoreFactors): number => {
  // Weights for different factors
  const weights = {
    reviewAverage: 0.4,
    reviewCount: 0.1,
    successRate: 0.4,
    disputeRate: -0.1,
  };
  
  // Convert review average to 0-100 scale
  const reviewScore = factors.reviewAverage * 20;
  
  // Normalize review count (diminishing returns after 10 reviews)
  const normalizedReviewCount = Math.min(factors.reviewCount, 10) / 10;
  
  // Calculate weighted score
  let score = 
    reviewScore * weights.reviewAverage +
    normalizedReviewCount * 100 * weights.reviewCount +
    factors.successRate * 100 * weights.successRate +
    factors.disputeRate * 100 * weights.disputeRate;
  
  // Ensure score is between 1-100
  return Math.max(1, Math.min(100, Math.round(score)));
};

export const getTrustScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
};

export const getTrustScoreLabel = (score: number): string => {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Poor";
  return "Risky";
};

// Helper function to generate random feedback comments
const getRandomFeedback = (rating: number): string => {
  const positiveFeedback = [
    "Great experience working with this user!",
    "Very reliable and trustworthy.",
    "Assets returned in perfect condition.",
    "Excellent communication throughout the process.",
    "Would definitely work with again!",
  ];
  
  const neutralFeedback = [
    "Decent experience overall.",
    "Everything went as expected.",
    "No issues to report.",
    "Communication was adequate.",
    "Transaction completed successfully.",
  ];
  
  const negativeFeedback = [
    "Had some issues during the process.",
    "Communication could have been better.",
    "Delayed return of assets.",
    "Some minor problems with condition of returned items.",
    "Would be cautious about working with again.",
  ];
  
  if (rating >= 4) {
    return positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)];
  } else if (rating >= 3) {
    return neutralFeedback[Math.floor(Math.random() * neutralFeedback.length)];
  } else {
    return negativeFeedback[Math.floor(Math.random() * negativeFeedback.length)];
  }
};

// Simulated Stellar Horizon API query function
export const queryReputationData = async (address: string): Promise<WalletInfo> => {
  // In a real implementation, this would make API calls to Stellar Horizon
  // For now, we'll use our mock data generator
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const walletInfo = generateTrustInfo(address);
      resolve(walletInfo);
    }, 800);
  });
};

// Format date for display
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Generate an identity verification status based on wallet address
export const getIdentityVerificationStatus = (address: string): 'verified' | 'pending' | 'none' => {
  // Use a seeded random based on the address to get consistent results
  const seedValue = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const value = Math.sin(seedValue) * 10000;
  const rand = value - Math.floor(value);
  
  if (rand > 0.7) return 'verified';
  if (rand > 0.3) return 'pending';
  return 'none';
};

// Simulated Stellar blockchain transaction
export const simulateBlockchainTransaction = async (
  fromAddress: string,
  toAddress: string,
  rating: number,
  comment: string,
  category: 'general' | 'leasing' | 'return' | 'communication'
): Promise<{ success: boolean; txHash: string }> => {
  // In a real app, this would use the Stellar SDK to create and submit a transaction
  return new Promise((resolve, reject) => {
    // Simulate network delay and transaction processing
    setTimeout(() => {
      try {
        // Generate a fake transaction hash based on the parameters
        const txHash = Array(64).fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join('');
        
        console.log('Simulated blockchain transaction:', {
          from: fromAddress,
          to: toAddress,
          rating,
          comment,
          category,
          txHash
        });
        
        resolve({
          success: true,
          txHash
        });
      } catch (error) {
        reject(error);
      }
    }, 1500); // Simulate a 1.5s delay
  });
};
