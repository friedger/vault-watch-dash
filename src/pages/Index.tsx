import daoLogo from "@/assets/dao-logo.png";
import { BalanceCard } from "@/components/BalanceCard";
import { DepositWithdrawCard } from "@/components/DepositWithdrawCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { useBalances } from "@/hooks/useBalances";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import {
  VAULT_CONTRACT,
  WRAPPED_BTC_CONTRACT,
  WRAPPED_STX_CONTRACT,
} from "@/services/blockchain";
import {
  Bitcoin,
  Coins,
  ExternalLink,
  LayoutDashboard,
  Lock,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);

  // Fetch vault balances (always)
  const { data: vaultBalances } = useBalances(VAULT_CONTRACT);

  // Fetch user balances (when connected)
  const { data: userBalances } = useBalances(userAddress);

  // Fetch total supply of wrapped BTC for yield calculation
  const { data: wrappedBtcSupply = 0 } = useTotalSupply(WRAPPED_BTC_CONTRACT);

  // Fetch total supply of wrapped STX
  const { data: wrappedStxSupply = 0 } = useTotalSupply(WRAPPED_STX_CONTRACT);

  // Use vault balances for display, or fallback to 0
  const displayBalances = userAddress ? userBalances : vaultBalances;
  const sBtcBalance = displayBalances?.sBtc ?? 0;
  const stxBalance = displayBalances?.stx ?? 0;

  // Calculate earned yield: vault sBTC - total supply of wrapped sBTC
  const earnedYield = Math.max(
    0,
    (vaultBalances?.sBtc ?? 0) - wrappedBtcSupply
  );

  const handleSBtcDeposit = (amount: number) => {
    // TODO: Implement actual deposit transaction
    console.log("Deposit sBTC:", amount);
  };

  const handleSBtcWithdraw = (amount: number) => {
    // TODO: Implement actual withdraw transaction
    console.log("Withdraw sBTC:", amount);
  };

  const handleStxDeposit = (amount: number) => {
    // TODO: Implement actual deposit transaction
    console.log("Deposit STX:", amount);
  };

  const handleStxWithdraw = (amount: number) => {
    // TODO: Implement actual withdraw transaction
    console.log("Withdraw STX:", amount);
  };

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
            <div className="flex items-center gap-4">
              {userAddress && (
                <Link to="/dashboard">
                  <Button variant="outline" className="gap-2 h-[68px]">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <WalletConnect
                onAddressChange={setUserAddress}
                sBtcBalance={sBtcBalance}
                stxBalance={stxBalance}
                bxlBTC={userBalances?.bxlBTC ?? 0}
                blxSTX={userBalances?.blxSTX ?? 0}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Balance Overview - Only for vault when not logged in */}
        {!userAddress && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Vault Balance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BalanceCard
                title="sBTC Balance"
                balance={`${sBtcBalance.toFixed(8)} sBTC`}
                subBalance={`${wrappedBtcSupply.toFixed(8)} bxlBTC`}
                subLabel="Total Supply"
                icon={<Bitcoin className="w-5 h-5 text-primary" />}
              />
              <BalanceCard
                title="STX Balance"
                balance={`${stxBalance.toLocaleString()} STX`}
                subBalance={`${(
                  displayBalances?.blxSTX ?? 0
                ).toLocaleString()} blxSTX`}
                subLabel="Total Supply"
                icon={<Coins className="w-5 h-5 text-secondary" />}
              />
              <BalanceCard
                title="Earned Yield"
                balance={`${earnedYield.toFixed(8)} sBTC`}
                icon={<TrendingUp className="w-5 h-5 text-primary" />}
                isYield
              />
            </div>
          </div>
        )}

        {!userAddress ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
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
                Contribute to the Commons by granting access to your assets
                while maintaining ownership. The DAO Brussels community
                generates yield from deposited assets, which stewards use to
                build and develop the Commons in Brussels.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Logo display when connected */}
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                <img
                  src={daoLogo}
                  alt="DAO Brussels"
                  className="h-32 w-32 object-contain relative z-10"
                />
              </div>
            </div>

            {/* Main Deposit Section */}
            <div className="max-w-xl mx-auto text-center space-y-4">
              <h2 className="text-2xl font-bold">Manage Your Assets</h2>
              <p className="text-muted-foreground">
                Deposit assets to contribute to the Commons or withdraw from
                your position
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/deposit">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Deposit Assets
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Withdraw Section - Only show if user has wrapped tokens */}
            {((userBalances?.bxlBTC ?? 0) > 0 ||
              (userBalances?.blxSTX ?? 0) > 0) && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Withdraw Assets</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(userBalances?.bxlBTC ?? 0) > 0 && (
                    <DepositWithdrawCard
                      tokenType="sBTC"
                      onDeposit={handleSBtcDeposit}
                      onWithdraw={handleSBtcWithdraw}
                    />
                  )}
                  {(userBalances?.blxSTX ?? 0) > 0 && (
                    <DepositWithdrawCard
                      tokenType="STX"
                      onDeposit={handleStxDeposit}
                      onWithdraw={handleStxWithdraw}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about the DAO Brussels Vault
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Bitcoin className="w-5 h-5 text-primary" />
                  <span>What is sBTC?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  <strong>sBTC (Stacks Bitcoin)</strong> is a decentralized,
                  programmable Bitcoin asset on the Stacks blockchain. It's a
                  1:1 Bitcoin-backed asset that brings Bitcoin's security and
                  value to DeFi applications.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  <p className="font-semibold">Key features:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <strong>1:1 Bitcoin backing:</strong> Each sBTC is fully
                      backed by real Bitcoin
                    </li>
                    <li>
                      <strong>Decentralized:</strong> No centralized custodian
                      holds your Bitcoin
                    </li>
                    <li>
                      <strong>Programmable:</strong> Use Bitcoin in smart
                      contracts and DeFi applications
                    </li>
                    <li>
                      <strong>Redeemable:</strong> Convert back to native
                      Bitcoin at any time
                    </li>
                  </ul>
                </div>
                <p>
                  By depositing sBTC into the DAO Brussels Vault, you're
                  contributing Bitcoin to earn stacking rewards while supporting
                  the development of the Commons in Brussels.
                </p>
                <a
                  href="https://sbtc.stacks.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                >
                  Learn more about sBTC
                  <ExternalLink className="w-4 h-4" />
                </a>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>What are the risks?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  While the vault is designed with security in mind, all DeFi
                  protocols carry inherent risks:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Smart Contract Risk:</strong> Potential
                    vulnerabilities in the smart contract code
                  </li>
                  <li>
                    <strong>Stacking Risk:</strong> Assets are locked in the
                    Stacks stacking mechanism to generate yield
                  </li>
                  <li>
                    <strong>Market Risk:</strong> Fluctuations in sBTC and STX
                    prices affect the value of your deposits
                  </li>
                  <li>
                    <strong>Governance Risk:</strong> Community stewards
                    allocate the earned yield to Commons projects
                  </li>
                </ul>
                <p className="text-sm">
                  Always deposit amounts you're comfortable with and do your own
                  research before participating.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <span>Which smart contracts are used?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  The DAO Brussels Vault uses the following smart contracts on
                  the Stacks blockchain:
                </p>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm break-all">
                  <p className="mb-2">
                    <strong>Vault Contract:</strong>
                  </p>
                  <code className="text-xs">{VAULT_CONTRACT}</code>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm break-all">
                  <p className="mb-2">
                    <strong>Token Contracts:</strong>
                  </p>
                  <code className="text-xs">{WRAPPED_BTC_CONTRACT}</code>
                  <br />
                  <code className="text-xs">{WRAPPED_STX_CONTRACT}</code>
                </div>
                <p className="text-sm">
                  All smart contracts are deployed on the Stacks blockchain and
                  can be verified on-chain.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  <span>
                    Can I always withdraw my sBTC without locking time?
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  <strong>Yes!</strong> You can withdraw your sBTC at any time
                  without any locking period. When you deposit sBTC or STX into
                  the vault, you receive wrapped tokens (bxlBTC or blxSTX) that
                  represent your ownership.
                </p>
                <p>
                  These wrapped tokens can be redeemed for the underlying assets
                  at any time through the withdraw function. There is no minimum
                  holding period or withdrawal lock.
                </p>
                <p className="text-sm">
                  Note: While the vault itself doesn't lock your funds, the
                  underlying stacking mechanism may have cycles, but this
                  doesn't prevent you from withdrawing your share of the vault's
                  assets.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Where does the yield come from?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  The yield is generated through <strong>dual stacking</strong>{" "}
                  on the Stacks blockchain. This innovative mechanism allows the
                  vault to earn Bitcoin rewards by stacking STX tokens while
                  simultaneously earning stacking rewards on the deposited sBTC.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  <p className="font-semibold">How it works:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Your sBTC and STX are pooled together in the vault</li>
                    <li>
                      The vault participates in Stacks stacking to earn BTC
                      rewards
                    </li>
                    <li>
                      Earned yield accumulates in the vault and is visible in
                      real-time
                    </li>
                    <li>
                      Community stewards allocate the yield to build the Commons
                      in Brussels
                    </li>
                  </ul>
                </div>
                <a
                  href="https://docs.stacks.co/nakamoto-upgrade/nakamoto-in-depth/stackers-and-stacking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                >
                  Learn more about dual stacking on Stacks
                  <ExternalLink className="w-4 h-4" />
                </a>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  );
};

export default Index;
