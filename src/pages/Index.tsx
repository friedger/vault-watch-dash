import daoLogo from "@/assets/dao-logo.png";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SupportedProjects } from "@/components/SupportedProjects";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { VaultOverviewCards } from "@/components/VaultOverviewCards";
import { useBalances } from "@/hooks/useBalances";
import {
  BXL_BTC_CONTRACT,
  BXL_STX_CONTRACT,
  VAULT_CONTRACT,
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
  GraduationCap
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTutorial } from "@/components/tutorial/TutorialContext";

const Index = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { startTutorial, state } = useTutorial();

  // Show tutorial for first-time users
  useEffect(() => {
    if (!state.isCompleted && !state.skipped && !state.isActive) {
      const hasVisited = localStorage.getItem('bxl-vault-has-visited');
      if (!hasVisited) {
        localStorage.setItem('bxl-vault-has-visited', 'true');
      }
    }
  }, [state]);

  // Fetch vault balances (always)
  const { data: vaultBalances } = useBalances(VAULT_CONTRACT);

  // Fetch user balances (when connected)
  const { data: userBalances } = useBalances(userAddress);

  // Use vault balances for display, or fallback to 0
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
        pageTitle="Vault Dashboard"
        showDashboardLink={true}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Vault Overview - Only for vault when not logged in */}
        {!userAddress && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <VaultOverviewCards />
          </div>
        )}

        {!userAddress ? (
          <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center space-y-6">
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
            <div className="max-w-4xl mx-auto space-y-8">
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
                    the owner and can withdraw anytime.{" "}
                    <a
                      href="/connect"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Connect Wallet.
                    </a>
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
                    community projects and initiatives.
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
            <div className="max-w-4xl mx-auto space-y-8">
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
            <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
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
                Deposit your Bitcoin to support community projects, or withdraw
                when needed. You keep full ownership and can access your Bitcoin
                anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/deposit">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Deposit Assets
                  </Button>
                </Link>
                <Link to="/vault">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    View Vault
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

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
                  <strong>Yes!</strong> You can withdraw your Bitcoin whenever
                  you want. When you deposit, you receive wrapped tokens
                  (bxlBTC) that represent your ownership in the vault.
                </p>
                <p>
                  <strong>Important security feature:</strong> Withdrawal
                  requests have a 1-week waiting period before they're
                  finalized. This protects you from wrench attacks—if someone
                  forces you to request a withdrawal, you have time to cancel it
                  once you're safe.
                </p>
                <p className="text-sm bg-muted/50 rounded p-3">
                  💡 <strong>Pro tip:</strong> You can ask the community
                  stewards to immediately execute your withdrawal request if
                  needed.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>How does the community benefit?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  When you deposit your Bitcoin in the vault, it participates in{" "}
                  <strong>Dual Stacking</strong>, which generates Bitcoin
                  rewards. All the yield from these rewards goes directly to
                  fund Brussels Crypto Community initiatives.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  <p className="font-semibold">How it works:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      Your sBTC and some STX are pooled together in the vault
                    </li>
                    <li>
                      The vault participates in Dual Stacking to earn BTC
                      rewards
                    </li>
                    <li>You keep 100% ownership of your deposited assets</li>
                    <li>
                      The earned yield funds community projects, events, and
                      development
                    </li>
                    <li>
                      Community stewards decide how to allocate the rewards
                    </li>
                  </ul>
                </div>
                <p>
                  It's a sustainable funding model—no one-time donations needed,
                  just your assets working for the community while remaining
                  yours.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Is this safe? What are the risks?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  We believe in transparency. While we've built this with
                  security in mind, it's important to understand the risks
                  involved:
                </p>
                <div className="space-y-3">
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                    <p className="font-semibold text-amber-700 dark:text-amber-400 mb-2">
                      Potential Risks:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                      <li>
                        <strong>Smart Contract Risk:</strong> Bugs in the code
                        could potentially affect funds
                      </li>
                      <li>
                        <strong>Market Risk:</strong> Bitcoin, sBTC and STX
                        prices can fluctuate
                      </li>
                      <li>
                        <strong>Stacking Risk:</strong> STX tokens participate
                        in Stacks stacking mechanism
                      </li>
                    </ul>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="font-semibold text-primary mb-2">
                      What we've done to protect you:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                      <li>
                        1-week withdrawal delay prevents instant theft under
                        coercion
                      </li>
                      <li>
                        You maintain ownership of your assets at all times
                      </li>
                      <li>Open-source smart contracts on Stacks blockchain</li>
                      <li>Community governance over yield allocation</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm">
                  <strong>Our advice:</strong> Only deposit what you're
                  comfortable with, and do your own research. This is about
                  community support, not maximum yield.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <span>Where are the smart contracts?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  All our smart contracts are deployed on the Stacks blockchain
                  and are fully transparent. You can verify them yourself:
                </p>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm break-all space-y-3">
                  <div>
                    <p className="mb-2 font-sans font-semibold">
                      Vault Contract:
                    </p>
                    <code className="text-xs">{VAULT_CONTRACT}</code>
                  </div>
                  <div>
                    <p className="mb-2 font-sans font-semibold">
                      Token Contracts:
                    </p>
                    <code className="text-xs block mb-1">
                      {BXL_BTC_CONTRACT}
                    </code>
                    <code className="text-xs block">
                      {BXL_STX_CONTRACT}
                    </code>
                  </div>
                </div>
                <p className="text-sm">
                  Being on a public blockchain means anyone can audit the code
                  and verify how it works. Transparency is key to trust.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Supported Projects Section */}
        <SupportedProjects />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
