import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, FileText, Quote, Download, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface QueryResult {
  decision: 'approved' | 'rejected' | 'pending';
  amount?: number;
  justification: string;
  confidence: number;
  extractedEntities: {
    age?: number;
    gender?: string;
    procedure?: string;
    location?: string;
    policyDuration?: string;
    [key: string]: any;
  };
  relevantClauses: Array<{
    id: string;
    text: string;
    source: string;
    relevanceScore: number;
  }>;
  rawResponse: any;
}

interface ResultsDisplayProps {
  result: QueryResult | null;
  query: string;
}

export const ResultsDisplay = ({ result, query }: ResultsDisplayProps) => {
  const { toast } = useToast();

  if (!result) return null;

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approved':
        return 'text-success';
      case 'rejected':
        return 'text-destructive';
      default:
        return 'text-warning';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'approved':
        return <CheckCircle2 className="w-6 h-6 text-success" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-destructive" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-warning" />;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The result has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const exportResult = () => {
    const exportData = {
      query,
      timestamp: new Date().toISOString(),
      result: result.rawResponse
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `llm-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Main Decision Card */}
      <Card className="border-2 shadow-large bg-gradient-to-br from-background to-accent/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center space-x-3">
              {getDecisionIcon(result.decision)}
              <span className={getDecisionColor(result.decision)}>
                {result.decision.charAt(0).toUpperCase() + result.decision.slice(1)}
              </span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(result.rawResponse, null, 2))}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportResult}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.amount && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-semibold text-success mb-1">Approved Amount</h4>
              <p className="text-2xl font-bold text-success">
                ${result.amount.toLocaleString()}
              </p>
            </div>
          )}

          <div className="p-4 bg-accent/20 border border-accent rounded-lg">
            <h4 className="font-semibold mb-2">Justification</h4>
            <p className="text-foreground leading-relaxed">{result.justification}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Confidence Score:</span>
              <Badge variant={result.confidence > 80 ? "default" : result.confidence > 60 ? "secondary" : "destructive"}>
                {result.confidence}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Entities */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Extracted Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(result.extractedEntities).map(([key, value]) => (
              <div key={key} className="p-3 bg-accent/30 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="font-medium">{value?.toString() || 'N/A'}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Relevant Clauses */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Quote className="w-5 h-5" />
            <span>Relevant Policy Clauses</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.relevantClauses.map((clause) => (
            <div
              key={clause.id}
              className="p-4 border rounded-lg bg-gradient-to-r from-background to-accent/10 hover:shadow-soft transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs">
                  {clause.source}
                </Badge>
                <Badge variant={clause.relevanceScore > 80 ? "default" : "secondary"}>
                  {clause.relevanceScore}% relevant
                </Badge>
              </div>
              <p className="text-sm text-foreground leading-relaxed italic">
                "{clause.text}"
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Raw JSON Response */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="text-lg">Raw JSON Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-auto">
            <pre className="text-xs text-foreground whitespace-pre-wrap">
              {JSON.stringify(result.rawResponse, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};