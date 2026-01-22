import { Detector } from '@/components/detector';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background py-8 sm:py-16">
      <main className="container flex w-full max-w-4xl flex-grow flex-col items-center px-4">
        <header className="mb-10 flex w-full flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-primary p-3">
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Dark Pattern Detective
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Uncover deceptive designs. Paste website text below to analyze it for
            common dark patterns using our AI-powered tool.
          </p>
        </header>
        <Detector />
      </main>
      <footer className="w-full text-center text-sm text-muted-foreground mt-16 px-4">
        <p>&copy; {new Date().getFullYear()} Dark Pattern Detective. AI-powered analysis for a fairer web.</p>
      </footer>
    </div>
  );
}
