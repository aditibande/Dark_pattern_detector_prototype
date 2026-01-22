'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { analyze } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { AnalysisResultCard } from './analysis-result-card';
import type { FormState } from '@/lib/types';
import { Card } from './ui/card';
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
      Analyze Text
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
    )
}

export function Detector() {
  const [state, formAction] = useFormState(analyze, initialState);
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);
  const { pending } = useFormStatus();

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
    if(state.result) {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.result]);


  return (
    <div className="w-full space-y-8">
      <form action={formAction} className="w-full space-y-6">
        <Textarea
          name="websiteText"
          placeholder="Enter website content here... For example: 'Limited time offer! Only 2 items left in stock. Buy now or miss out forever!'"
          className="min-h-[200px] w-full rounded-lg border-2 border-border bg-card p-4 text-base shadow-sm focus-visible:ring-ring focus-visible:ring-2"
          required
          defaultValue={initialState.websiteText}
        />
        <div className="flex justify-center">
          <SubmitButton />
        </div>
      </form>

      <div ref={resultRef}>
        {pending ? (
            <LoadingState />
        ) : state.result && state.websiteText ? (
            <AnalysisResultCard result={state.result} websiteText={state.websiteText} />
        ) : null}
      </div>
    </div>
  );
}
