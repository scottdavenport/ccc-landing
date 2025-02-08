
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center text-white p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="container relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/2a82a323-1214-442e-b9b2-45937604545f.png" 
            alt="Craven Cancer Classic Logo" 
            className="mx-auto w-64 md:w-96"
          />
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 hero-text-shadow"
        >
          Join us in our mission to support cancer patients through the power of golf
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
          >
            Donate Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
