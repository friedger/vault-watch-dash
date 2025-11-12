import { ExternalLink } from "lucide-react";

export const HowItWorksSection = () => {
  return (
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
  );
};
