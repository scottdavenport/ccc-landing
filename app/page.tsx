
import { Hero } from "@/components/Hero";
import { FundsRaised } from "@/components/FundsRaised";
import { Sponsors } from "@/components/Sponsors";
import { PastWinners } from "@/components/PastWinners";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Index = () => {
  return (
    <main className="min-h-screen">
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary>
        <FundsRaised />
      </ErrorBoundary>
      <ErrorBoundary>
        <Sponsors />
      </ErrorBoundary>
      <ErrorBoundary>
        <PastWinners />
      </ErrorBoundary>
    </main>
  );
};

export default Index;
