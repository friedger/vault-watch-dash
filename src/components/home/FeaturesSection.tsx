export const FeaturesSection = () => {
  return (
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
  );
};
