import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownToLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DepositCardProps {
  onDeposit: (amount: number) => void;
}

export const DepositCard = ({ onDeposit }: DepositCardProps) => {
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
      description: `Depositing ${value} sBTC`,
    });
  };

  return (
    <Card className="gradient-card border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Deposit sBTC</CardTitle>
        <CardDescription>
          Contribute to the Commons while maintaining ownership
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="0.00000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-xl text-center h-14"
          />
          <p className="text-sm text-muted-foreground text-center">
            Enter amount of sBTC to deposit to the vault
          </p>
        </div>
        <Button 
          onClick={handleDeposit} 
          size="lg"
          className="w-full gap-2 h-12 text-lg"
        >
          <ArrowDownToLine className="w-5 h-5" />
          Deposit sBTC
        </Button>
      </CardContent>
    </Card>
  );
};
