import { useState } from 'react';
import { DocumentUpload } from '@/components/DocumentUpload';
import { QueryInterface } from '@/components/QueryInterface';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, FileText, Sparkles } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
}

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

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleSubmitQuery = async (query: string) => {
    setCurrentQuery(query);
    setIsProcessing(true);
    setCurrentStep(0);
    setResult(null);

    // Simulate processing steps
    for (let i = 0; i < 4; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Mock response based on query content
    const mockResult: QueryResult = {
      decision: query.toLowerCase().includes('knee surgery') ? 'approved' : 
                query.toLowerCase().includes('dental') ? 'rejected' : 'pending',
      amount: query.toLowerCase().includes('knee surgery') ? 15000 : undefined,
      justification: query.toLowerCase().includes('knee surgery') 
        ? "Knee surgery is covered under the policy for members over 18 years. The procedure is medically necessary and falls within the coverage period. Pre-authorization requirements have been met."
        : query.toLowerCase().includes('dental')
        ? "Dental procedures are not covered under the basic health insurance policy. Additional dental coverage would be required for this procedure."
        : "Additional information is required to process this claim. Please provide more details about the procedure and policy terms.",
      confidence: query.toLowerCase().includes('knee surgery') ? 92 : 
                  query.toLowerCase().includes('dental') ? 88 : 65,
      extractedEntities: {
        age: query.includes('46') ? 46 : query.includes('child') ? 8 : undefined,
        gender: query.toLowerCase().includes('male') ? 'Male' : 
                query.toLowerCase().includes('female') ? 'Female' : undefined,
        procedure: query.toLowerCase().includes('knee') ? 'Knee Surgery' :
                  query.toLowerCase().includes('dental') ? 'Dental Procedure' :
                  query.toLowerCase().includes('maternity') ? 'Maternity Care' : 'Medical Procedure',
        location: query.toLowerCase().includes('pune') ? 'Pune, India' :
                 query.toLowerCase().includes('mumbai') ? 'Mumbai, India' :
                 query.toLowerCase().includes('california') ? 'California, USA' : undefined,
        policyDuration: query.includes('3-month') ? '3 months' :
                       query.includes('2-year') ? '2 years' : 'Active Policy'
      },
      relevantClauses: [
        {
          id: 'clause-1',
          text: 'Surgical procedures including orthopedic surgeries are covered under Section 4.2 of the health insurance policy, subject to pre-authorization and medical necessity requirements.',
          source: 'Health Insurance Policy Document',
          relevanceScore: 95
        },
        {
          id: 'clause-2', 
          text: 'Coverage is valid for procedures performed within the policy period and at approved healthcare facilities within the network.',
          source: 'Policy Terms & Conditions',
          relevanceScore: 87
        },
        {
          id: 'clause-3',
          text: 'Members above 18 years of age are eligible for all medical procedures as outlined in the coverage schedule.',
          source: 'Eligibility Guidelines',
          relevanceScore: 82
        }
      ],
      rawResponse: {
        query_parsed: {
          entities: {
            age: 46,
            gender: 'male',
            procedure: 'knee surgery',
            location: 'Pune',
            policy_duration: '3 months'
          },
          intent: 'claim_eligibility_check'
        },
        decision: {
          status: 'approved',
          amount: 15000,
          currency: 'USD'
        },
        confidence_score: 0.92,
        processing_time_ms: 6000,
        model_version: 'llm-doc-processor-v2.1'
      }
    };

    setResult(mockResult);
    setIsProcessing(false);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-background to-accent/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-large">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                LLM Document Processing System
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Intelligent document analysis for insurance claims and policy processing
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="border-0 shadow-soft bg-gradient-secondary">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Document Upload</h3>
                <p className="text-sm text-muted-foreground">Upload policy documents, contracts, and emails</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft bg-gradient-secondary">
              <CardContent className="p-6 text-center">
                <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">AI Processing</h3>
                <p className="text-sm text-muted-foreground">Advanced NLP for semantic understanding</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft bg-gradient-secondary">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Structured Output</h3>
                <p className="text-sm text-muted-foreground">JSON responses with justification mapping</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Document Upload Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Step 1: Upload Documents</h2>
            <DocumentUpload 
              onFilesUploaded={handleFilesUploaded}
              uploadedFiles={uploadedFiles}
            />
          </div>

          {/* Query Interface Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Step 2: Submit Query</h2>
            <QueryInterface 
              onSubmitQuery={handleSubmitQuery}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Processing Status */}
        {(isProcessing || currentStep > 0) && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Processing Status</h2>
            <ProcessingStatus 
              isProcessing={isProcessing}
              currentStep={currentStep}
            />
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Analysis Results</h2>
            <ResultsDisplay 
              result={result}
              query={currentQuery}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
