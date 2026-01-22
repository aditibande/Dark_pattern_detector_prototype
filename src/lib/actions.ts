'use server';

import { analyzeWebsiteText } from '@/ai/flows/analyze-website-dark-patterns';
import type { FormState } from '@/lib/types';
import { z } from 'zod';

const schema = z.object({
  websiteText: z
    .string()
    .min(50, 'Please enter at least 50 characters of text to analyze.')
    .max(5000, 'Text cannot exceed 5000 characters.'),
});

export async function analyze(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const websiteText = formData.get('websiteText') as string;
  const parsed = schema.safeParse({
    websiteText,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    const result = await analyzeWebsiteText({
      websiteText: parsed.data.websiteText,
    });
    return { result, websiteText: parsed.data.websiteText, error: null };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred. Please try again.',
      websiteText,
    };
  }
}
