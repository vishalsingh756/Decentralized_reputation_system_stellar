
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { TrendingUp, Users, Coins, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export function ContractStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  // Load contract stats on component mount
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        // For demo purposes, generate random stats
        // In a real app, this would call an API to fetch contract data
        await new Promise(r => setTimeout(r, 1200)); // Simulate API delay
        
        const totalUsers = 1000 + Math.floor(Math.random() * 9000);
        const previousUsers = totalUsers - Math.floor(Math.random() * 200);
        const userChange = (((totalUsers - previousUsers) / previousUsers) * 100).toFixed(1);
        
        const totalTokens = 1000000 + Math.floor(Math.random() * 1000000);
        const previousTokens = totalTokens - Math.floor(Math.random() * 50000);
        const tokenChange = (((totalTokens - previousTokens) / previousTokens) * 100).toFixed(1);
        
        const totalTransfers = 50000 + Math.floor(Math.random() * 50000);
        const previousTransfers = totalTransfers - Math.floor(Math.random() * 5000);
        const transferChange = (((totalTransfers - previousTransfers) / previousTransfers) * 100).toFixed(1);
        
        const mockStats = {
          totalUsers,
          userChange: parseFloat(userChange),
          totalTokens,
          tokenChange: parseFloat(tokenChange),
          totalTransfers,
          transferChange: parseFloat(transferChange),
          activeUsers: Math.floor(totalUsers * 0.3),
          dailyTransactions: Math.floor(Math.random() * 500) + 100,
        };
        
        // Generate chart data for the past 7 days
        const today = new Date();
        const mockChartData = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          mockChartData.push({
            name: dayName,
            users: Math.floor(Math.random() * 100) + 50,
            transactions: Math.floor(Math.random() * 200) + 100,
            tokens: Math.floor(Math.random() * 1000) + 500,
          });
        }
        
        setStats(mockStats);
        setChartData(mockChartData);
      } catch (error) {
        console.error("Error loading contract stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Smart Contract Statistics
      </h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <TrendingUp className="h-8 w-8 animate-pulse text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading contract statistics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
                <p className="text-xs flex items-center gap-1 mt-1">
                  {stats?.userChange > 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+{stats?.userChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">{stats?.userChange}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Token Supply
                </CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalTokens.toLocaleString()}</div>
                <p className="text-xs flex items-center gap-1 mt-1">
                  {stats?.tokenChange > 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+{stats?.tokenChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">{stats?.tokenChange}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Transfers
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalTransfers.toLocaleString()}</div>
                <p className="text-xs flex items-center gap-1 mt-1">
                  {stats?.transferChange > 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+{stats?.transferChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">{stats?.transferChange}%</span>
                    </>
                  )}
                  <span className="text-muted-foreground">from last month</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Network Activity (Last 7 Days)</CardTitle>
              <CardDescription>
                Daily statistics for users, transactions, and token movements
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#8884d8" name="New Users" />
                    <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
                    <Bar dataKey="tokens" fill="#ffc658" name="Token Transfers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-between text-sm text-muted-foreground">
              <div>Active Users: {stats?.activeUsers.toLocaleString()}</div>
              <div>Daily Transactions: {stats?.dailyTransactions.toLocaleString()}</div>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}
