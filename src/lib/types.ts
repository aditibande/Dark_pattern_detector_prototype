import type { AnalyzeWebsiteTextOutput } from '@/ai/flows/analyze-website-dark-patterns';

export type AnalysisResult = AnalyzeWebsiteTextOutput;

export interface FormState {
  result?: AnalysisResult | null;
  error?: string | null;
  websiteText?: string;
}
