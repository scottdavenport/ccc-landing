
import { motion } from 'framer-motion';
import { Navigation } from './Navigation';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-ccc-teal-dark via-ccc-teal to-ccc-teal-light text-white overflow-hidden">
      <Navigation />
      {/* Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ccc-teal-dark/80 via-transparent to-transparent" />
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center space-y-16 max-w-5xl mx-auto">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-lg mx-auto"
          >
            <img 
              src="/ccc-logo.svg" 
              alt="Craven Cancer Classic Logo" 
              className="w-full h-auto filter drop-shadow-2xl"
            />
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-center space-y-8"
          >
            <p className="text-xl md:text-2xl font-light text-ccc-gray-light max-w-2xl mx-auto leading-relaxed">
              Join us in our mission to support cancer patients through the power of golf
            </p>
            
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 bg-white hover:bg-ccc-gray-light text-ccc-teal-dark text-xl px-16 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 uppercase tracking-wider font-bold ring-1 ring-white/10"
            >
              Donate Now
            </motion.button>
          </motion.div>
        </div>

        {/* Bouncing Arrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: 1,
            y: 10
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5,
            ease: "easeInOut"
          }}
          className="fixed bottom-0 left-1/2 transform -translate-x-1/2"
        >
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-white"
          >
            <path 
              d="M7 13L12 18L17 13M7 6L12 11L17 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
