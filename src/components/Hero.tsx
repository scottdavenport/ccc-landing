
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center text-white p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="container relative z-10 text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-serif font-bold mb-6 hero-text-shadow"
        >
          Craven Cancer Classic
        </motion.h1>
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
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6"
          >
            Donate Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
