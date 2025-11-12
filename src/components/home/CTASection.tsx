import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTutorial } from "@/components/tutorial/TutorialContext";

export const CTASection = () => {
  const { startTutorial, state } = useTutorial();

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6 py-8 animate-fade-in">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold">
          Ready to Support Your Community?
        </h3>
        <p className="text-muted-foreground">
          Connect your wallet to get started. You'll be able to deposit
          your sBTC and contribute to building the Brussels crypto
          community.
        </p>
      </div>
      {!state.isCompleted && !state.skipped && (
        <Button 
          onClick={startTutorial}
          size="lg"
          variant="outline"
          className="gap-2"
        >
          <GraduationCap className="w-5 h-5" />
          New User? Start Tutorial
        </Button>
      )}
    </div>
  );
};
