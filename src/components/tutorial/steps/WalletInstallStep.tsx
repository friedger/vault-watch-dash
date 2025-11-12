import { TutorialStep, TutorialStepTitle, TutorialStepContent, TutorialStepList, TutorialStepListItem, TutorialStepWarning } from '../TutorialStep';
import { Chrome, Smartphone, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WalletInstallStep = () => {
  return (
    <TutorialStep>
      <TutorialStepTitle>Install Xverse Wallet</TutorialStepTitle>
      
      <TutorialStepContent>
        <p className="text-lg">
          Xverse is a secure wallet for the Stacks blockchain that allows you to interact with BXL Vault.
        </p>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3 flex items-center gap-2">
              <Chrome className="h-5 w-5" />
              Browser Extension
            </h3>
            <TutorialStepList>
              <TutorialStepListItem>
                <strong>Chrome/Brave:</strong> Visit the{' '}
                <a 
                  href="https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Chrome Web Store
                  <ExternalLink className="h-3 w-3" />
                </a>
              </TutorialStepListItem>
              <TutorialStepListItem>
                <strong>Firefox:</strong> Visit{' '}
                <a 
                  href="https://addons.mozilla.org/en-US/firefox/addon/xverse-wallet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Firefox Add-ons
                  <ExternalLink className="h-3 w-3" />
                </a>
              </TutorialStepListItem>
              <TutorialStepListItem>
                Click "Add to Chrome/Firefox" and confirm the installation
              </TutorialStepListItem>
            </TutorialStepList>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3 flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Mobile App
            </h3>
            <TutorialStepList>
              <TutorialStepListItem>
                <strong>iOS:</strong> Download from the{' '}
                <a 
                  href="https://apps.apple.com/app/xverse-wallet/id1626983958"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  App Store
                  <ExternalLink className="h-3 w-3" />
                </a>
              </TutorialStepListItem>
              <TutorialStepListItem>
                <strong>Android:</strong> Download from{' '}
                <a 
                  href="https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Google Play
                  <ExternalLink className="h-3 w-3" />
                </a>
              </TutorialStepListItem>
            </TutorialStepList>
          </div>

          <TutorialStepWarning>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Security Notice</p>
                <p className="text-sm mt-1">
                  Only download Xverse from official sources listed above. Never share your wallet's
                  seed phrase with anyone, including the BXL Vault team.
                </p>
              </div>
            </div>
          </TutorialStepWarning>

          <div className="flex gap-2 mt-4">
            <Button asChild variant="outline" size="sm">
              <a 
                href="https://www.xverse.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Visit Xverse Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </TutorialStepContent>
    </TutorialStep>
  );
};
