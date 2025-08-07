import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Clock, MapPin, User, FileText } from 'lucide-react';

interface QueryInterfaceProps {
  onSubmitQuery: (query: string) => void;
  isProcessing: boolean;
}

export const QueryInterface = ({ onSubmitQuery, isProcessing }: QueryInterfaceProps) => {
  const [query, setQuery] = useState('');

  const sampleQueries = [
    "46-year-old male, knee surgery in Pune, 3-month-old insurance policy",
    "Female employee, maternity leave, California, active policy",
    "Dental procedure, child under 10, family plan, pre-authorization required",
    "Car accident claim, Mumbai, comprehensive coverage, 2-year policy"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmitQuery(query.trim());
    }
  };

  const useSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  return (
    <Card className="shadow-medium border-0 bg-gradient-secondary">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Natural Language Query</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Enter your query in plain English. Our AI will understand and process it to find relevant information from your documents.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 46-year-old male, knee surgery in Pune, 3-month-old insurance policy"
              className="min-h-[120px] pr-12 text-lg resize-none border-2 focus:border-primary transition-all duration-300"
              disabled={isProcessing}
            />
            <div className="absolute top-4 right-4 text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>AI will extract:</span>
              <Badge variant="outline" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                Demographics
              </Badge>
              <Badge variant="outline" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Procedures
              </Badge>
              <Badge variant="outline" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                Location
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Timeline
              </Badge>
            </div>
            <Button 
              type="submit" 
              disabled={!query.trim() || isProcessing}
              className="bg-gradient-primary hover:opacity-90 shadow-medium transition-all duration-300 transform hover:scale-105"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Query
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <h4 className="font-medium text-lg">Sample Queries</h4>
          <div className="grid gap-2">
            {sampleQueries.map((sampleQuery, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start text-left h-auto p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300"
                onClick={() => useSampleQuery(sampleQuery)}
                disabled={isProcessing}
              >
                <span className="truncate">{sampleQuery}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};