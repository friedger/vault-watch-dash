import { useTutorial } from './TutorialContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { WelcomeStep } from './steps/WelcomeStep';
import { WalletInstallStep } from './steps/WalletInstallStep';
import { WalletSetupStep } from './steps/WalletSetupStep';
import { GetSBTCStep } from './steps/GetSBTCStep';
import { ConnectWalletStep } from './steps/ConnectWalletStep';
import { DepositStep } from './steps/DepositStep';
import { CompletionStep } from './steps/CompletionStep';

export const TutorialDialog = () => {
  const { state, nextStep, previousStep, closeTutorial, skipTutorial, totalSteps } = useTutorial();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <WalletInstallStep />;
      case 3:
        return <WalletSetupStep />;
      case 4:
        return <GetSBTCStep />;
      case 5:
        return <ConnectWalletStep />;
      case 6:
        return <DepositStep />;
      case 7:
        return <CompletionStep />;
      default:
        return <WelcomeStep />;
    }
  };

  const isFirstStep = state.currentStep === 1;
  const isLastStep = state.currentStep === totalSteps;
  const progress = (state.currentStep / totalSteps) * 100;

  return (
    <Dialog open={state.isActive} onOpenChange={(open) => !open && closeTutorial()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm text-muted-foreground">
              Step {state.currentStep} of {totalSteps}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeTutorial}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
        </DialogHeader>

        <div className="py-6">
          {renderStep()}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            {isFirstStep ? (
              <Button
                variant="outline"
                onClick={skipTutorial}
                className="flex-1 sm:flex-initial"
              >
                Skip Tutorial
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={previousStep}
                className="flex-1 sm:flex-initial"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            
            <Button
              onClick={isLastStep ? closeTutorial : nextStep}
              className="flex-1 sm:flex-initial"
            >
              {isLastStep ? (
                'Finish'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
