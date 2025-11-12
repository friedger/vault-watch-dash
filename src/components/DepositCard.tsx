import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownToLine, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface DepositCardProps {
  onSBtcDeposit: (amount: number) => void;
  onStxDeposit: (amount: number) => void;
  sBtcBalance: number;
  stxBalance: number;
}

export const DepositCard = ({ onSBtcDeposit, onStxDeposit, sBtcBalance, stxBalance }: DepositCardProps) => {
  const [sBtcAmount, setSBtcAmount] = useState("");
  const [stxAmount, setStxAmount] = useState("");
  const [activeTab, setActiveTab] = useState("sbtc");
  const { toast } = useToast();

  const handleSBtcDeposit = () => {
    const value = parseFloat(sBtcAmount);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    onSBtcDeposit(value);
    setSBtcAmount("");
    toast({
      title: "Deposit initiated",
      description: `Depositing ${value} sBTC`,
    });
  };

  const handleStxDeposit = () => {
    const value = parseFloat(stxAmount);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    onStxDeposit(value);
    setStxAmount("");
    toast({
      title: "Deposit initiated",
      description: `Depositing ${value} STX`,
    });
  };

  return (
    <Card className="gradient-card border-primary/20">
      <Tabs defaultValue="sbtc" className="w-full" onValueChange={setActiveTab}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl">
                {activeTab === "sbtc" ? "Deposit sBTC" : "Deposit STX"}
              </CardTitle>
              <CardDescription>
                Contribute to the Brussels Crypto Community while maintaining ownership
              </CardDescription>
            </div>
            <TabsList className="h-9 p-1 bg-muted/50">
              <TabsTrigger 
                value="sbtc" 
                className="text-sm h-7 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                sBTC
              </TabsTrigger>
              <TabsTrigger 
                value="stx" 
                className="text-sm h-7 px-4 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary"
              >
                STX
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        
        <CardContent>
          <TabsContent value="sbtc" className="space-y-6 mt-0">
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="0.00000000"
                  value={sBtcAmount}
                  onChange={(e) => setSBtcAmount(e.target.value)}
                  className="text-2xl text-center h-16 font-mono"
                  step="0.00000001"
                  min="0"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Available: {sBtcBalance.toFixed(8)} sBTC
                </p>
              </div>
              
              <Button 
                onClick={handleSBtcDeposit} 
                size="lg"
                className="w-full gap-2 h-14 text-lg bg-primary hover:bg-primary/90"
                disabled={sBtcBalance === 0}
              >
                <ArrowDownToLine className="w-5 h-5" />
                Deposit
              </Button>
              
              {sBtcBalance === 0 && (
                <div className="text-center pt-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="gap-2 text-primary"
                    asChild
                  >
                    <a href="https://sbtc.stacks.co/" target="_blank" rel="noopener noreferrer">
                      Get more sBTC
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stx" className="space-y-6 mt-0">
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={stxAmount}
                  onChange={(e) => setStxAmount(e.target.value)}
                  className="text-2xl text-center h-16 font-mono"
                  step="0.000001"
                  min="0"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Available: {stxBalance.toFixed(6)} STX
                </p>
              </div>
              
              <Button 
                onClick={handleStxDeposit} 
                size="lg"
                className="w-full gap-2 h-14 text-lg bg-secondary hover:bg-secondary/90"
                disabled={stxBalance === 0}
              >
                <ArrowDownToLine className="w-5 h-5" />
                Deposit
              </Button>
              
              {stxBalance === 0 && (
                <div className="text-center pt-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="gap-2 text-secondary"
                    asChild
                  >
                    <a href="https://www.okx.com/web3/dex-swap#inputChain=501&inputCurrency=0xc7bbec68d12a0d1830360f8ec58fa599ba1b0e9b&outputChain=501&outputCurrency=0xes" target="_blank" rel="noopener noreferrer">
                      Get more STX
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
