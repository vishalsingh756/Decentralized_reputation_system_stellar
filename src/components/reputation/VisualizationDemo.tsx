
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function VisualizationDemo() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  
  const handleNodeHover = (index: number | null) => {
    setActiveNode(index);
  };
  
  const nodes = [
    { x: 50, y: 50, size: 20, color: "bg-reputation-600" },
    { x: 75, y: 40, size: 15, color: "bg-blockchain-500" },
    { x: 30, y: 70, size: 18, color: "bg-innovation-600" },
    { x: 70, y: 70, size: 12, color: "bg-blockchain-600" },
    { x: 40, y: 25, size: 16, color: "bg-reputation-500" },
    { x: 25, y: 45, size: 14, color: "bg-innovation-500" },
  ];
  
  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 5 },
    { from: 0, to: 4 },
    { from: 4, to: 5 },
    { from: 3, to: 1 },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">Decentralized Reputation Visualization</h2>
          <p className="text-lg text-muted-foreground">
            Explore how reputation data is stored and verified across the decentralized network.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Network Visualization */}
          <Card className="border overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Network Visualization</CardTitle>
              <CardDescription>
                How credential attestations are stored and verified in our network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full relative bg-muted rounded-lg border overflow-hidden">
                {/* Connections */}
                <svg className="absolute inset-0 w-full h-full">
                  {connections.map((conn, i) => {
                    const fromNode = nodes[conn.from];
                    const toNode = nodes[conn.to];
                    const isActive = activeNode === conn.from || activeNode === conn.to;
                    
                    return (
                      <line 
                        key={i}
                        x1={`${fromNode.x}%`} 
                        y1={`${fromNode.y}%`} 
                        x2={`${toNode.x}%`} 
                        y2={`${toNode.y}%`} 
                        stroke={isActive ? "#0d9488" : "#d1d5db"} 
                        strokeWidth={isActive ? 2 : 1}
                        strokeDasharray={isActive ? "none" : "4 2"}
                        className="transition-colors duration-300"
                      />
                    );
                  })}
                </svg>
                
                {/* Nodes */}
                {nodes.map((node, i) => (
                  <div 
                    key={i}
                    className={`absolute rounded-full transition-all duration-300 ${
                      activeNode === i ? 'glow-effect z-10' : ''
                    } ${node.color}`}
                    style={{
                      left: `calc(${node.x}% - ${node.size / 2}px)`,
                      top: `calc(${node.y}% - ${node.size / 2}px)`,
                      width: `${activeNode === i ? node.size * 1.2 : node.size}px`,
                      height: `${activeNode === i ? node.size * 1.2 : node.size}px`,
                    }}
                    onMouseEnter={() => handleNodeHover(i)}
                    onMouseLeave={() => handleNodeHover(null)}
                  />
                ))}
                
                {/* Decorations */}
                <div className="absolute w-64 h-64 rounded-full bg-reputation-500/5 animate-pulse-slow blur-3xl -bottom-32 -right-32"></div>
                <div className="absolute w-40 h-40 rounded-full bg-innovation-500/5 animate-pulse-slow blur-2xl top-10 left-10"></div>
              </div>
              <div className="mt-4 text-sm text-center text-muted-foreground">
                Hover over nodes to see connections
              </div>
            </CardContent>
          </Card>
          
          {/* Explanation Tabs */}
          <Tabs defaultValue="data">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="data">Data Structure</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="consensus">Consensus</TabsTrigger>
            </TabsList>
            
            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Decentralized Data Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Our reputation system stores data using a distributed ledger with 
                    verifiable credentials that are cryptographically linked.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                    <pre>{`{
  "id": "did:trustchain:0x7c83..1f9e",
  "type": "VerifiableCredential",
  "issuer": "did:trustchain:0x9a23..8d7f",
  "issuanceDate": "2023-04-15T21:19:10Z",
  "credentialSubject": {
    "id": "did:trustchain:0x7c83..1f9e",
    "kycVerified": true,
    "level": "advanced"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2023-04-15T21:19:10Z",
    "verificationMethod": "did:trustchain:0x9a23..8d7f#keys-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z58DAdFfa9SkqZMVPxAQpic..."
  }
}`}</pre>
                  </div>
                  
                  <p>
                    Each credential is immutable and linked to your decentralized 
                    identity, creating a web of trust across the network.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="verification" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trustless Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Credentials can be verified without contacting the original issuer, 
                    using cryptographic proofs stored on-chain.
                  </p>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">1</div>
                    <div>Request credential presentation from user</div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">2</div>
                    <div>Verify cryptographic signature against issuer's public key</div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">3</div>
                    <div>Check revocation status on-chain</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">4</div>
                    <div>Accept or reject credential based on verification result</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="consensus" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Decentralized Consensus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Our system uses a weighted consensus mechanism to combine 
                    multiple attestations into a unified reputation score.
                  </p>
                  
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span>KYC Verification</span>
                      <span className="font-medium">25 points</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-reputation-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span>Transaction History</span>
                      <span className="font-medium">32 points</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-reputation-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span>Community Endorsements</span>
                      <span className="font-medium">30 points</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-reputation-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <div className="inline-block rounded-full bg-gradient-to-r from-reputation-600 to-innovation-600 text-white font-bold text-2xl px-6 py-2">
                      Total: 87/100
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
