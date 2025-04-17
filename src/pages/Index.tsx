
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/reputation/Hero";
import { Features } from "@/components/reputation/Features";
import { HowItWorks } from "@/components/reputation/HowItWorks";
import { VisualizationDemo } from "@/components/reputation/VisualizationDemo";
import { Footer } from "@/components/reputation/Footer";
import { SmartContractInfo } from "@/components/reputation/SmartContractInfo";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div className="container mx-auto my-8 flex justify-center">
          <Link to="/dashboard">
            <Button size="lg" className="flex items-center gap-2 bg-reputation-600 hover:bg-reputation-700">
              <LayoutDashboard className="h-5 w-5" />
              <span>Get Started Now</span>
            </Button>
          </Link>
        </div>
        <Features />
        <HowItWorks />
        <SmartContractInfo />
        <VisualizationDemo />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
