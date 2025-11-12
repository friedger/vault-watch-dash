import { TutorialStep, TutorialStepTitle, TutorialStepContent, TutorialStepList, TutorialStepListItem, TutorialStepHighlight } from '../TutorialStep';
import { Bitcoin, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const GetSBTCStep = () => {
  return (
    <TutorialStep>
      <TutorialStepTitle>Get sBTC (Wrapped Bitcoin)</TutorialStepTitle>
      
      <TutorialStepContent>
        <div className="bg-secondary/20 border border-secondary/40 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-secondary mt-0.5" />
            <div>
              <p className="font-semibold text-foreground mb-1">What is sBTC?</p>
              <p className="text-sm">
                sBTC is Bitcoin that works on the Stacks blockchain. It's 1:1 backed by real Bitcoin
                and can be converted back to BTC anytime. This allows your Bitcoin to participate in
                DeFi protocols like BXL Vault.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3 flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-primary" />
              How to Get sBTC
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Option 1: Bridge Bitcoin to sBTC (Recommended)</h4>
                <TutorialStepList>
                  <TutorialStepListItem icon={<span className="text-primary font-semibold">1.</span>}>
                    Visit the{' '}
                    <a 
                      href="https://bridge.boombox.trade/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      sBTC Bridge
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TutorialStepListItem>
                  <TutorialStepListItem icon={<span className="text-primary font-semibold">2.</span>}>
                    Connect your Xverse wallet
                  </TutorialStepListItem>
                  <TutorialStepListItem icon={<span className="text-primary font-semibold">3.</span>}>
                    Enter the amount of BTC you want to bridge to sBTC
                  </TutorialStepListItem>
                  <TutorialStepListItem icon={<span className="text-primary font-semibold">4.</span>}>
                    Confirm the transaction in your wallet
                  </TutorialStepListItem>
                  <TutorialStepListItem icon={<span className="text-primary font-semibold">5.</span>}>
                    Wait for confirmation (typically 15-30 minutes for Bitcoin confirmations)
                  </TutorialStepListItem>
                  <TutorialStepListItem icon={<span className="text-primary font-semibold">6.</span>}>
                    Your sBTC will appear in your Xverse wallet
                  </TutorialStepListItem>
                </TutorialStepList>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Option 2: Buy on Exchanges</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Some exchanges support direct sBTC purchases. Check if your exchange offers sBTC trading.
                </p>
              </div>
            </div>
          </div>

          <TutorialStepHighlight>
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">Getting Started</p>
                <p className="text-sm">
                  We recommend starting with a small amount (e.g., 0.0001 BTC or ~$10) to familiarize
                  yourself with the process before depositing larger amounts.
                </p>
              </div>
            </div>
          </TutorialStepHighlight>

          <div className="pt-4">
            <Button asChild className="w-full sm:w-auto">
              <a 
                href="https://bridge.boombox.trade/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Go to sBTC Bridge
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground italic">
            Once you have sBTC in your Xverse wallet, click "Next" to continue.
          </p>
        </div>
      </TutorialStepContent>
    </TutorialStep>
  );
};
