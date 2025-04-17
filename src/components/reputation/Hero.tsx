
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle, Lock } from "lucide-react";

export function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-reputation-600">Decentralized</span> reputation 
              <span className="text-innovation-600"> system</span> for the web3 era
            </h1>
            <p className="text-lg mb-8 text-muted-foreground">
              Build, maintain and verify your reputation across the decentralized web. 
              Own your identity and credentials without centralized authorities.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-reputation-600 hover:bg-reputation-700">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
            <div className="mt-8 flex items-center space-x-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-reputation-600 mr-2" />
                <span className="text-sm">Self-sovereign</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-reputation-600 mr-2" />
                <span className="text-sm">Secure & private</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-reputation-600 mr-2" />
                <span className="text-sm">Cryptographic proofs</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-reputation-500/20 to-innovation-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-card border rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-reputation-100 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-reputation-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">Trust Score</h3>
                    <p className="text-sm text-muted-foreground">Your reputation at a glance</p>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full bg-reputation-600 text-white flex items-center justify-center text-xl font-bold animate-pulse-slow">
                  87
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-card border">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blockchain-100 flex items-center justify-center mr-3">
                        <CheckCircle className="h-4 w-4 text-blockchain-600" />
                      </div>
                      <span className="font-medium">KYC Verification</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-card border">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-innovation-100 flex items-center justify-center mr-3">
                        <CheckCircle className="h-4 w-4 text-innovation-600" />
                      </div>
                      <span className="font-medium">GitHub Contributions</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-card border">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blockchain-100 flex items-center justify-center mr-3">
                        <CheckCircle className="h-4 w-4 text-blockchain-600" />
                      </div>
                      <span className="font-medium">Transaction History</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
