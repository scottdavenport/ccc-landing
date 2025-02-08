
import { Hero } from "@/components/Hero";
import { FundsRaised } from "@/components/FundsRaised";
import { Sponsors } from "@/components/Sponsors";
import { PastWinners } from "@/components/PastWinners";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <FundsRaised />
      <Sponsors />
      <PastWinners />
    </main>
  );
};

export default Index;
