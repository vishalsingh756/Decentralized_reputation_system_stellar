
import { Button } from "@/components/ui/button";

interface RecentAddressesProps {
  addresses: string[];
  onSelectAddress: (address: string) => void;
}

export function RecentAddresses({ addresses, onSelectAddress }: RecentAddressesProps) {
  if (addresses.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Recent addresses:</p>
      <div className="flex flex-wrap gap-2">
        {addresses.map((addr) => (
          <Button
            key={addr}
            variant="outline"
            size="sm"
            type="button"
            className="text-xs"
            onClick={() => onSelectAddress(addr)}
          >
            {addr.slice(0, 6)}...{addr.slice(-4)}
          </Button>
        ))}
      </div>
    </div>
  );
}
