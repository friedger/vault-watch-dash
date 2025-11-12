import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useBalances } from "@/hooks/useBalances";
import { formatBtc } from "@/lib/utils";
import {
  adminFinalizeSbtcWithdraw,
  delegateStx,
  enrollDualStacking,
  fetchWithdrawalRequest,
  revokeStacking,
  transferSbtcYield,
  type WithdrawalRequest,
} from "@/services/blockchain";
import { AlertCircle, CheckCircle, Coins, Lock, Send, Shield, Unlock } from "lucide-react";
import { useState } from "react";

// Admin wallet addresses - replace with actual admin addresses
const ADMIN_ADDRESSES = [
  "SPBX1F9B4G87C3R6H4N82RRHBS2Q5523QMDV38QF",
  // Add more admin addresses here
];

const Admin = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { data: userBalances } = useBalances(userAddress);
  const { toast } = useToast();

  // Move sBTC form
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  // Finalize withdrawal form
  const [finalizeRequestId, setFinalizeRequestId] = useState("");
  const [withdrawalRequest, setWithdrawalRequest] = useState<WithdrawalRequest | null>(null);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  // Check if user is admin
  const isAdmin = userAddress && ADMIN_ADDRESSES.includes(userAddress);

  const sBtcBalance = userBalances?.sBtc ?? 0;
  const stxBalance = userBalances?.stx ?? 0;

  const handleEnrollDualStacking = async () => {
    const result = await enrollDualStacking();
    if (result.txid) {
      toast({
        title: "Dual Stacking Enrollment",
        description: `Enrolling for the next cycle.`,
      });
    }
  };

  const handleMovesBTC = async () => {
    if (!transferAddress || !transferAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    const result = await transferSbtcYield(
      parseFloat(transferAmount),
      transferAddress
    );
    if (result.txid) {
      toast({
        title: "sBTC Transfer",
        description: `Moving ${transferAmount} sBTC to ${transferAddress.substring(
          0,
          8
        )}. ${result.txid}`,
      });
    }
  };

  const handleStackVault = async () => {
    const result = await delegateStx();
    if (result.txid) {
      toast({
        title: "Vault Stacking",
        description: "Initiating vault stacking operation",
      });
    }
  };

  const handleRevokeStacking = async () => {
    const result = await revokeStacking();
    if (result.txid) {
      toast({
        title: "Revoke Stacking",
        description: "Revoking stacking delegation",
      });
    }
  };

  const handleFetchRequest = async () => {
    const reqId = parseInt(finalizeRequestId);
    if (isNaN(reqId) || reqId <= 0) {
      toast({
        title: "Invalid Request ID",
        description: "Please enter a valid request ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingRequest(true);
    try {
      const request = await fetchWithdrawalRequest(reqId);
      if (request) {
        setWithdrawalRequest(request);
        toast({
          title: "Request Found",
          description: `Found withdrawal request for ${request.owner.substring(0, 8)}...`,
        });
      } else {
        setWithdrawalRequest(null);
        toast({
          title: "Request Not Found",
          description: "No withdrawal request found with this ID",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch withdrawal request",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleAdminFinalize = async () => {
    if (!withdrawalRequest) {
      toast({
        title: "Error",
        description: "Please fetch request details first",
        variant: "destructive",
      });
      return;
    }

    const reqId = parseInt(finalizeRequestId);
    try {
      const result = await adminFinalizeSbtcWithdraw(
        reqId,
        withdrawalRequest.owner,
        withdrawalRequest.amount
      );
      if (result.txid) {
        toast({
          title: "Withdrawal Finalized",
          description: `Finalized ${formatBtc(withdrawalRequest.amount)} sBTC for ${withdrawalRequest.owner.substring(0, 8)}...`,
        });
        setFinalizeRequestId("");
        setWithdrawalRequest(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to finalize withdrawal",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userAddress={userAddress}
        onAddressChange={setUserAddress}
        sBtcBalance={sBtcBalance}
        stxBalance={stxBalance}
        bxlBTC={userBalances?.bxlBTC ?? 0}
        bxlSTX={userBalances?.bxlSTX ?? 0}
        pageTitle="Vault Administration"
        backLink="/"
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!userAddress ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in min-h-[60vh]">
            <Shield className="w-24 h-24 text-primary" />
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Admin Access Required</h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Connect your wallet to access admin functions
              </p>
            </div>
          </div>
        ) : !isAdmin ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in min-h-[60vh]">
            <Shield className="w-24 h-24 text-destructive" />
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground text-lg max-w-md">
                This wallet address does not have admin privileges
              </p>
              <p className="text-sm text-muted-foreground font-mono bg-muted px-4 py-2 rounded">
                {userAddress}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Shield className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Admin Panel</h2>
              </div>
              <p className="text-muted-foreground">
                Manage vault stacking and operations
              </p>
            </div>

            <Tabs defaultValue="yield" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="yield" className="gap-2">
                  <Coins className="w-4 h-4" />
                  Yield
                </TabsTrigger>
                <TabsTrigger value="withdrawals" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Withdrawals
                </TabsTrigger>
                <TabsTrigger value="stacking" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Stacking
                </TabsTrigger>
              </TabsList>

              {/* Yield Management Tab */}
              <TabsContent value="yield" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transfer sBTC Yield</CardTitle>
                    <CardDescription>
                      Transfer earned sBTC yield to another address
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="transfer-address">Recipient Address</Label>
                      <Input
                        id="transfer-address"
                        type="text"
                        placeholder="SP..."
                        value={transferAddress}
                        onChange={(e) => setTransferAddress(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transfer-amount">Amount (sBTC)</Label>
                      <Input
                        id="transfer-amount"
                        type="number"
                        placeholder="0.00000000"
                        step="0.00000001"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleMovesBTC} className="w-full" size="lg">
                      <Send className="w-4 h-4 mr-2" />
                      Transfer sBTC
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Withdrawals Tab */}
              <TabsContent value="withdrawals" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Finalize User Withdrawal</CardTitle>
                    <CardDescription>
                      Finalize a user's withdrawal request early
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="finalize-request-id">Request ID</Label>
                      <div className="flex gap-2">
                        <Input
                          id="finalize-request-id"
                          type="number"
                          placeholder="Enter request ID"
                          value={finalizeRequestId}
                          onChange={(e) => {
                            setFinalizeRequestId(e.target.value);
                            setWithdrawalRequest(null);
                          }}
                        />
                        <Button 
                          onClick={handleFetchRequest}
                          disabled={isLoadingRequest}
                          variant="outline"
                        >
                          {isLoadingRequest ? "Loading..." : "Fetch"}
                        </Button>
                      </div>
                    </div>

                    {withdrawalRequest && (
                      <div className="space-y-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-semibold">Request Details</p>
                            <div className="text-xs space-y-1">
                              <p>
                                <span className="text-muted-foreground">Owner: </span>
                                <span className="font-mono">{withdrawalRequest.owner}</span>
                              </p>
                              <p>
                                <span className="text-muted-foreground">Amount: </span>
                                <span className="font-semibold">{formatBtc(withdrawalRequest.amount)} sBTC</span>
                              </p>
                              <p>
                                <span className="text-muted-foreground">Block: </span>
                                <span className="font-mono">{withdrawalRequest.blockHeight}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={handleAdminFinalize}
                      className="w-full"
                      size="lg"
                      disabled={!withdrawalRequest}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalize Withdrawal
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Stacking Management Tab */}
              <TabsContent value="stacking" className="space-y-6 mt-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Enroll in Dual Stacking</CardTitle>
                      <CardDescription>
                        Enroll the vault in dual stacking to earn BTC yield
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={handleEnrollDualStacking} className="w-full" size="lg">
                        <Lock className="w-4 h-4 mr-2" />
                        Enroll Vault
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Delegate STX Stacking</CardTitle>
                      <CardDescription>
                        Initiate stacking delegation for the vault
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={handleStackVault} className="w-full" size="lg">
                        <Lock className="w-4 h-4 mr-2" />
                        Stack Vault Assets
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revoke Stacking</CardTitle>
                      <CardDescription>
                        Revoke stacking delegation and unlock assets
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={handleRevokeStacking}
                        variant="destructive"
                        className="w-full"
                        size="lg"
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        Revoke Stacking
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
