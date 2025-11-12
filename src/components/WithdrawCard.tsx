import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowUpFromLine, XCircle, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatBtc, formatStx } from "@/lib/utils";

interface WithdrawCardProps {
  onSBtcWithdraw: (amount: number) => void;
  onStxWithdraw: (amount: number) => void;
  onSBtcRequestUpdate: (requestId: number, oldAmount: number, newAmount: number) => void;
  onSBtcFinalize: (requestId: number, amount: number) => void;
  bxlBtcBalance: number;
  bxlBtcTransitionBalance: number;
  bxlStxBalance: number;
}

export const WithdrawCard = ({ 
  onSBtcWithdraw, 
  onStxWithdraw,
  onSBtcRequestUpdate,
  onSBtcFinalize,
  bxlBtcBalance,
  bxlBtcTransitionBalance,
  bxlStxBalance
}: WithdrawCardProps) => {
  const [sBtcAmount, setSBtcAmount] = useState("");
  const [stxAmount, setStxAmount] = useState("");
  const [requestId, setRequestId] = useState("");
  const [activeTab, setActiveTab] = useState("sbtc");
  const [activeRequestTab, setActiveRequestTab] = useState("finalize");
  const { toast } = useToast();

  // Check if user has an active withdrawal request (has transit tokens)
  const hasActiveRequest = bxlBtcTransitionBalance > 0;

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
      title: "Withdrawal request initiated",
      description: `Requesting withdrawal of ${value} sBTC`,
    });
  };

  const handleSBtcUpdate = () => {
    const value = parseFloat(sBtcAmount);
    const reqId = parseInt(requestId);
    
    if (isNaN(reqId) || reqId <= 0) {
      toast({
        title: "Invalid request ID",
        description: "Please enter a valid request ID",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (value > bxlBtcBalance + bxlBtcTransitionBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough bxlBTC to update the request",
        variant: "destructive",
      });
      return;
    }
    
    onSBtcRequestUpdate(reqId, bxlBtcTransitionBalance, value);
    setSBtcAmount("");
    toast({
      title: "Withdrawal request updated",
      description: `Updated request #${reqId} to ${value} sBTC`,
    });
  };

  const handleSBtcCancel = () => {
    const reqId = parseInt(requestId);
    
    if (isNaN(reqId) || reqId <= 0) {
      toast({
        title: "Invalid request ID",
        description: "Please enter a valid request ID",
        variant: "destructive",
      });
      return;
    }
    
    // Cancel by updating to 0
    onSBtcRequestUpdate(reqId, bxlBtcTransitionBalance, 0);
    setRequestId("");
    toast({
      title: "Cancelling withdrawal request",
      description: `Cancelling request #${reqId}`,
    });
  };

  const handleSBtcFinalize = () => {
    const reqId = parseInt(requestId);
    
    if (isNaN(reqId) || reqId <= 0) {
      toast({
        title: "Invalid request ID",
        description: "Please enter a valid request ID",
        variant: "destructive",
      });
      return;
    }
    
    onSBtcFinalize(reqId, bxlBtcTransitionBalance);
    setRequestId("");
    toast({
      title: "Finalizing withdrawal",
      description: `Finalizing request #${reqId}`,
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
            {!hasActiveRequest ? (
              // Step 1: Create withdrawal request
              <>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="0.00000000"
                    value={sBtcAmount}
                    onChange={(e) => setSBtcAmount(e.target.value)}
                    className="text-xl text-center h-14"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Available: {formatBtc(bxlBtcBalance)} bxlBTC
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setSBtcAmount(bxlBtcBalance.toString())}
                      disabled={bxlBtcBalance === 0}
                    >
                      Max
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleSBtcWithdraw} 
                  size="lg"
                  className="w-full gap-2 h-12 text-lg bg-primary hover:bg-primary/90"
                  disabled={bxlBtcBalance === 0}
                >
                  <ArrowUpFromLine className="w-5 h-5" />
                  Request Withdrawal
                </Button>
              </>
            ) : (
              // Step 2 & 3: Manage active withdrawal request with tabs
              <>
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Active Request</p>
                    <p className="text-xl font-bold text-primary">
                      {formatBtc(bxlBtcTransitionBalance)} sBTC
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      In transit
                    </p>
                  </div>

                  <Tabs defaultValue="finalize" className="w-full" onValueChange={setActiveRequestTab}>
                    <TabsList className="grid w-full grid-cols-3 h-10">
                      <TabsTrigger 
                        value="finalize"
                        className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Finalize
                      </TabsTrigger>
                      <TabsTrigger 
                        value="update"
                        className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Update
                      </TabsTrigger>
                      <TabsTrigger 
                        value="cancel"
                        className="text-xs data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Cancel
                      </TabsTrigger>
                    </TabsList>

                    {/* Finalize Tab */}
                    <TabsContent value="finalize" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Request ID"
                          value={requestId}
                          onChange={(e) => setRequestId(e.target.value)}
                          className="text-lg text-center h-12"
                        />
                        <p className="text-xs text-muted-foreground text-center">
                          Enter your withdrawal request ID
                        </p>
                      </div>
                      <Button 
                        onClick={handleSBtcFinalize} 
                        size="lg"
                        className="w-full gap-2 h-12 text-lg bg-primary hover:bg-primary/90"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Finalize Withdrawal
                      </Button>
                    </TabsContent>

                    {/* Update Tab */}
                    <TabsContent value="update" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Request ID"
                          value={requestId}
                          onChange={(e) => setRequestId(e.target.value)}
                          className="text-lg text-center h-12"
                        />
                        <p className="text-xs text-muted-foreground text-center">
                          Enter your withdrawal request ID
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="0.00000000"
                          value={sBtcAmount}
                          onChange={(e) => setSBtcAmount(e.target.value)}
                          className="text-xl text-center h-14"
                        />
                        <p className="text-sm text-muted-foreground text-center">
                          New total amount (Current: {formatBtc(bxlBtcTransitionBalance)})
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                          Available to add: {formatBtc(bxlBtcBalance)} bxlBTC
                        </p>
                      </div>
                      <Button 
                        onClick={handleSBtcUpdate} 
                        size="lg"
                        className="w-full gap-2 h-12 text-lg bg-primary hover:bg-primary/90"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Update Amount
                      </Button>
                    </TabsContent>

                    {/* Cancel Tab */}
                    <TabsContent value="cancel" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Request ID"
                          value={requestId}
                          onChange={(e) => setRequestId(e.target.value)}
                          className="text-lg text-center h-12"
                        />
                        <p className="text-xs text-muted-foreground text-center">
                          Enter your withdrawal request ID
                        </p>
                      </div>
                      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                        <p className="text-sm text-destructive font-semibold mb-1">
                          Cancel Withdrawal
                        </p>
                        <p className="text-xs text-muted-foreground">
                          This will cancel your withdrawal request and return your {formatBtc(bxlBtcTransitionBalance)} sBTC in transit back into the vault.
                        </p>
                      </div>
                      <Button 
                        onClick={handleSBtcCancel} 
                        size="lg"
                        variant="destructive"
                        className="w-full gap-2 h-12 text-lg"
                      >
                        <XCircle className="w-5 h-5" />
                        Cancel Request
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
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
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Available: {formatStx(bxlStxBalance)} bxlSTX
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setStxAmount(bxlStxBalance.toString())}
                  disabled={bxlStxBalance === 0}
                >
                  Max
                </Button>
              </div>
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
