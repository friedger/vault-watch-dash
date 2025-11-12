import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { VaultOverviewCards } from "@/components/VaultOverviewCards";
import { SupportedProjects } from "@/components/SupportedProjects";
import { WithdrawCard } from "@/components/WithdrawCard";
import { PortfolioChart } from "@/components/PortfolioChart";
import { TransactionHistory } from "@/components/TransactionHistory";
import daoLogo from "@/assets/dao-logo.png";
import { useBalances } from "@/hooks/useBalances";
import { 
  VAULT_CONTRACT,
  withdrawSBtc, 
  withdrawStx, 
  withdrawSBtcUpdate, 
  finalizeSbtcWithdraw 
} from "@/services/blockchain";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Bitcoin,
  Coins,
  ExternalLink,
  LayoutDashboard,
  Lock,
  Shield,
  TrendingDown,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { useTutorial } from "@/components/tutorial/TutorialContext";

const Index = () => {
  const { toast } = useToast();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { startTutorial, state } = useTutorial();
  const { data: vaultBalances } = useBalances(VAULT_CONTRACT);
  const { data: userBalances } = useBalances(userAddress);

  // Show tutorial for first-time users
  useEffect(() => {
    if (!state.isCompleted && !state.skipped && !state.isActive) {
      const hasVisited = localStorage.getItem('bxl-vault-has-visited');
      if (!hasVisited) {
        localStorage.setItem('bxl-vault-has-visited', 'true');
      }
    }
  }, [state]);

  // Helper function to ensure user address is available before executing action
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
    (address: string, requestId: number, amount: number) => finalizeSbtcWithdraw(requestId, amount, address),
    "Please connect your wallet to finalize withdrawal"
  );

  const handleStxWithdraw = withUserAddressCheck(
    (address: string, amount: number) => withdrawStx(amount, address),
    "Please connect your wallet to withdraw STX"
  );

  const isAdmin = false; // Not implemented yet

  // Use vault balances for display when not connected, or fallback to 0
  const displayBalances = userAddress ? userBalances : vaultBalances;
  const sBtcBalance = displayBalances?.sBtc ?? 0;
  const stxBalance = displayBalances?.stx ?? 0;

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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-16">
        {!userAddress ? (
          <>
            {/* Vault Overview Cards */}
            <div className="max-w-5xl mx-auto animate-fade-in">
              <VaultOverviewCards />
            </div>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                <img
                  src={daoLogo}
                  alt="DAO Brussels"
                  className="h-32 w-32 object-contain relative z-10"
                />
              </div>
              <div className="space-y-4 max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Support the Brussels Crypto Community
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Deposit your Bitcoin. Keep ownership. Fund your community.
                </p>
                <p className="text-lg text-foreground/80 max-w-2xl mx-auto italic">
                  "The safest place to store your Bitcoin is your community."
                </p>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold">How It Works</h3>
                <p className="text-muted-foreground">
                  Three simple steps to support your community
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    1
                  </div>
                  <h4 className="text-xl font-semibold">Wrap Your Bitcoin</h4>
                  <p className="text-muted-foreground">
                    Convert your Bitcoin to sBTC on the Stacks blockchain.{" "}
                    <a
                      href="https://sbtc.stacks.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Learn how
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    2
                  </div>
                  <h4 className="text-xl font-semibold">
                    Deposit in the Vault
                  </h4>
                  <p className="text-muted-foreground">
                    Store securely your Bitcoin into the BXL Vault. You remain
                    the owner and can withdraw anytime.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    3
                  </div>
                  <h4 className="text-xl font-semibold">
                    Yield Goes to Community
                  </h4>
                  <p className="text-muted-foreground">
                    Stacking rewards automatically fund Brussels crypto
                    community projects and initiatives.{" "}
                    <a
                      href="/vault"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      See transactions.
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Main Features Section */}
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold">Why Using BXL Vault?</h3>
                <p className="text-muted-foreground">
                  Built with your security and community in mind
                </p>
              </div>

              <div className="space-y-4">
                {/* Protection Feature */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🔧</div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-xl font-semibold flex items-center gap-2">
                        Protection Against Wrench Attack
                      </h4>
                      <p className="text-foreground/80">
                        Your Bitcoin is protected by design. If someone tries to
                        force you to transfer your Bitcoin, you have{" "}
                        <strong>
                          one week to cancel any withdrawal request
                        </strong>
                        . This gives you time to reach safety and secure your
                        assets, making physical coercion practically useless.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Community Yield Feature */}
                <div className="bg-gradient-to-r from-secondary/5 to-secondary/10 border border-secondary/20 rounded-lg p-6 space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🤝</div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-xl font-semibold">
                        Yield for the Community
                      </h4>
                      <p className="text-foreground/80">
                        No need to donate. <strong>You keep your assets</strong>
                        —you just make them available for your community to fund
                        itself. It's like owning a house and letting your
                        community use it for free. You're still the owner, but
                        everyone benefits from what it produces.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tax Feature */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-6 space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">💰</div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-xl font-semibold">
                        Non-Taxable Event
                      </h4>
                      <p className="text-foreground/80">
                        When you receive yield directly, taxes get complicated
                        quickly. Is it really worth it? Use this as an{" "}
                        <strong>endowment model</strong> instead—the yield goes
                        directly to your community, keeping things simple while
                        maximizing impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-2xl mx-auto text-center space-y-6 py-8 animate-fade-in">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">
                  Ready to Support Your Community?
                </h3>
                <p className="text-muted-foreground">
                  Connect your wallet to get started. You'll be able to deposit
                  your sBTC and contribute to building the Brussels crypto
                  community.
                </p>
              </div>
              {!state.isCompleted && !state.skipped && (
                <Button 
                  onClick={startTutorial}
                  size="lg"
                  variant="outline"
                  className="gap-2"
                >
                  <GraduationCap className="w-5 h-5" />
                  New User? Start Tutorial
                </Button>
              )}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Common Questions</h2>
                <p className="text-muted-foreground">
                  Everything you need to know about using BXL Vault
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-0">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-primary" />
                      <span>What is bxlBTC?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      <strong>bxlBTC</strong> is the token you receive when you
                      deposit Bitcoin into the BXL Vault. It represents your share
                      of Bitcoin in the vault.
                    </p>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="font-semibold mb-2">The backing chain:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>
                          <strong>BTC</strong> (Bitcoin) - The original Bitcoin on
                          the Bitcoin blockchain
                        </li>
                        <li>
                          <strong>sBTC</strong> - Wrapped Bitcoin on Stacks, backed
                          1:1 by BTC
                        </li>
                        <li>
                          <strong>bxlBTC</strong> - Your vault receipt token, backed
                          1:1 by sBTC
                        </li>
                      </ul>
                    </div>
                    <p>
                      Think of bxlBTC as your receipt that proves you deposited
                      Bitcoin. You can redeem your bxlBTC anytime to get your sBTC
                      back (which itself can be converted back to BTC).
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Bitcoin className="w-5 h-5 text-primary" />
                      <span>What is sBTC and why do I need it?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      <strong>sBTC (Stacks Bitcoin)</strong> is Bitcoin that lives
                      on the Stacks blockchain, allowing it to be used in smart
                      contracts while staying fully backed 1:1 by real Bitcoin.
                    </p>
                    <p>
                      Think of it as a "wrapped" version of your Bitcoin that can
                      interact with decentralized applications. It's still your
                      Bitcoin—just in a form that can participate in stacking and
                      other DeFi activities.
                    </p>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="font-semibold mb-2">Key points:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Every sBTC is backed by real Bitcoin</li>
                        <li>You can convert back to regular Bitcoin anytime</li>
                        <li>It's decentralized—no company controls it</li>
                        <li>You can use it to earn stacking rewards</li>
                      </ul>
                    </div>
                    <a
                      href="https://sbtc.stacks.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                    >
                      Learn how to get sBTC
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-primary" />
                      <span>Can I withdraw my Bitcoin anytime?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      <strong>Yes!</strong> You keep full ownership of your Bitcoin
                      and can request a withdrawal at any time. Here's how the
                      withdrawal process works:
                    </p>
                    <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
                      <ol className="list-decimal list-inside space-y-2 ml-2">
                        <li>
                          You submit a withdrawal request (your bxlBTC is locked)
                        </li>
                        <li>
                          There's a <strong>1-week waiting period</strong> for
                          security
                        </li>
                        <li>
                          After the week, you can finalize and receive your sBTC
                        </li>
                        <li>
                          You can <strong>cancel anytime</strong> during the waiting
                          period
                        </li>
                      </ol>
                    </div>
                    <p>
                      The 1-week delay is a <strong>wrench attack protection</strong> feature. If someone tries to force you to withdraw, you
                      have time to reach safety and cancel the request. Community
                      stewards can also help process legitimate withdrawals faster.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span>How does the vault generate yield?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      The BXL Vault generates yield through{" "}
                      <strong>Dual Stacking</strong>, a unique mechanism on the
                      Stacks blockchain that combines two types of stacking:
                    </p>
                    <div className="space-y-3">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="font-semibold mb-2">
                          1. sBTC Stacking (Bitcoin Rewards)
                        </p>
                        <p className="text-sm">
                          Your deposited sBTC participates in the Stacks
                          Proof-of-Transfer consensus, earning Bitcoin as rewards.
                          These rewards go directly to the community fund.
                        </p>
                      </div>
                      <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
                        <p className="font-semibold mb-2">
                          2. STX Delegation (Amplified Rewards)
                        </p>
                        <p className="text-sm">
                          Optional STX deposits are delegated to stacking pools,
                          boosting the overall yield generated for community
                          projects.
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">
                      All yield is automatically allocated to the DAO Brussels
                      treasury and used to fund community initiatives, events, and
                      infrastructure.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span>Is my Bitcoin safe in the vault?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      The BXL Vault is built with multiple layers of security to
                      protect your Bitcoin:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="text-lg">🔐</div>
                        <div>
                          <strong>Non-custodial design</strong> - You maintain full
                          ownership through your bxlBTC tokens
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="text-lg">⏱️</div>
                        <div>
                          <strong>Time-delayed withdrawals</strong> - 1-week
                          protection against forced transfers
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="text-lg">🛡️</div>
                        <div>
                          <strong>Smart contract security</strong> - Deployed on
                          Stacks with transparent, auditable code
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="text-lg">🤝</div>
                        <div>
                          <strong>Community oversight</strong> - Managed by DAO
                          Brussels with multi-sig protection
                        </div>
                      </div>
                    </div>
                    <p className="text-sm italic">
                      Remember: "The safest place to store your Bitcoin is your
                      community."
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      <span>What is a wrench attack and how am I protected?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      A <strong>"$5 wrench attack"</strong> is when someone uses
                      physical force or threats to make you transfer your crypto.
                      Traditional wallets are vulnerable because transfers are
                      instant and irreversible.
                    </p>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="font-semibold mb-2">
                        How BXL Vault protects you:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                        <li>
                          Withdrawals require a <strong>1-week delay</strong>
                        </li>
                        <li>
                          You can <strong>cancel</strong> the request anytime during
                          the week
                        </li>
                        <li>
                          This gives you time to reach safety and secure your assets
                        </li>
                        <li>
                          Makes physical coercion practically useless since attackers
                          can't get instant access
                        </li>
                      </ul>
                    </div>
                    <p>
                      Even if forced to initiate a withdrawal, you can contact the
                      community or cancel the request once safe. Your Bitcoin stays
                      protected by time.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        ) : (
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
                onSBtcWithdraw={handleSBtcWithdraw}
                onSBtcRequestUpdate={handleSBtcUpdate}
                onSBtcFinalize={handleSBtcFinalize}
                onStxWithdraw={handleStxWithdraw}
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
        )}

        {/* Supported Projects Section - Always Visible */}
        <SupportedProjects />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
