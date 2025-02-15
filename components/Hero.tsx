'use client';

import { motion } from 'framer-motion';
import { Navigation } from './Navigation';

/**
 * Animation configuration for the hero section elements
 */
const animations = {
  /** Logo animation settings */
  logo: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: "easeOut" }
  },
  /** Content animation settings */
  content: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.3, ease: "easeOut" }
  },
  /** Donate button animation settings */
  button: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, delay: 0.6 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  },
  /** Bouncing arrow animation settings */
  arrow: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 10 },
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as const,  // Type assertion to fix TypeScript error
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};

/**
 * The hero section component for the landing page
 * 
 * @remarks
 * This component creates an animated hero section with:
 * - A full-screen gradient background
 * - Navigation menu
 * - Animated logo
 * - Mission statement
 * - Call-to-action button
 * - Bouncing scroll indicator
 * 
 * All animations are handled by Framer Motion for smooth, performant transitions.
 * 
 * @example
 * ```tsx
 * function LandingPage() {
 *   return (
 *     <main>
 *       <Hero />
 *       <OtherContent />
 *     </main>
 *   );
 * }
 * ```
 */
export const Hero = () => {
  return (
    // This is our main section - it takes up the whole screen and has pretty colors
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-ccc-teal-dark via-ccc-teal to-ccc-teal-light text-white overflow-hidden">
      {/* Our navigation menu goes at the top */}
      <Navigation />

      {/* These are like layers of paint that make our background look fancy */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ccc-teal-dark/80 via-transparent to-transparent" />
      
      {/* This container holds all our main content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center space-y-16 max-w-5xl mx-auto">
          {/* Animated logo */}
          <motion.div 
            {...animations.logo}
            className="w-full max-w-lg mx-auto"
          >
            <img 
              src="/ccc-logo.svg" 
              alt="Craven Cancer Classic Logo" 
              className="w-full h-auto filter drop-shadow-2xl"  // Add a nice shadow
            />
          </motion.div>

          {/* Animated content section */}
          <motion.div 
            {...animations.content}
            className="text-center space-y-8"
          >
            {/* Our mission statement */}
            <p className="text-xl md:text-2xl font-light text-ccc-gray-light max-w-2xl mx-auto leading-relaxed">
              Join us in our mission to support cancer patients through the power of golf
            </p>
            
            {/* Animated call-to-action button */}
            <motion.button
              initial={animations.button.initial}
              animate={animations.button.animate}
              transition={animations.button.transition}
              whileHover={animations.button.hover}
              whileTap={animations.button.tap}
              className="mt-8 bg-white hover:bg-ccc-gray-light text-ccc-teal-dark text-xl px-16 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 uppercase tracking-wider font-bold ring-1 ring-white/10"
            >
              Donate Now
            </motion.button>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          {...animations.arrow}
          className="fixed bottom-0 left-1/2 transform -translate-x-1/2"
        >
          {/* This is our arrow shape */}
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
