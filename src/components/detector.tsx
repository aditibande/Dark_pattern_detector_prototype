'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { analyze } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Upload, X } from 'lucide-react';
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
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto font-semibold">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Analyze
        </>
      )}
    </Button>
  );
}

function LoadingState() {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-8 w-1/4" />
          </div>
          <Separator className="my-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2 rounded-md border p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

export function Detector() {
  const [state, formAction, pending] = useActionState(analyze, initialState);
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      formRef.current?.reset();
      clearImage();
    }
  }, [state.result]);

  return (
    <div className="w-full space-y-8">
      <Card className="p-2 bg-card/80 backdrop-blur-sm border-2">
        <form ref={formRef} action={formAction} className="w-full space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <Textarea
                    name="websiteText"
                    placeholder="Enter website content here (at least 50 characters)..."
                    className="min-h-[160px] w-full rounded-lg border bg-background p-4 text-base shadow-inner focus-visible:ring-primary focus-visible:ring-2"
                />
                
                <Card
                    className="border-2 border-dashed bg-muted/50 hover:border-primary/50 hover:bg-muted/80 hover:cursor-pointer transition-colors flex items-center justify-center group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <CardContent className="flex flex-col items-center justify-center space-y-2 p-6 text-sm">
                    {!imagePreview ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground transition-colors group-hover:text-foreground">
                            <Upload className="h-8 w-8" />
                            <span className="font-medium">Drag & drop or click to upload</span>
                            <span>PNG, JPG, WEBP (max 4MB)</span>
                        </div>
                    ) : (
                        <div className="relative">
                            <img src={imagePreview} alt="Image Preview" className="max-h-48 rounded-md" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-lg"
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
            </div>
            <input
                ref={fileInputRef}
                type="file"
                name="imageFile"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
            />

            <div className="flex justify-center pt-2">
            <SubmitButton />
            </div>
        </form>
      </Card>


      <div ref={resultRef} className="w-full">
        {pending ? (
          <LoadingState />
        ) : state.result ? (
          <AnalysisResultCard result={state.result} websiteText={state.websiteText} />
        ) : null}
      </div>
    </div>
  );
}
