
import { useState } from "react";
import { Shield, Menu, LayoutDashboard, Search, InfoIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WalletConnection } from "@/components/reputation/WalletConnection";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isWalletConnected } = useWallet();
  
  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-reputation-600" />
            <span className="font-bold text-xl">TrustChain</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/dashboard" className={cn(navigationMenuTriggerStyle(), "flex items-center space-x-2")}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/dashboard"
                        >
                          <Shield className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Trust Management
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            View and manage your reputation score across the blockchain
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/dashboard"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Analytics</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Track your reputation growth over time
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/dashboard"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">My Assets</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Manage assets tied to your reputation score
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/explore" className={cn(navigationMenuTriggerStyle(), "flex items-center space-x-2")}>
                  <Search className="h-4 w-4" />
                  <span>Explore</span>
                </Link>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                    <li className="flex items-center gap-4 p-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Discovery</h4>
                        <p className="text-xs text-muted-foreground">Find trusted users and valuable assets across the network</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-4 p-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Verified Users</h4>
                        <p className="text-xs text-muted-foreground">Browse users with highest trust scores and validation</p>
                      </div>
                    </li>
                    <li>
                      <Button asChild className="w-full mt-2">
                        <Link to="/explore">
                          Go to Explore
                        </Link>
                      </Button>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="#" className={cn(navigationMenuTriggerStyle(), "flex items-center space-x-2")}>
                  <InfoIcon className="h-4 w-4" />
                  <span>About</span>
                </Link>
                <NavigationMenuContent>
                  <div className="w-[400px] p-4">
                    <div className="text-sm font-medium mb-2">About TrustChain</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      TrustChain is a decentralized reputation system built on Stellar Soroban.
                      Our mission is to create transparent and secure trust mechanisms for the web3 ecosystem.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">Learn More</Button>
                      <Button variant="outline" size="sm">Documentation</Button>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center space-x-4">
            <WalletConnection />
            
            {isWalletConnected && (
              <Link to="/profile">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-reputation-100 text-reputation-800">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto px-4 py-3">
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="flex items-center space-x-2 py-2 text-sm font-medium hover:text-reputation-600 transition-colors">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/explore" className="flex items-center space-x-2 py-2 text-sm font-medium hover:text-reputation-600 transition-colors">
                  <Search className="h-4 w-4" />
                  <span>Explore</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center space-x-2 py-2 text-sm font-medium hover:text-reputation-600 transition-colors">
                  <InfoIcon className="h-4 w-4" />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center space-x-2 py-2 text-sm font-medium hover:text-reputation-600 transition-colors">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </li>
              <li className="pt-2">
                <WalletConnection />
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
