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
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { Separator } from './ui/separator';

interface AnalysisResultCardProps {
  result: AnalysisResult;
  websiteText: string;
}

const patternIcons: Record<string, React.ElementType> = {
  'Fake Urgency': Timer,
  'Hidden Costs': ReceiptText,
  'Forced Choice': GitFork,
  'Misleading Language': MessageSquareQuote,
  None: ShieldCheck,
};

const confidenceColors: Record<string, string> = {
  High: 'hsl(var(--accent))',
  Medium: 'hsl(var(--primary))',
  Low: 'hsl(var(--muted-foreground))',
};

function HighlightedText({
  text,
  evidence,
}: {
  text: string;
  evidence: string;
}) {
  // Use a case-insensitive regex to split the text
  const parts = text.split(new RegExp(`(${evidence})`, 'gi'));
  return (
    <blockquote className="whitespace-pre-wrap text-sm text-muted-foreground">
      {parts.map((part, index) =>
        part.toLowerCase() === evidence.toLowerCase() ? (
          <mark
            key={index}
            className="rounded bg-accent/20 px-1 py-0.5 text-foreground"
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
  websiteText,
}: AnalysisResultCardProps) {
  const Icon = patternIcons[result.pattern_type] || AlertTriangle;
  const isPatternDetected = result.dark_pattern_detected;
  const confidenceValue =
    { High: 90, Medium: 60, Low: 30 }[result.confidence] || 0;

  const canHighlight = websiteText && result.evidence && websiteText.toLowerCase().includes(result.evidence.toLowerCase());

  return (
    <Card className="w-full animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Icon
              className="h-6 w-6"
              style={{
                color: isPatternDetected
                  ? 'hsl(var(--accent))'
                  : 'hsl(var(--primary))',
              }}
            />
            <CardTitle className="text-xl sm:text-2xl">
              {isPatternDetected
                ? 'Potential Dark Pattern Found'
                : 'No Dark Patterns Detected'}
            </CardTitle>
          </div>
          {isPatternDetected && (
            <Badge
              variant="outline"
              className="border-accent bg-accent/10 text-accent"
            >
              {result.pattern_type}
            </Badge>
          )}
        </div>
        <CardDescription className="pt-2">{result.disclaimer}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        {isPatternDetected ? (
          <>
            <div>
              <h3 className="mb-2 font-semibold">Explanation</h3>
              <p className="text-muted-foreground">{result.explanation}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Confidence Level</h3>
              <div className="flex items-center gap-4">
                <Progress
                  value={confidenceValue}
                  className="h-2 w-full"
                  style={
                    { '--primary': confidenceColors[result.confidence] } as React.CSSProperties
                  }
                />
                <span
                  className="w-16 text-right font-semibold"
                  style={{ color: confidenceColors[result.confidence] }}
                >
                  {result.confidence}
                </span>
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Evidence</h3>
              <div className="rounded-md border bg-muted/50 p-4">
                {canHighlight ? (
                   <div>
                    <h4 className="mb-2 text-sm font-semibold">In Context</h4>
                    <HighlightedText text={websiteText} evidence={result.evidence} />
                   </div>
                ) : (
                  <div className="space-y-4">
                    {websiteText && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Original Text</h4>
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{websiteText}</p>
                      </div>
                    )}
                    {result.evidence && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Identified Evidence</h4>
                        <blockquote className="border-l-2 border-accent pl-4 italic text-muted-foreground">
                          {result.evidence}
                        </blockquote>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 py-8 text-center">
             <ShieldCheck className="h-16 w-16 text-green-500" />
            <p className="text-lg font-medium">Analysis Complete</p>
            <p className="text-muted-foreground">
              Our analysis did not find any clear examples of the dark patterns
              we screen for in the text you provided.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
