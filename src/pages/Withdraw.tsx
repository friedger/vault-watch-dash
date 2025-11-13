import { Layout } from "@/components/Layout";
import { useLayout } from "@/contexts/LayoutContext";
import { WithdrawCard } from "@/components/WithdrawCard";
import { ActiveWithdrawalInfo } from "@/components/ActiveWithdrawalInfo";
import {
  withdrawSBtc,
  withdrawStx,
  withdrawSBtcUpdate,
  finalizeSbtcWithdraw,
} from "@/services/blockchain";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

const WithdrawContent = () => {
  const { requestId } = useParams<{ requestId?: string }>();
  const { userAddress, userBalances } = useLayout();
  const { toast } = useToast();

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

  return (
    <main className="container mx-auto px-4 py-8 animate-fade-in">
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
  );
};

const Withdraw = () => (
  <Layout showBanner={false}>
    <WithdrawContent />
  </Layout>
);

export default Withdraw;
