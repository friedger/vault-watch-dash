import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TutorialStepProps {
  children: ReactNode;
  className?: string;
}

export const TutorialStep = ({ children, className }: TutorialStepProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
};

export const TutorialStepTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-2xl font-bold text-foreground">{children}</h2>
);

export const TutorialStepContent = ({ children }: { children: ReactNode }) => (
  <div className="text-muted-foreground space-y-3">{children}</div>
);

export const TutorialStepList = ({ children }: { children: ReactNode }) => (
  <ul className="space-y-2 ml-4">{children}</ul>
);

export const TutorialStepListItem = ({ children, icon }: { children: ReactNode; icon?: ReactNode }) => (
  <li className="flex items-start gap-2">
    {icon && <span className="mt-0.5">{icon}</span>}
    <span>{children}</span>
  </li>
);

export const TutorialStepWarning = ({ children }: { children: ReactNode }) => (
  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
    {children}
  </div>
);

export const TutorialStepHighlight = ({ children }: { children: ReactNode }) => (
  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
    {children}
  </div>
);
