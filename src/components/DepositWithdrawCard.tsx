import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DepositWithdrawCardProps {
  tokenType: "sBTC" | "STX";
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

export const DepositWithdrawCard = ({ 
  tokenType, 
  onDeposit, 
  onWithdraw 
}: DepositWithdrawCardProps) => {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleDeposit = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    onDeposit(value);
    setAmount("");
    toast({
      title: "Deposit initiated",
      description: `Depositing ${value} ${tokenType}`,
    });
  };

  const handleWithdraw = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    onWithdraw(value);
    setAmount("");
    toast({
      title: "Withdrawal initiated",
      description: `Withdrawing ${value} ${tokenType}`,
    });
  };

  return (
    <Card className="gradient-card border-primary/10">
      <CardHeader>
        <CardTitle className="text-lg">{tokenType} Operations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          <TabsContent value="deposit" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Enter amount of {tokenType} to deposit
              </p>
            </div>
            <Button 
              onClick={handleDeposit} 
              className="w-full gap-2"
            >
              <ArrowDownToLine className="w-4 h-4" />
              Deposit {tokenType}
            </Button>
          </TabsContent>
          <TabsContent value="withdraw" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Enter amount of {tokenType} to withdraw
              </p>
            </div>
            <Button 
              onClick={handleWithdraw} 
              variant="outline"
              className="w-full gap-2"
            >
              <ArrowUpFromLine className="w-4 h-4" />
              Withdraw {tokenType}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
