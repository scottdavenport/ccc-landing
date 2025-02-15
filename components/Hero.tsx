// Hi! 👋 This tells Next.js we want to use special features like animations
'use client';

// Import our magical animation tool and navigation menu ✨
import { motion } from 'framer-motion';  // This makes things move smoothly
import { Navigation } from './Navigation';  // This is our menu at the top

// This is our hero section - it's like the cover of a book! 📖
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
          {/* Our logo appears with a fade-in animation 🌟 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}      // Start invisible and below
            animate={{ opacity: 1, y: 0 }}       // Fade in and move up
            transition={{ duration: 1, ease: "easeOut" }}  // Smooth animation
            className="w-full max-w-lg mx-auto"
          >
            <img 
              src="/ccc-logo.svg" 
              alt="Craven Cancer Classic Logo" 
              className="w-full h-auto filter drop-shadow-2xl"  // Add a nice shadow
            />
          </motion.div>

          {/* Our main message and donate button 💰 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}      // Start invisible and below
            animate={{ opacity: 1, y: 0 }}       // Fade in and move up
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}  // Smooth animation after logo
            className="text-center space-y-8"
          >
            {/* Our mission statement */}
            <p className="text-xl md:text-2xl font-light text-ccc-gray-light max-w-2xl mx-auto leading-relaxed">
              Join us in our mission to support cancer patients through the power of golf
            </p>
            
            {/* A magical donate button that grows when you hover! ✨ */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}  // Start invisible and slightly smaller
              animate={{ opacity: 1, scale: 1 }}     // Fade in and grow to normal size
              transition={{ duration: 0.5, delay: 0.6 }}  // Smooth animation after text
              whileHover={{ 
                scale: 1.02,                        // Grow a little when hovered
                transition: { duration: 0.2 }       // Quick growth animation
              }}
              whileTap={{ scale: 0.98 }}            // Shrink slightly when clicked
              className="mt-8 bg-white hover:bg-ccc-gray-light text-ccc-teal-dark text-xl px-16 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 uppercase tracking-wider font-bold ring-1 ring-white/10"
            >
              Donate Now
            </motion.button>
          </motion.div>
        </div>

        {/* A fun bouncing arrow that tells people to scroll down! ⬇️ */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}         // Start invisible and up
          animate={{ 
            opacity: 1,                           // Fade in
            y: 10                                 // Move down
          }}
          transition={{
            repeat: Infinity,                     // Keep bouncing forever
            repeatType: "reverse",                // Bounce up and down
            duration: 1.5,                       // Take 1.5 seconds per bounce
            ease: "easeInOut"                    // Smooth bouncing motion
          }}
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
