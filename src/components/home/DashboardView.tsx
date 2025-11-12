import { WithdrawCard } from "@/components/WithdrawCard";
import { PortfolioChart } from "@/components/PortfolioChart";
import { TransactionHistory } from "@/components/TransactionHistory";
import daoLogo from "@/assets/dao-logo.png";

interface DashboardViewProps {
  userAddress: string;
  userBalances: {
    sBtc: number;
    stx: number;
    bxlBTC: number;
    bxlBTCTransit: number;
    bxlSTX: number;
  } | undefined;
  onSBtcWithdraw: (amount: number) => void;
  onSBtcRequestUpdate: (requestId: number, oldAmount: number, newAmount: number) => void;
  onSBtcFinalize: (requestId: number, amount: number) => void;
  onStxWithdraw: (amount: number) => void;
}

export const DashboardView = ({
  userAddress,
  userBalances,
  onSBtcWithdraw,
  onSBtcRequestUpdate,
  onSBtcFinalize,
  onStxWithdraw,
}: DashboardViewProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section for Connected Users */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          <img
            src={daoLogo}
            alt="DAO Brussels"
            className="h-24 w-24 object-contain relative z-10 mx-auto"
          />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Welcome Back! 👋
        </h2>
        <p className="text-muted-foreground text-lg">
          Manage your deposits, track your portfolio, and view your contribution to the Brussels crypto community.
        </p>
      </div>

      {/* Withdraw Card */}
      <div className="max-w-xl mx-auto">
        <WithdrawCard
          onSBtcWithdraw={onSBtcWithdraw}
          onSBtcRequestUpdate={onSBtcRequestUpdate}
          onSBtcFinalize={onSBtcFinalize}
          onStxWithdraw={onStxWithdraw}
          bxlBtcBalance={userBalances?.bxlBTC ?? 0}
          bxlBtcTransitionBalance={userBalances?.bxlBTCTransit ?? 0}
          bxlStxBalance={userBalances?.bxlSTX ?? 0}
        />
      </div>

      {/* Portfolio Chart */}
      <PortfolioChart
        sBtc={userBalances?.sBtc ?? 0}
        stx={userBalances?.stx ?? 0}
        bxlBTC={(userBalances?.bxlBTC ?? 0) + (userBalances?.bxlBTCTransit ?? 0)}
        bxlSTX={userBalances?.bxlSTX ?? 0}
      />

      {/* Transaction History */}
      <TransactionHistory userAddress={userAddress} />
    </div>
  );
};
