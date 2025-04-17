
import { Badge } from "@/components/ui/badge";

export function HowItWorks() {
  return (
    <section className="py-20 px-4 reputation-grid relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 border-reputation-500 text-reputation-600 bg-reputation-50">Decentralized Technology</Badge>
          <h2 className="text-3xl font-bold mb-6">How Our Reputation System Works</h2>
          <p className="text-lg text-muted-foreground">
            Leveraging blockchain technology and cryptographic proofs to create 
            a trustless and transparent reputation system.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-12 w-12 rounded-full bg-reputation-100 flex items-center justify-center text-reputation-600 font-bold text-lg">1</div>
            <div className="bg-card border rounded-xl p-6 h-full">
              <h3 className="text-xl font-bold mb-4 pt-6">Create Your Identity</h3>
              <p className="text-muted-foreground mb-4">
                Generate your decentralized identifier (DID) which serves as your 
                cryptographic identity across the platform.
              </p>
              <div className="mt-6 p-4 bg-muted rounded-md">
                <code className="text-sm block">
                  <span className="text-innovation-600">DID:</span> did:trustchain:0x7c83..1f9e
                </code>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-12 w-12 rounded-full bg-reputation-100 flex items-center justify-center text-reputation-600 font-bold text-lg">2</div>
            <div className="bg-card border rounded-xl p-6 h-full">
              <h3 className="text-xl font-bold mb-4 pt-6">Collect Verifiable Credentials</h3>
              <p className="text-muted-foreground mb-4">
                Obtain cryptographically signed attestations from trusted issuers 
                that verify different aspects of your identity and actions.
              </p>
              <div className="rounded-md p-3 bg-reputation-50 border border-reputation-100 mt-4 flex items-start space-x-3">
                <span className="h-6 w-6 rounded-full bg-reputation-100 flex items-center justify-center">✓</span>
                <div>
                  <p className="text-sm font-medium">KYC Verification</p>
                  <p className="text-xs text-muted-foreground">Issued by VerifyTrust</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-12 w-12 rounded-full bg-reputation-100 flex items-center justify-center text-reputation-600 font-bold text-lg">3</div>
            <div className="bg-card border rounded-xl p-6 h-full">
              <h3 className="text-xl font-bold mb-4 pt-6">Build Your Reputation</h3>
              <p className="text-muted-foreground mb-4">
                Your credentials and on-chain activities contribute to your 
                overall reputation score, which is verifiable by anyone.
              </p>
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full flex items-center justify-center bg-gradient-to-br from-reputation-600 to-innovation-600 text-white font-bold text-2xl">
                  87/100
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-reputation-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-innovation-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}
