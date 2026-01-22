'use server';

import { analyzeWebsiteText } from '@/ai/flows/analyze-website-dark-patterns';
import type { FormState } from '@/lib/types';
import { z } from 'zod';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const schema = z.object({
    websiteText: z.string().max(5000, 'Text cannot exceed 5000 characters.').optional(),
    imageFile: z.custom<File>().optional()
}).refine(data => {
    return data.websiteText || data.imageFile
}, {
    message: "Please enter text or upload an image to analyze.",
    path: ["websiteText"],
}).refine(data => {
    if (data.websiteText && !data.imageFile) {
        return data.websiteText.length >= 50;
    }
    return true;
}, {
    message: "Please enter at least 50 characters of text, or also upload an image.",
    path: ["websiteText"],
}).refine(data => {
    if (data.imageFile) {
        return data.imageFile.size <= MAX_FILE_SIZE;
    }
    return true;
}, {
    message: `Max image size is 4MB.`,
    path: ["imageFile"],
}).refine(data => {
    if (data.imageFile) {
        return ACCEPTED_IMAGE_TYPES.includes(data.imageFile.type);
    }
    return true;
}, {
    message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
    path: ["imageFile"],
});


export async function analyze(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const websiteText = formData.get('websiteText') as string;
  const imageFile = formData.get('imageFile') as File;

  const parsed = schema.safeParse({
    websiteText: websiteText || undefined,
    imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const errorMessage = fieldErrors.websiteText?.[0] || fieldErrors.imageFile?.[0] || parsed.error.flatten().formErrors?.[0] || 'Invalid input.';
    return { error: errorMessage, websiteText };
  }

  try {
    const textToAnalyze = parsed.data.websiteText;
    let imageDataUri: string | undefined = undefined;
    if (parsed.data.imageFile) {
      const file = parsed.data.imageFile;
      const buffer = Buffer.from(await file.arrayBuffer());
      imageDataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    const result = await analyzeWebsiteText({
      websiteText: textToAnalyze,
      imageDataUri,
    });
    return { result, websiteText: textToAnalyze || '', error: null };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred. Please try again.',
      websiteText,
    };
  }
}
