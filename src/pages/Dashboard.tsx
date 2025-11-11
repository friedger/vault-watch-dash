import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUpFromLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { TransactionHistory } from "@/components/TransactionHistory";
import { PortfolioChart } from "@/components/PortfolioChart";
import daoLogo from "@/assets/dao-logo.png";
import { useBalances } from "@/hooks/useBalances";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { data: userBalances } = useBalances(userAddress);
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
    if (value > (userBalances?.bxlBTC ?? 0)) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough bxlBTC to withdraw",
        variant: "destructive",
      });
      return;
    }
    console.log('Withdraw sBTC:', value);
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
    if (value > (userBalances?.blxSTX ?? 0)) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough blxSTX to withdraw",
        variant: "destructive",
      });
      return;
    }
    console.log('Withdraw STX:', value);
    setStxAmount("");
    toast({
      title: "Withdrawal initiated",
      description: `Withdrawing ${value} STX`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userAddress={userAddress}
        onAddressChange={setUserAddress}
        sBtcBalance={userBalances?.sBtc ?? 0}
        stxBalance={userBalances?.stx ?? 0}
        bxlBTC={userBalances?.bxlBTC ?? 0}
        blxSTX={userBalances?.blxSTX ?? 0}
        pageTitle="User Dashboard"
        backLink="/"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!userAddress ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-20 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <img 
                src={daoLogo} 
                alt="DAO Brussels" 
                className="h-32 w-32 object-contain relative z-10"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Connect Your Wallet</h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Connect your wallet to view your dashboard, manage your assets, and track your transaction history.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Withdraw Card */}
            <div className="max-w-xl mx-auto">
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
                          Available: {(userBalances?.bxlBTC ?? 0).toFixed(8)} bxlBTC
                        </p>
                      </div>
                      <Button 
                        onClick={handleSBtcWithdraw} 
                        size="lg"
                        className="w-full gap-2 h-12 text-lg bg-primary hover:bg-primary/90"
                        disabled={(userBalances?.bxlBTC ?? 0) === 0}
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
                          Available: {(userBalances?.blxSTX ?? 0).toLocaleString()} blxSTX
                        </p>
                      </div>
                      <Button 
                        onClick={handleStxWithdraw} 
                        size="lg"
                        className="w-full gap-2 h-12 text-lg bg-secondary hover:bg-secondary/90"
                        disabled={(userBalances?.blxSTX ?? 0) === 0}
                      >
                        <ArrowUpFromLine className="w-5 h-5" />
                        Withdraw STX
                      </Button>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </div>

            {/* Portfolio Chart */}
            <PortfolioChart
              sBtc={userBalances?.sBtc ?? 0}
              stx={userBalances?.stx ?? 0}
              bxlBTC={userBalances?.bxlBTC ?? 0}
              blxSTX={userBalances?.blxSTX ?? 0}
            />

            {/* Transaction History */}
            <TransactionHistory />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
