
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function WalletNotConnected() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Give Reputation</CardTitle>
        <CardDescription>Rate other users and record your feedback on the Stellar blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">Connect your wallet to give reputation to other users</p>
        </div>
      </CardContent>
    </Card>
  );
}
