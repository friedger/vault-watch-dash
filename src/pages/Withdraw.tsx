import { useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { WithdrawCard } from "@/components/WithdrawCard";
import { ActiveWithdrawalInfo } from "@/components/ActiveWithdrawalInfo";
import { useBalances } from "@/hooks/useBalances";
import { useToast } from "@/hooks/use-toast";
import {
  withdrawSBtc,
  withdrawStx,
  withdrawSBtcUpdate,
  finalizeSbtcWithdraw,
} from "@/services/blockchain";

const Withdraw = () => {
  const { requestId } = useParams();
  const { toast } = useToast();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { data: userBalances } = useBalances(userAddress);

  // Helper function to ensure user address is available
  const withUserAddressCheck = <T extends any[]>(
    action: (address: string, ...args: T) => void,
    errorMessage: string = "Please connect your wallet to perform this action"
  ) => {
    return (...args: T) => {
      if (userAddress) {
        action(userAddress, ...args);
      } else {
        toast({
          title: "Wallet not connected",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };
  };

  const handleSBtcWithdraw = withUserAddressCheck(
    (address: string, amount: number) => withdrawSBtc(amount, address),
    "Please connect your wallet to withdraw sBTC"
  );

  const handleSBtcUpdate = withUserAddressCheck(
    (address: string, requestId: number, oldAmount: number, newAmount: number) =>
      withdrawSBtcUpdate(requestId, oldAmount, newAmount, address),
    "Please connect your wallet to update withdrawal"
  );

  const handleSBtcFinalize = withUserAddressCheck(
    (address: string, requestId: number, amount: number) =>
      finalizeSbtcWithdraw(requestId, amount, address),
    "Please connect your wallet to finalize withdrawal"
  );

  const handleStxWithdraw = withUserAddressCheck(
    (address: string, amount: number) => withdrawStx(amount, address),
    "Please connect your wallet to withdraw STX"
  );

  const isAdmin = false; // Not implemented yet

  const sBtcBalance = userBalances?.sBtc ?? 0;
  const stxBalance = userBalances?.stx ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header
        userAddress={userAddress}
        onAddressChange={setUserAddress}
        sBtcBalance={sBtcBalance}
        stxBalance={stxBalance}
        bxlBTC={userBalances?.bxlBTC ?? 0}
        bxlSTX={userBalances?.bxlSTX ?? 0}
      />
      <Navigation userAddress={userAddress} isAdmin={isAdmin} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Manage Withdrawals</h1>
            <p className="text-muted-foreground">
              Request, update, or finalize your asset withdrawals
            </p>
          </div>

          {!userAddress ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Please connect your wallet to manage withdrawals
              </p>
            </div>
          ) : (
            <>
              <ActiveWithdrawalInfo amount={userBalances?.bxlBTCTransit ?? 0} />

              <WithdrawCard
                onSBtcWithdraw={handleSBtcWithdraw}
                onSBtcRequestUpdate={handleSBtcUpdate}
                onSBtcFinalize={handleSBtcFinalize}
                onStxWithdraw={handleStxWithdraw}
                bxlBtcBalance={userBalances?.bxlBTC ?? 0}
                bxlBtcTransitionBalance={userBalances?.bxlBTCTransit ?? 0}
                bxlStxBalance={userBalances?.bxlSTX ?? 0}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Withdraw;
