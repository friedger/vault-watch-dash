import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowUpFromLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WithdrawCardProps {
  onSBtcWithdraw: (amount: number) => void;
  onStxWithdraw: (amount: number) => void;
  bxlBtcBalance: number;
  bxlStxBalance: number;
}

export const WithdrawCard = ({ 
  onSBtcWithdraw, 
  onStxWithdraw,
  bxlBtcBalance,
  bxlStxBalance
}: WithdrawCardProps) => {
  const [sBtcAmount, setSBtcAmount] = useState("");
  const [stxAmount, setStxAmount] = useState("");
  const [activeTab, setActiveTab] = useState("sbtc");
  const { toast } = useToast();

  const handleSBtcWithdraw = () => {
    const value = parseFloat(sBtcAmount);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    if (value > bxlBtcBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough bxlBTC to withdraw",
        variant: "destructive",
      });
      return;
    }
    onSBtcWithdraw(value);
    setSBtcAmount("");
    toast({
      title: "Withdrawal initiated",
      description: `Withdrawing ${value} sBTC`,
    });
  };

  const handleStxWithdraw = () => {
    const value = parseFloat(stxAmount);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    if (value > bxlStxBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough bxlSTX to withdraw",
        variant: "destructive",
      });
      return;
    }
    onStxWithdraw(value);
    setStxAmount("");
    toast({
      title: "Withdrawal initiated",
      description: `Withdrawing ${value} STX`,
    });
  };

  return (
    <Card className="gradient-card border-primary/20 relative">
      <Tabs defaultValue="sbtc" className="w-full" onValueChange={setActiveTab}>
        <div className="absolute top-4 right-4 z-10">
          <TabsList className="h-8 p-1 bg-muted/50">
            <TabsTrigger 
              value="sbtc" 
              className="text-xs h-6 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              sBTC
            </TabsTrigger>
            <TabsTrigger 
              value="stx" 
              className="text-xs h-6 px-3 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary"
            >
              STX
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {activeTab === "sbtc" ? "Withdraw sBTC" : "Withdraw STX"}
          </CardTitle>
          <CardDescription>
            Withdraw your assets from the vault
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsContent value="sbtc" className="space-y-4 mt-0">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="0.00000000"
                value={sBtcAmount}
                onChange={(e) => setSBtcAmount(e.target.value)}
                className="text-xl text-center h-14"
              />
              <p className="text-sm text-muted-foreground text-center">
                Available: {bxlBtcBalance.toFixed(8)} bxlBTC
              </p>
            </div>
            <Button 
              onClick={handleSBtcWithdraw} 
              size="lg"
              className="w-full gap-2 h-12 text-lg bg-primary hover:bg-primary/90"
              disabled={bxlBtcBalance === 0}
            >
              <ArrowUpFromLine className="w-5 h-5" />
              Withdraw sBTC
            </Button>
          </TabsContent>

          <TabsContent value="stx" className="space-y-4 mt-0">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="0.00"
                value={stxAmount}
                onChange={(e) => setStxAmount(e.target.value)}
                className="text-xl text-center h-14"
              />
              <p className="text-sm text-muted-foreground text-center">
                Available: {bxlStxBalance.toLocaleString()} bxlSTX
              </p>
            </div>
            <Button 
              onClick={handleStxWithdraw} 
              size="lg"
              className="w-full gap-2 h-12 text-lg bg-secondary hover:bg-secondary/90"
              disabled={bxlStxBalance === 0}
            >
              <ArrowUpFromLine className="w-5 h-5" />
              Withdraw STX
            </Button>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
