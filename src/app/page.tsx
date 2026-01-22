import { Detector } from '@/components/detector';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8">
      <main className="container flex w-full max-w-4xl flex-grow flex-col items-center">
        <header className="mb-12 flex w-full flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-primary/10 blur-xl glow"></div>
            <div className="relative rounded-full bg-primary/20 p-4 border border-primary/30">
              <ShieldCheck className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Dark Pattern Detective
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Uncover deceptive designs. Paste text or upload an image to analyze websites for common dark patterns using AI.
            </p>
          </div>
        </header>
        <Detector />
      </main>
      <footer className="w-full text-center text-sm text-muted-foreground mt-24 px-4">
        <p>&copy; {new Date().getFullYear()} Dark Pattern Detective. AI-powered analysis for a fairer web.</p>
      </footer>
    </div>
  );
}
