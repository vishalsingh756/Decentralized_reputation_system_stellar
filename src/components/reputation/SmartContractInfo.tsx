
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { WalletConnection } from "@/components/reputation/WalletConnection";
import { Info, Check } from "lucide-react";

export function SmartContractInfo() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">Blockchain Integration</h2>
          <p className="text-lg text-muted-foreground">
            Our decentralized reputation system is powered by smart contracts on the Stellar blockchain, 
            enabling transparent, immutable reputation tracking and leasing history.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Smart Contract Features</CardTitle>
              <CardDescription>Key capabilities of our reputation tracking system</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Track lease history across assets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Record successful and failed returns</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Manage disputes between parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Calculate reputation scores based on behavior</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Portable trust scores across platforms</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>Access your reputation data on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Connect your Stellar wallet to view your reputation score, lease history, and manage ongoing leases.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Contract Network</p>
                    <p className="text-xs text-muted-foreground">Stellar (Soroban)</p>
                  </div>
                  <Badge variant="outline" className="bg-accent/20">Testnet</Badge>
                </div>
                
                <div className="flex justify-center pt-4">
                  <WalletConnection />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
