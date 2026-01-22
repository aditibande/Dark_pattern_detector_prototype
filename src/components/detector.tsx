'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { analyze } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X } from 'lucide-react';
import { AnalysisResultCard } from './analysis-result-card';
import type { FormState } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

const initialState: FormState = {
  result: null,
  error: null,
  websiteText: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Analyze
    </Button>
  );
}

function LoadingState() {
  return (
    <Card className="w-full">
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[95%]" />
      </div>
    </Card>
  );
}

export function Detector() {
  const [state, formAction] = useFormState(analyze, initialState);
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pending } = useFormStatus();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  useEffect(() => {
    if (state.result) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      formRef.current?.reset();
      clearImage();
    }
  }, [state.result]);

  return (
    <div className="w-full space-y-8">
      <form ref={formRef} action={formAction} className="w-full space-y-6">
        <Textarea
          name="websiteText"
          placeholder="Enter website content here, or upload an image below. Text must be at least 50 characters."
          className="min-h-[150px] w-full rounded-lg border-2 border-border bg-card p-4 text-base shadow-sm focus-visible:ring-ring focus-visible:ring-2"
        />

        <Card
            className="border-2 border-dashed bg-muted hover:border-muted-foreground/50 hover:cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
        >
            <CardContent className="flex flex-col items-center justify-center space-y-2 p-6 text-xs">
            {!imagePreview ? (
                <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span className="font-medium">Drag & drop an image or click to upload</span>
                    <span>PNG, JPG, or WEBP (max 4MB)</span>
                </div>
            ) : (
                <div className="relative">
                    <img src={imagePreview} alt="Image Preview" className="max-h-48 rounded-md" />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            clearImage();
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            </CardContent>
        </Card>
        <input
            ref={fileInputRef}
            type="file"
            name="imageFile"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
        />

        <div className="flex justify-center">
          <SubmitButton />
        </div>
      </form>

      <div ref={resultRef}>
        {pending ? (
          <LoadingState />
        ) : state.result && state.websiteText !== undefined ? (
          <AnalysisResultCard result={state.result} websiteText={state.websiteText || ''} />
        ) : null}
      </div>
    </div>
  );
}
