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
  Lock,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export const FAQSection = () => {
  return (
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
  );
};
