
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center text-white p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[2px]" />
      <div className="container relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center justify-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl"
        >
          <img 
            src="/lovable-uploads/8cc5ded8-5c57-4ba4-9a71-10e393bcbdf4.png" 
            alt="Craven Cancer Classic Logo" 
            className="w-full object-contain mx-auto"
          />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed hero-text-shadow"
        >
          Join us in our mission to support cancer patients through the power of golf
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white text-xl px-12 py-7 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Donate Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
