import { Layout } from "@/components/Layout";
import { useLayout } from "@/contexts/LayoutContext";
import { MarketingView } from "@/components/home/MarketingView";
import { PortfolioChart } from "@/components/PortfolioChart";
import { TransactionHistory } from "@/components/TransactionHistory";

const WalletContent = () => {
  const { userAddress, userBalances } = useLayout();

  return (
    <main className="container mx-auto px-4 py-8 space-y-16">
      {!userAddress ? (
        <MarketingView />
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Your Wallet</h1>
            <p className="text-muted-foreground text-lg">
              Track your portfolio and transaction history
            </p>
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
      )}
    </main>
  );
};

const Wallet = () => (
  <Layout showBanner={false}>
    <WalletContent />
  </Layout>
);

export default Wallet;
