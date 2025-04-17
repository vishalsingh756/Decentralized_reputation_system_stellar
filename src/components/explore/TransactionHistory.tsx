
import { useState, useEffect } from "react";
import { Clock, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/utils/walletUtils";

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        // For demo purposes, generate random transactions
        // In a real app, this would call Horizon APIs
        await new Promise(r => setTimeout(r, 1000)); // Simulate API delay
        
        const types = ["payment", "reputation", "token_transfer"];
        const mockTransactions = [];
        
        for (let i = 0; i < 15; i++) {
          const type = types[Math.floor(Math.random() * types.length)];
          const amount = Math.floor(Math.random() * 100) + 1;
          const from = `G${Array(55).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`;
          const to = `G${Array(55).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`;
          
          mockTransactions.push({
            id: `tx-${i}`,
            type,
            from,
            to,
            amount: type === "reputation" ? Math.floor(Math.random() * 4) + 1 : amount,
            asset: type === "reputation" ? "stars" : "XLM",
            timestamp: Date.now() - Math.random() * 1000000000,
            status: Math.random() > 0.1 ? "success" : "failed",
            memo: type === "reputation" ? 
              ["Great service!", "Highly recommended", "Fast transaction", "Very trustworthy"][Math.floor(Math.random() * 4)] : 
              ""
          });
        }
        
        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, []);

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter(tx => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Recent Transactions</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select
            value={filter}
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="reputation">Reputation</SelectItem>
              <SelectItem value="token_transfer">Token Transfers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading transactions...</p>
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <Badge variant={tx.type === "reputation" ? "default" : "outline"}>
                      {tx.type === "payment" ? "Payment" : 
                       tx.type === "reputation" ? "Reputation" : "Token Transfer"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {tx.from.substring(0, 6)}...{tx.from.substring(tx.from.length - 4)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {tx.to.substring(0, 6)}...{tx.to.substring(tx.to.length - 4)}
                  </TableCell>
                  <TableCell>
                    {tx.amount} {tx.asset}
                    {tx.memo && (
                      <div className="text-xs text-muted-foreground mt-1">
                        "{tx.memo}"
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(tx.timestamp)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={tx.status === "success" ? "text-green-500 border-green-200" : "text-red-500 border-red-200"}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">No Transactions Found</h3>
          <p className="text-muted-foreground text-center">
            No {filter !== "all" ? filter : ""} transactions have been recorded yet
          </p>
        </div>
      )}
    </div>
  );
}
