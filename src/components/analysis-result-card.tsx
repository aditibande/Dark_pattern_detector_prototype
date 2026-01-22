'use client';

import type { AnalysisResult } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Timer,
  ReceiptText,
  GitFork,
  MessageSquareQuote,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  FileText,
  Eye,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { Separator } from './ui/separator';

interface AnalysisResultCardProps {
  result: AnalysisResult | null;
  websiteText?: string;
}

const patternIcons: Record<string, React.ElementType> = {
  'Fake Urgency': Timer,
  'Hidden Costs': ReceiptText,
  'Forced Choice': GitFork,
  'Misleading Language': MessageSquareQuote,
  None: ShieldCheck,
};

const confidenceColors: Record<string, string> = {
  High: 'hsl(var(--primary))',
  Medium: 'hsl(var(--secondary-foreground))',
  Low: 'hsl(var(--muted-foreground))',
};

function HighlightedText({
  text,
  evidence,
}: {
  text: string;
  evidence: string;
}) {
  if (!text || !evidence) return <p className="text-sm text-muted-foreground italic">No text provided for highlighting.</p>;
  
  const parts = text.split(new RegExp(`(${evidence})`, 'gi'));
  return (
    <blockquote className="whitespace-pre-wrap text-sm text-foreground/80">
      {parts.map((part, index) =>
        part.toLowerCase() === evidence.toLowerCase() ? (
          <mark
            key={index}
            className="rounded bg-primary/20 px-1 py-0.5 text-primary-foreground"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </blockquote>
  );
}

export function AnalysisResultCard({
  result,
  websiteText = '',
}: AnalysisResultCardProps) {
  if (!result) return null;

  const Icon = patternIcons[result.pattern_type] || AlertTriangle;
  const isPatternDetected = result.dark_pattern_detected;
  const confidenceValue =
    { High: 90, Medium: 60, Low: 30 }[result.confidence] || 0;

  const canHighlight = websiteText && result.evidence && websiteText.toLowerCase().includes(result.evidence.toLowerCase());

  return (
    <Card className="w-full animate-in fade-in-50 duration-500 shadow-xl shadow-black/5">
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 bg-primary/10 border border-primary/20`}>
              <Icon
                className="h-6 w-6 text-primary"
              />
            </div>
            <CardTitle className="text-xl sm:text-2xl">
              {isPatternDetected
                ? 'Potential Dark Pattern Found'
                : 'No Dark Patterns Detected'}
            </CardTitle>
          </div>
          {isPatternDetected && (
            <Badge
              variant="outline"
              className="border-primary/50 bg-primary/10 text-primary-foreground"
            >
              {result.pattern_type}
            </Badge>
          )}
        </div>
        <CardDescription className="pt-2 !mt-4">{result.disclaimer}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-2">
        <Separator />
        {isPatternDetected ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5"/>Explanation</h3>
                <p className="text-muted-foreground">{result.explanation}</p>
              </div>
              <div>
                <h3 className="mb-3 font-semibold">Confidence Level</h3>
                <div className="flex items-center gap-4">
                  <span
                    className="w-16 font-semibold"
                    style={{ color: confidenceColors[result.confidence] }}
                  >
                    {result.confidence}
                  </span>
                  <Progress
                    value={confidenceValue}
                    className="h-2 w-full"
                    indicatorClassName="bg-primary"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5"/>
                Evidence Found
              </h3>
              <div className="rounded-md border bg-muted/50 p-4 space-y-4">
                {canHighlight ? (
                   <div>
                    <h4 className="mb-2 text-sm font-semibold flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4" />In Context</h4>
                    <HighlightedText text={websiteText} evidence={result.evidence} />
                   </div>
                ) : (
                  <div>
                    <blockquote className="border-l-2 border-primary pl-4 italic text-foreground">
                      {result.evidence}
                    </blockquote>
                    {websiteText && (
                        <div className='mt-4'>
                          <Separator className='mb-4'/>
                           <h4 className="mb-2 text-sm font-semibold flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4" />Full Text Provided</h4>
                           <p className="whitespace-pre-wrap text-sm text-foreground/80 max-h-40 overflow-auto">{websiteText}</p>
                        </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
             <ShieldCheck className="h-16 w-16 text-green-500/80" />
            <p className="text-lg font-medium">Analysis Complete</p>
            <p className="text-muted-foreground max-w-md">
              Our analysis did not find any clear examples of the dark patterns
              we screen for in the provided content.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
