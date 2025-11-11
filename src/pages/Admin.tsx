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
import { useToast } from "@/hooks/use-toast";
import { useBalances } from "@/hooks/useBalances";
import {
  delegateStx,
  enrollDualStacking,
  revokeStacking,
  transferSbtcYield,
} from "@/services/blockchain";
import { Lock, Send, Shield, Unlock } from "lucide-react";
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

  // Dual Stacking form
  const [stackingAmount, setStackingAmount] = useState("");
  const [stackingCycles, setStackingCycles] = useState("");

  // Move sBTC form
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

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

  return (
    <div className="min-h-screen bg-background">
      <Header
        userAddress={userAddress}
        onAddressChange={setUserAddress}
        sBtcBalance={sBtcBalance}
        stxBalance={stxBalance}
        bxlBTC={userBalances?.bxlBTC ?? 0}
        blxSTX={userBalances?.blxSTX ?? 0}
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
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Shield className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Admin Panel</h2>
              </div>
              <p className="text-muted-foreground">
                Manage vault stacking and operations
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dual Stacking Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Enroll Dual Stacking
                  </CardTitle>
                  <CardDescription>
                    Enroll the vault in dual stacking to earn BTC yield
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stacking-amount">Amount (STX)</Label>
                    <Input
                      id="stacking-amount"
                      type="number"
                      placeholder="0.00"
                      value={stackingAmount}
                      onChange={(e) => setStackingAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stacking-cycles">Number of Cycles</Label>
                    <Input
                      id="stacking-cycles"
                      type="number"
                      placeholder="1"
                      value={stackingCycles}
                      onChange={(e) => setStackingCycles(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleEnrollDualStacking} className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Enroll Vault
                  </Button>
                </CardContent>
              </Card>

              {/* Move sBTC Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Move sBTC from Yield
                  </CardTitle>
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
                  <Button onClick={handleMovesBTC} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Transfer sBTC
                  </Button>
                </CardContent>
              </Card>

              {/* Stacking Management Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Stack Vault
                  </CardTitle>
                  <CardDescription>
                    Initiate stacking operation for the vault
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleStackVault} className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Stack Vault Assets
                  </Button>
                </CardContent>
              </Card>

              {/* Revoke Stacking Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Unlock className="w-5 h-5" />
                    Revoke Stacking
                  </CardTitle>
                  <CardDescription>
                    Revoke stacking delegation and unlock assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleRevokeStacking}
                    variant="destructive"
                    className="w-full"
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Revoke Stacking
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
