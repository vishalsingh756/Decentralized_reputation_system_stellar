
import { useEffect, useRef, useState } from "react";
import { Network, Loader2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function NetworkGraph() {
  const [isLoading, setIsLoading] = useState(true);
  const [graphType, setGraphType] = useState("reputation");
  const [nodeSize, setNodeSize] = useState([50]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load network graph on component mount
  useEffect(() => {
    const loadGraph = async () => {
      setIsLoading(true);
      try {
        // For demo purposes, show a loading state
        // In a real app, this would initialize D3.js or Vis.js
        await new Promise(r => setTimeout(r, 1500)); // Simulate API and rendering delay
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading network graph:", error);
        setIsLoading(false);
      }
    };
    
    loadGraph();
  }, [graphType, nodeSize]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Interaction Graph
              </CardTitle>
              <CardDescription>
                Visual representation of user interactions on TrustChain
              </CardDescription>
            </div>
            <Select
              value={graphType}
              onValueChange={setGraphType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Graph Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reputation">Reputation Graph</SelectItem>
                <SelectItem value="payments">Payment Graph</SelectItem>
                <SelectItem value="connections">Connection Graph</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Node Size</span>
                <span>{nodeSize[0]}</span>
              </div>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                value={nodeSize}
                onValueChange={setNodeSize}
              />
            </div>
            
            <div 
              ref={canvasRef} 
              className="border rounded-md flex items-center justify-center min-h-[400px] bg-muted/20"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Generating network graph...</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <Network className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Network Visualization</h3>
                  <p className="text-muted-foreground mt-2">
                    This is a placeholder for the network graph visualization.
                    In a production app, this would be implemented using D3.js or another 
                    visualization library to show connections between users.
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span>High Trust Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span>Medium Trust Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span>Low Trust Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-8 bg-green-500 rounded-full"></div>
                <span>Positive Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-8 bg-gray-500 rounded-full"></div>
                <span>Neutral Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-8 bg-red-500 rounded-full"></div>
                <span>Negative Feedback</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
