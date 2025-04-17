import { useState, useEffect } from 'react';
import { supabaseClient } from '../lib/supabase';

interface Feedback {
  id: string;
  wallet_address: string;
  rating: number;
  comment: string;
  created_at: string;
  transaction_hash?: string;
  from_address?: string;
  to_address?: string;
  category?: string;
}

interface TransactionData {
  category: string;
  comment: string;
  from: string;
  rating: number;
  to: string;
  txHash: string;
}

export default function FeedbackSystem({ walletAddress }: { walletAddress: string }) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [newRating, setNewRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle blockchain transaction data
  const handleBlockchainTransaction = async (transactionData: TransactionData) => {
    try {
      setLoading(true);
      console.log('Inserting transaction data:', transactionData);
      
      const { data, error } = await supabaseClient.supabase
        .from('feedback')
        .insert([
          {
            wallet_address: transactionData.to,
            rating: transactionData.rating,
            comment: transactionData.comment,
            transaction_hash: transactionData.txHash,
            from_address: transactionData.from,
            to_address: transactionData.to,
            category: transactionData.category,
          },
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Successfully inserted data:', data);
      return data;
    } catch (err) {
      console.error('Error in handleBlockchainTransaction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedback for the wallet address
  useEffect(() => {
    async function fetchFeedback() {
      try {
        setLoading(true);
        const { data, error } = await supabaseClient.supabase
          .from('feedback')
          .select('*')
          .or(`wallet_address.eq.${walletAddress},to_address.eq.${walletAddress}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFeedback(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch feedback');
        console.error('Error fetching feedback:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, [walletAddress]);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabaseClient.supabase
      .channel('feedback_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feedback',
          filter: `or(wallet_address.eq.${walletAddress},to_address.eq.${walletAddress})`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFeedback((prev) => [payload.new as Feedback, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setFeedback((prev) => prev.filter((f) => f.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [walletAddress]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRating || !newComment.trim()) {
      setError('Please provide both a rating and comment');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabaseClient.supabase
        .from('feedback')
        .insert([
          {
            wallet_address: walletAddress,
            rating: newRating,
            comment: newComment.trim(),
          },
        ])
        .select();

      if (error) throw error;

      setNewRating(0);
      setNewComment('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
      console.error('Error submitting feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Give Feedback</h2>
        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex space-x-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className={`text-2xl ${
                    star <= newRating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              placeholder="Share your experience..."
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Feedback History</h2>
        {loading && feedback.length === 0 ? (
          <div>Loading feedback...</div>
        ) : feedback.length === 0 ? (
          <div className="text-gray-500">No feedback yet</div>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => (
              <div key={item.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < item.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{item.comment}</p>
                {item.transaction_hash && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Transaction: {item.transaction_hash}</p>
                    <p>From: {item.from_address}</p>
                    <p>Category: {item.category}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 