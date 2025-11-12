import { TutorialStep, TutorialStepTitle, TutorialStepContent, TutorialStepList, TutorialStepListItem, TutorialStepHighlight } from '../TutorialStep';
import { Wallet, Shield, CheckCircle } from 'lucide-react';

export const ConnectWalletStep = () => {
  return (
    <TutorialStep>
      <TutorialStepTitle>Connect Your Wallet</TutorialStepTitle>
      
      <TutorialStepContent>
        <p className="text-lg">
          Now let's connect your Xverse wallet to BXL Vault so you can start depositing.
        </p>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Connection Steps
            </h3>
            <TutorialStepList>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">1.</span>}>
                Look for the "Connect Wallet" button in the top-right corner of the page
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">2.</span>}>
                Click "Connect Wallet"
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">3.</span>}>
                A popup will appear - select "Xverse Wallet" from the options
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">4.</span>}>
                Xverse will ask you to approve the connection - click "Approve"
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">5.</span>}>
                Once connected, you'll see your wallet address displayed in the top-right
              </TutorialStepListItem>
            </TutorialStepList>
          </div>

          <TutorialStepHighlight>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">What Happens When You Connect?</p>
                  <p className="text-sm mt-1">
                    The app can read your wallet balances and token holdings (view-only access).
                    This allows BXL Vault to show your current sBTC balance and wrapped tokens.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">You Stay in Control</p>
                  <p className="text-sm mt-1">
                    BXL Vault never has access to move your funds. Every transaction requires your
                    explicit approval in your Xverse wallet. You can disconnect at any time.
                  </p>
                </div>
              </div>
            </div>
          </TutorialStepHighlight>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-2">Troubleshooting</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Make sure Xverse is installed and unlocked</li>
              <li>• Try refreshing the page if the connection fails</li>
              <li>• Check that you're using a supported browser</li>
              <li>• Disable other wallet extensions if there are conflicts</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground italic">
            Once your wallet is connected and you can see your address in the top-right, click "Next" to continue.
          </p>
        </div>
      </TutorialStepContent>
    </TutorialStep>
  );
};
