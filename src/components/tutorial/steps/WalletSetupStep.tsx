import { TutorialStep, TutorialStepTitle, TutorialStepContent, TutorialStepList, TutorialStepListItem, TutorialStepWarning } from '../TutorialStep';
import { Shield, AlertTriangle, Key } from 'lucide-react';

export const WalletSetupStep = () => {
  return (
    <TutorialStep>
      <TutorialStepTitle>Import Your Existing Wallet</TutorialStepTitle>
      
      <TutorialStepContent>
        <p className="text-lg">
          Now that you have Xverse installed, let's import your existing Bitcoin wallet using your seed phrase.
        </p>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3">Import Steps</h3>
            <TutorialStepList>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">1.</span>}>
                Open the Xverse extension (click the puzzle icon in your browser and pin Xverse)
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">2.</span>}>
                Click "Restore Wallet" or "Import Existing Wallet"
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">3.</span>}>
                <strong className="text-foreground">Carefully enter your existing 12-word seed phrase</strong> in the correct order
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">4.</span>}>
                Double-check each word before proceeding - typos will prevent access to your funds
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">5.</span>}>
                Set a strong password for this device (this protects your wallet on this browser)
              </TutorialStepListItem>
              <TutorialStepListItem icon={<span className="text-primary font-semibold">6.</span>}>
                Complete the import - your Bitcoin is now accessible through Xverse!
              </TutorialStepListItem>
            </TutorialStepList>
          </div>

          <TutorialStepWarning>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-semibold text-foreground">CRITICAL: Protect Your Seed Phrase</p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  <li>Only enter your seed phrase in the official Xverse extension - verify the URL first</li>
                  <li>Never share your seed phrase with anyone - not even BXL Vault or Xverse support</li>
                  <li>This is the same wallet you already have - just accessible through Xverse now</li>
                  <li>If someone gets your seed phrase, they can steal all your Bitcoin</li>
                  <li>Never enter your seed phrase on any website or in emails</li>
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
                  <li>• Verify you're using the legitimate Xverse extension before importing</li>
                  <li>• Use a strong, unique password for added security on this device</li>
                  <li>• Keep your seed phrase stored securely offline</li>
                  <li>• Your Bitcoin remains yours - Xverse just provides access to it</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </TutorialStepContent>
    </TutorialStep>
  );
};
