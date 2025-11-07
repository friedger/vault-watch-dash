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
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Deposit Assets</CardTitle>
        <CardDescription>
          Contribute to the Commons while maintaining ownership
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sbtc" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="sbtc">sBTC</TabsTrigger>
            <TabsTrigger value="stx">STX</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sbtc" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="0.00000000"
                value={sBtcAmount}
                onChange={(e) => setSBtcAmount(e.target.value)}
                className="text-xl text-center h-14"
              />
              <p className="text-sm text-muted-foreground text-center">
                Enter amount of sBTC to deposit to the vault
              </p>
            </div>
            <Button 
              onClick={handleSBtcDeposit} 
              size="lg"
              className="w-full gap-2 h-12 text-lg"
              disabled={sBtcBalance === 0}
            >
              <ArrowDownToLine className="w-5 h-5" />
              Deposit sBTC
            </Button>
            {sBtcBalance === 0 && (
              <div className="text-center">
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
          </TabsContent>

          <TabsContent value="stx" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="0.00"
                value={stxAmount}
                onChange={(e) => setStxAmount(e.target.value)}
                className="text-xl text-center h-14"
              />
              <p className="text-sm text-muted-foreground text-center">
                Enter amount of STX to deposit to the vault
              </p>
            </div>
            <Button 
              onClick={handleStxDeposit} 
              size="lg"
              className="w-full gap-2 h-12 text-lg"
              disabled={stxBalance === 0}
            >
              <ArrowDownToLine className="w-5 h-5" />
              Deposit STX
            </Button>
            {stxBalance === 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Insufficient STX balance
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
