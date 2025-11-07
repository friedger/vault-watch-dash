import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpFromLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WithdrawCardProps {
  onSBtcWithdraw: (amount: number) => void;
  onStxWithdraw: (amount: number) => void;
  bxlBtcBalance: number;
  blxStxBalance: number;
}

export const WithdrawCard = ({ 
  onSBtcWithdraw, 
  onStxWithdraw,
  bxlBtcBalance,
  blxStxBalance
}: WithdrawCardProps) => {
  const [sBtcAmount, setSBtcAmount] = useState("");
  const [stxAmount, setStxAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"sBTC" | "STX">("sBTC");
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
    if (value > blxStxBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough blxSTX to withdraw",
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
    <Card className="gradient-card border-primary/10 relative overflow-hidden">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant={activeTab === "sBTC" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("sBTC")}
          className={activeTab === "sBTC" ? "" : ""}
        >
          sBTC
        </Button>
        <Button
          variant={activeTab === "STX" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setActiveTab("STX")}
        >
          STX
        </Button>
      </div>

      <CardHeader>
        <CardTitle className="text-lg">Withdraw Assets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeTab === "sBTC" ? (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-muted-foreground">Amount</label>
                <p className="text-xs text-muted-foreground">
                  Balance: {bxlBtcBalance.toFixed(8)} bxlBTC
                </p>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                value={sBtcAmount}
                onChange={(e) => setSBtcAmount(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button
              onClick={handleSBtcWithdraw}
              className="w-full gap-2"
              disabled={bxlBtcBalance <= 0}
            >
              <ArrowUpFromLine className="w-4 h-4" />
              Withdraw sBTC
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-muted-foreground">Amount</label>
                <p className="text-xs text-muted-foreground">
                  Balance: {blxStxBalance.toLocaleString()} blxSTX
                </p>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                value={stxAmount}
                onChange={(e) => setStxAmount(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button
              onClick={handleStxWithdraw}
              variant="secondary"
              className="w-full gap-2"
              disabled={blxStxBalance <= 0}
            >
              <ArrowUpFromLine className="w-4 h-4" />
              Withdraw STX
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
