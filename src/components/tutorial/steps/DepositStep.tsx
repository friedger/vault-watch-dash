import { TutorialStep, TutorialStepTitle, TutorialStepContent, TutorialStepList, TutorialStepListItem, TutorialStepHighlight } from '../TutorialStep';
import { Coins, Info, TrendingUp } from 'lucide-react';

export const DepositStep = () => {
  return (
    <TutorialStep>
      <TutorialStepTitle>Make Your First Deposit</TutorialStepTitle>
      
      <TutorialStepContent>
        <p className="text-lg">
          You're almost there! Let's deposit your sBTC into the BXL Vault and start supporting the community.
        </p>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3 flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Deposit Steps
            </h3>
            <TutorialStepList>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">1.</span>}>
                Navigate to the Deposit page (or click the "Deposit" button from the main page)
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">2.</span>}>
                Make sure "sBTC" is selected (it's the default and primary asset)
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">3.</span>}>
                Enter the amount of sBTC you want to deposit
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">4.</span>}>
                Review the details - you'll receive the same amount in bxlBTC (wrapped receipt tokens)
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">5.</span>}>
                Click "Deposit sBTC"
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">6.</span>}>
                Approve the transaction in your Xverse wallet popup
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">7.</span>}>
                Wait for the transaction to confirm (usually 1-2 minutes)
              </TutorialStepListItem>
            </TutorialStepList>
          </div>

          <TutorialStepHighlight>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">What You'll Receive</p>
                  <p className="text-sm mt-1">
                    When you deposit sBTC, you receive bxlBTC tokens at a 1:1 ratio. These tokens represent
                    your ownership of the deposited Bitcoin. You can always withdraw your Bitcoin by burning
                    these tokens.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Your Bitcoin Generates Yield</p>
                  <p className="text-sm mt-1">
                    While your Bitcoin is deposited, it participates in dual stacking to generate rewards.
                    These rewards go directly to the Brussels Crypto Community to fund public goods and events.
                  </p>
                </div>
              </div>
            </div>
          </TutorialStepHighlight>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-2">Important Notes</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Small network fees apply (paid in STX)</li>
              <li>• You maintain full ownership of your Bitcoin</li>
              <li>• You can withdraw anytime (with a 1-week safety delay for wrench attack protection)</li>
              <li>• Start small to test the process before depositing larger amounts</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground italic">
            After your deposit transaction is confirmed, click "Next" to complete the tutorial!
          </p>
        </div>
      </TutorialStepContent>
    </TutorialStep>
  );
};
