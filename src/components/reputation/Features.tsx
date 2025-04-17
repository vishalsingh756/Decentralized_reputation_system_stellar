
import { 
  Shield, 
  Fingerprint, 
  Lock, 
  UserCheck, 
  Key, 
  Layers 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-reputation-600" />,
      title: "Self-Sovereign Identity",
      description: "Own and control your digital identity without relying on centralized authorities."
    },
    {
      icon: <Fingerprint className="h-10 w-10 text-reputation-600" />,
      title: "Verifiable Credentials",
      description: "Cryptographically secured credentials that can be verified without contacting the issuer."
    },
    {
      icon: <Lock className="h-10 w-10 text-reputation-600" />,
      title: "Privacy Preserving",
      description: "Selective disclosure allows you to share only what's necessary while keeping your data private."
    },
    {
      icon: <UserCheck className="h-10 w-10 text-reputation-600" />,
      title: "Reputation Portability",
      description: "Carry your reputation across different platforms and applications in the ecosystem."
    },
    {
      icon: <Key className="h-10 w-10 text-reputation-600" />,
      title: "Decentralized Verification",
      description: "Trustless verification through consensus and blockchain technology."
    },
    {
      icon: <Layers className="h-10 w-10 text-reputation-600" />,
      title: "Composable Trust",
      description: "Build complex trust frameworks by composing multiple verifiable credentials."
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">Key Features</h2>
          <p className="text-lg text-muted-foreground">
            Our platform leverages blockchain technology to create a secure, 
            transparent and decentralized reputation system that puts users first.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border bg-card backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
