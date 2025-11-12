import { TutorialStep, TutorialStepTitle, TutorialStepContent, TutorialStepList, TutorialStepListItem, TutorialStepWarning } from '../TutorialStep';
import { Shield, AlertTriangle, Key } from 'lucide-react';

export const WalletSetupStep = () => {
  return (
    <TutorialStep>
      <TutorialStepTitle>Create Your Wallet</TutorialStepTitle>
      
      <TutorialStepContent>
        <p className="text-lg">
          Now that you have Xverse installed, let's create your secure wallet.
        </p>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3">Setup Steps</h3>
            <TutorialStepList>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">1.</span>}>
                Open the Xverse extension (click the puzzle icon in your browser and pin Xverse)
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">2.</span>}>
                Click "Create New Wallet"
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">3.</span>}>
                You'll be shown a 12-word seed phrase - this is your wallet's backup
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">4.</span>}>
                <strong className="text-foreground">Write down your seed phrase on paper</strong> - do not store it digitally
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">5.</span>}>
                Verify your seed phrase by selecting the words in order
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">6.</span>}>
                Set a strong password for your wallet
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">7.</span>}>
                Complete the setup - your wallet is now ready!
              </TutorialStepListItem>
            </TutorialStepList>
          </div>

          <TutorialStepWarning>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-semibold text-foreground">CRITICAL: Protect Your Seed Phrase</p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  <li>Your 12-word seed phrase is the ONLY way to recover your wallet</li>
                  <li>Never share it with anyone - not even BXL Vault or Xverse support</li>
                  <li>Store it offline in a secure location</li>
                  <li>If someone gets your seed phrase, they can steal your funds</li>
                  <li>Write it on paper, not in a digital file or screenshot</li>
                </ul>
              </div>
            </div>
          </TutorialStepWarning>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">Security Best Practices</p>
                <ul className="text-sm space-y-1">
                  <li>• Use a strong, unique password</li>
                  <li>• Store your seed phrase in multiple secure locations</li>
                  <li>• Consider using a hardware wallet for large amounts</li>
                  <li>• Never enter your seed phrase on any website</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </TutorialStepContent>
    </TutorialStep>
  );
};
