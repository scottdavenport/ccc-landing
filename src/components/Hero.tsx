
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center bg-no-repeat text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center space-y-12 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-3xl"
          >
            <img 
              src="/lovable-uploads/8cc5ded8-5c57-4ba4-9a71-10e393bcbdf4.png" 
              alt="Craven Cancer Classic Logo" 
              className="w-full object-contain mx-auto drop-shadow-2xl"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light tracking-wide max-w-3xl mx-auto leading-relaxed mb-8 hero-text-shadow font-serif">
              Join us in our mission to support cancer patients through the 
              <span className="text-primary font-medium"> power of golf</span>
            </h2>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white text-xl px-12 py-8 rounded-full shadow-lg transition-all duration-300 uppercase tracking-wider font-medium"
              >
                Donate Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="animate-bounce">
          <svg 
            className="w-6 h-6 text-white/70" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </motion.div>
    </section>
  );
};
