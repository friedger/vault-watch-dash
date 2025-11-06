import { useState } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { BalanceCard } from "@/components/BalanceCard";
import { DepositWithdrawCard } from "@/components/DepositWithdrawCard";
import { Bitcoin, Coins, Lock, TrendingUp } from "lucide-react";
import daoLogo from "@/assets/dao-logo.png";

const Index = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [sBtcBalance, setSBtcBalance] = useState(0);
  const [stxBalance, setStxBalance] = useState(0);
  const [lockedStx, setLockedStx] = useState(0);
  const [depositedSBtc, setDepositedSBtc] = useState(0);

  const handleSBtcDeposit = (amount: number) => {
    setSBtcBalance(prev => prev + amount);
    setDepositedSBtc(prev => prev + amount);
  };

  const handleSBtcWithdraw = (amount: number) => {
    if (amount <= sBtcBalance) {
      setSBtcBalance(prev => prev - amount);
      setDepositedSBtc(prev => Math.max(0, prev - amount));
    }
  };

  const handleStxDeposit = (amount: number) => {
    setStxBalance(prev => prev + amount);
  };

  const handleStxWithdraw = (amount: number) => {
    const availableStx = stxBalance - lockedStx;
    if (amount <= availableStx) {
      setStxBalance(prev => prev - amount);
    }
  };

  // Calculate earned yield (vault sBTC - deposited sBTC)
  const earnedYield = Math.max(0, sBtcBalance - depositedSBtc);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={daoLogo} 
                alt="DAO Brussels" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  DAO Brussels
                </h1>
                <p className="text-sm text-muted-foreground">Vault Dashboard</p>
              </div>
            </div>
            <WalletConnect onAddressChange={setUserAddress} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!userAddress ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <img 
                src={daoLogo} 
                alt="DAO Brussels" 
                className="h-32 w-32 object-contain relative z-10"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Welcome to DAO Brussels Vault</h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Connect your Stacks wallet to manage your sBTC and STX deposits, 
                track your yields, and participate in the vault.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Balance Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Balance Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <BalanceCard
                  title="sBTC Balance"
                  balance={`${sBtcBalance.toFixed(8)} sBTC`}
                  icon={<Bitcoin className="w-5 h-5 text-primary" />}
                />
                <BalanceCard
                  title="STX Balance"
                  balance={`${stxBalance.toLocaleString()} STX`}
                  subBalance={`${lockedStx.toLocaleString()} STX`}
                  subLabel="Locked"
                  icon={<Coins className="w-5 h-5 text-secondary" />}
                />
                <BalanceCard
                  title="Locked STX"
                  balance={`${lockedStx.toLocaleString()} STX`}
                  icon={<Lock className="w-5 h-5 text-muted-foreground" />}
                />
                <BalanceCard
                  title="Earned Yield"
                  balance={`${earnedYield.toFixed(8)} sBTC`}
                  icon={<TrendingUp className="w-5 h-5 text-primary" />}
                  isYield
                />
              </div>
            </div>

            {/* Deposit/Withdraw Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Vault Operations</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DepositWithdrawCard
                  tokenType="sBTC"
                  onDeposit={handleSBtcDeposit}
                  onWithdraw={handleSBtcWithdraw}
                />
                <DepositWithdrawCard
                  tokenType="STX"
                  onDeposit={handleStxDeposit}
                  onWithdraw={handleStxWithdraw}
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="gradient-card border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">About the Vault</h3>
              <p className="text-muted-foreground">
                The DAO Brussels Vault allows you to deposit sBTC and STX tokens to earn yield. 
                Your deposited sBTC generates returns over time, while STX tokens can be locked 
                for governance participation. Monitor your earnings and manage your positions easily 
                through this dashboard.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
