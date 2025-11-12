import { TutorialStep, TutorialStepTitle, TutorialStepContent, TutorialStepList, TutorialStepListItem } from '../TutorialStep';
import { CheckCircle, Clock } from 'lucide-react';

export const WelcomeStep = () => {
  return (
    <TutorialStep>
      <TutorialStepTitle>Welcome to BXL Vault! 🎉</TutorialStepTitle>
      
      <TutorialStepContent>
        <p className="text-lg">
          BXL Vault is a decentralized protocol that allows you to support the Brussels Crypto Community
          while maintaining full ownership of your Bitcoin.
        </p>

        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-foreground text-lg">What you'll learn in this tutorial:</h3>
          <TutorialStepList>
            <TutorialStepListItem icon={<CheckCircle className="h-5 w-5 text-primary" />}>
              How to install and set up Xverse wallet
            </TutorialStepListItem>
            <TutorialStepListItem icon={<CheckCircle className="h-5 w-5 text-primary" />}>
              How to get sBTC (wrapped Bitcoin)
            </TutorialStepListItem>
            <TutorialStepListItem icon={<CheckCircle className="h-5 w-5 text-primary" />}>
              How to connect your wallet to BXL Vault
            </TutorialStepListItem>
            <TutorialStepListItem icon={<CheckCircle className="h-5 w-5 text-primary" />}>
              How to deposit your Bitcoin and start supporting the community
            </TutorialStepListItem>
          </TutorialStepList>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <Clock className="h-4 w-4" />
            <span>Estimated time: ~15 minutes</span>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-foreground mb-2">Why BXL Vault?</h4>
            <p className="text-sm">
              Your Bitcoin generates stacking rewards that go directly to support community projects like
              Commons Hub Brussels, Crypto Wednesday, and Block 26. You keep full ownership and can withdraw
              anytime.
            </p>
          </div>
        </div>
      </TutorialStepContent>
    </TutorialStep>
  );
};
