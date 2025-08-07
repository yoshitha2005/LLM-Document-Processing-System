import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Brain, FileSearch, Scale, Sparkles } from 'lucide-react';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  icon: React.ReactNode;
}

interface ProcessingStatusProps {
  isProcessing: boolean;
  currentStep: number;
}

export const ProcessingStatus = ({ isProcessing, currentStep }: ProcessingStatusProps) => {
  const steps: ProcessingStep[] = [
    {
      id: '1',
      title: 'Query Parsing',
      description: 'Extracting key entities and intent from your query',
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'processing' : 'pending',
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: '2',
      title: 'Document Search',
      description: 'Searching through uploaded documents using semantic understanding',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'processing' : 'pending',
      icon: <FileSearch className="w-5 h-5" />
    },
    {
      id: '3',
      title: 'Rule Evaluation',
      description: 'Applying business logic and policy rules to retrieved information',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'processing' : 'pending',
      icon: <Scale className="w-5 h-5" />
    },
    {
      id: '4',
      title: 'Decision Generation',
      description: 'Generating structured response with justification',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'processing' : 'pending',
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  if (!isProcessing && currentStep === 0) {
    return null;
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="shadow-medium border-primary/20 bg-gradient-to-br from-background to-accent/20">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Processing Your Query</h3>
            <p className="text-muted-foreground">AI is analyzing your request and searching through documents</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-500 ${
                  step.status === 'completed'
                    ? 'bg-success/10 border border-success/20'
                    : step.status === 'processing'
                    ? 'bg-primary/10 border border-primary/20 animate-pulse-glow'
                    : 'bg-muted/50 border border-border'
                }`}
              >
                <div
                  className={`p-2 rounded-full transition-all duration-300 ${
                    step.status === 'completed'
                      ? 'bg-success text-success-foreground'
                      : step.status === 'processing'
                      ? 'bg-primary text-primary-foreground animate-glow'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {step.status === 'processing' && (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};