import { TutorialStep, TutorialStepTitle, TutorialStepContent, TutorialStepList, TutorialStepListItem } from '../TutorialStep';
import { CheckCircle, TrendingUp, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTutorial } from '../TutorialContext';
import { useNavigate } from 'react-router-dom';

export const CompletionStep = () => {
  const { closeTutorial } = useTutorial();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    closeTutorial();
    navigate(path);
  };

  return (
    <TutorialStep>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <TutorialStepTitle>🎉 You're All Set!</TutorialStepTitle>
      </div>
      
      <TutorialStepContent>
        <p className="text-lg text-center">
          Congratulations! You've successfully joined the BXL Vault community.
        </p>

        <div className="space-y-6 mt-8">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-lg mb-3">What You've Accomplished</h3>
            <TutorialStepList>
              <TutorialStepListItem icon={<CheckCircle className="h-5 w-5 text-primary" />}>
                Installed and set up Xverse wallet
              </TutorialStepListItem>
              <TutorialStepListItem icon={<CheckCircle className="h-5 w-5 text-primary" />}>
                Obtained sBTC (wrapped Bitcoin)
              </TutorialStepListItem>
              <TutorialStepListItem icon={<CheckCircle className="h-5 w-5 text-primary" />}>
                Connected your wallet to BXL Vault
              </TutorialStepListItem>
              <TutorialStepListItem icon={<CheckCircle className="h-5 w-5 text-primary" />}>
                Made your first deposit
              </TutorialStepListItem>
              <TutorialStepListItem icon={<CheckCircle className="h-5 w-5 text-primary" />}>
                Started generating yield for the Brussels Crypto Community
              </TutorialStepListItem>
            </TutorialStepList>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              What Happens Now?
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Your Bitcoin is Working:</strong> Your deposited Bitcoin participates
                in dual stacking to generate rewards.
              </p>
              <p>
                <strong className="text-foreground">Community Benefits:</strong> All stacking rewards go directly to
                support Brussels Crypto Community projects like Commons Hub, Crypto Wednesday, and Block 26.
              </p>
              <p>
                <strong className="text-foreground">You Keep Ownership:</strong> Your bxlBTC tokens represent your claim
                to the deposited Bitcoin. You can withdraw anytime.
              </p>
              <p>
                <strong className="text-foreground">Safe Withdrawal:</strong> When you're ready to withdraw, there's a
                1-week delay for wrench attack protection (or instant withdrawal by admin approval).
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-lg mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Next Steps
            </h3>
            <div className="grid gap-3">
              <Button 
                variant="default" 
                className="w-full justify-start"
                onClick={() => handleNavigate('/wallet')}
              >
                View Your Portfolio Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleNavigate('/vault')}
              >
                Explore Vault Details & Community Impact
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <a 
                  href="https://dao.brussels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  Join DAO Brussels Community
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-secondary/20 border border-secondary/40 rounded-lg p-4 mt-6">
            <p className="text-sm text-center">
              <strong className="text-foreground">Thank you for supporting the Brussels Crypto Community!</strong>
              <br />
              Your contribution helps fund public goods, infrastructure, and events that benefit everyone.
            </p>
          </div>
        </div>
      </TutorialStepContent>
    </TutorialStep>
  );
};
