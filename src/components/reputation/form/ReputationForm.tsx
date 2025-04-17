
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, Send, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from "@/contexts/WalletContext";
import { simulateBlockchainTransaction } from "@/utils/walletUtils";
import { RecentAddresses } from "./RecentAddresses";
import { formSchema } from "./schema";

export function ReputationForm() {
  const { toast } = useToast();
  const { isWalletConnected, publicKey } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentAddresses, setRecentAddresses] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentAddresses");
    return saved ? JSON.parse(saved) : [];
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      category: "general",
      rating: "5",
      comment: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isWalletConnected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to give reputation",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, this would interact with the Stellar blockchain
      // Here we're simulating the transaction
      await simulateBlockchainTransaction(
        publicKey,
        values.address,
        parseInt(values.rating),
        values.comment,
        values.category as "general" | "leasing" | "return" | "communication"
      );

      // Save to recent addresses
      if (!recentAddresses.includes(values.address)) {
        const updatedAddresses = [values.address, ...recentAddresses].slice(0, 5);
        localStorage.setItem("recentAddresses", JSON.stringify(updatedAddresses));
        setRecentAddresses(updatedAddresses);
      }

      // Reset form
      form.reset({
        address: "",
        category: "general",
        rating: "5",
        comment: "",
      });

      toast({
        title: "Reputation submitted",
        description: "Your feedback has been recorded on the Stellar blockchain",
      });
    } catch (error) {
      console.error("Error submitting reputation:", error);
      toast({
        title: "Error",
        description: "Failed to submit reputation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient's Stellar Address</FormLabel>
              <FormControl>
                <Input placeholder="G..." {...field} />
              </FormControl>
              <FormDescription>
                Enter the Stellar address of the user you want to rate
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {recentAddresses.length > 0 && (
          <RecentAddresses 
            addresses={recentAddresses} 
            onSelectAddress={(addr) => form.setValue("address", addr)} 
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategorySelector control={form.control} />
          <RatingSelector control={form.control} />
        </div>

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Input placeholder="Write your feedback here..." {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This will be permanently recorded on the Stellar blockchain
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">
                <RefreshCw className="h-4 w-4" />
              </span>
              Recording on blockchain...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit Reputation
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}

interface CategorySelectorProps {
  control: any;
}

function CategorySelector({ control }: CategorySelectorProps) {
  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="leasing">Asset Leasing</SelectItem>
              <SelectItem value="return">Asset Return</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface RatingSelectorProps {
  control: any;
}

function RatingSelector({ control }: RatingSelectorProps) {
  return (
    <FormField
      control={control}
      name="rating"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rating</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a rating" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  <div className="flex items-center">
                    <span>{rating}</span>
                    <div className="flex ml-2">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      {Array.from({ length: 5 - rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-muted-foreground"
                        />
                      ))}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
