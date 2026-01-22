'use server';

/**
 * @fileOverview Analyzes website text for dark patterns and provides an analysis.
 *
 * - analyzeWebsiteText - A function that analyzes website text for dark patterns.
 * - AnalyzeWebsiteTextInput - The input type for the analyzeWebsiteText function.
 * - AnalyzeWebsiteTextOutput - The return type for the analyzeWebsiteText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeWebsiteTextInputSchema = z.object({
  websiteText: z.string().describe('The text content of the website to analyze.'),
});
export type AnalyzeWebsiteTextInput = z.infer<typeof AnalyzeWebsiteTextInputSchema>;

const AnalyzeWebsiteTextOutputSchema = z.object({
  dark_pattern_detected: z.boolean().describe('Indicates whether a dark pattern was detected.'),
  pattern_type: z
    .string()
    .describe(
      'The type of dark pattern detected, if any.  Must be one of: Fake Urgency, Hidden Costs, Forced Choice, Misleading Language, or None.'
    ),
  evidence: z.string().describe('The exact sentence or phrase from the website exhibiting the dark pattern.'),
  explanation: z.string().describe('An explanation of why the identified text may be considered a dark pattern.'),
  confidence: z.string().describe('The confidence level of the detection (Low, Medium, or High).'),
  disclaimer: z.string().describe('A disclaimer indicating that the analysis is AI-assisted and not a legal judgment.'),
});
export type AnalyzeWebsiteTextOutput = z.infer<typeof AnalyzeWebsiteTextOutputSchema>;

export async function analyzeWebsiteText(input: AnalyzeWebsiteTextInput): Promise<AnalyzeWebsiteTextOutput> {
  return analyzeWebsiteTextFlow(input);
}

const analyzeWebsiteTextPrompt = ai.definePrompt({
  name: 'analyzeWebsiteTextPrompt',
  input: {schema: AnalyzeWebsiteTextInputSchema},
  output: {schema: AnalyzeWebsiteTextOutputSchema},
  prompt: `You are an AI assistant designed to detect dark patterns in websites.

Task:
Analyze the given website text and identify whether it contains any dark patterns.

Focus only on the following dark patterns:
1. Fake urgency or scarcity
2. Hidden or late-revealed costs
3. Pre-selected or forced choices
4. Misleading or ambiguous language

Instructions:
- Carefully read the website text.
- Do NOT assume malicious intent.
- If a pattern is detected, explain WHY it may be considered deceptive.
- Always provide evidence from the text.
- If no dark pattern is found, clearly say so.

Output format (JSON only):
{
  "dark_pattern_detected": true/false,
  "pattern_type": "Fake Urgency | Hidden Costs | Forced Choice | Misleading Language | None",
  "evidence": "Exact sentence or phrase from the website",
  "explanation": "Why this may influence user decision-making",
  "confidence": "Low | Medium | High",
  "disclaimer": "This is an AI-assisted analysis and not a legal judgment."
}

Website Text:
"""
{{{websiteText}}}
"""
`,
});

const analyzeWebsiteTextFlow = ai.defineFlow(
  {
    name: 'analyzeWebsiteTextFlow',
    inputSchema: AnalyzeWebsiteTextInputSchema,
    outputSchema: AnalyzeWebsiteTextOutputSchema,
  },
  async input => {
    const {output} = await analyzeWebsiteTextPrompt(input);
    return output!;
  }
);
