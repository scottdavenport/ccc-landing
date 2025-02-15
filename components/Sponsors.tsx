// Hi! 👋 This tells Next.js we want to use special features like animations
'use client';

// Import our animation tool - it's like magic that makes things move! ✨
import { motion } from "framer-motion";

// Here's our list of sponsors! 🎁
// Think of this like a guest list for a party, where each guest has:
// - a name (who they are)
// - a level (how special they are - Platinum, Gold, or Silver)
// - a logo (their special picture)
const sponsors = [
  { name: "Platinum Sponsor 1", level: "Platinum", logo: "/sponsor-placeholder.svg" },
  { name: "Platinum Sponsor 2", level: "Platinum", logo: "/sponsor-placeholder.svg" },
  { name: "Gold Sponsor 1", level: "Gold", logo: "/sponsor-placeholder.svg" },
  { name: "Gold Sponsor 2", level: "Gold", logo: "/sponsor-placeholder.svg" },
  { name: "Silver Sponsor 1", level: "Silver", logo: "/sponsor-placeholder.svg" },
  { name: "Silver Sponsor 2", level: "Silver", logo: "/sponsor-placeholder.svg" },
];

// This is our special sponsor showcase! 🎉
// It's like a wall of fame where we show off all our amazing sponsors
export const Sponsors = () => {
  return (
    // This is the main section where all our sponsors live
    <section className="py-20">  {/* Add some space above and below */}
      <div className="container">  {/* Keep everything neat and centered */}
        {/* Big fancy title at the top */}
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">Our Sponsors</h2>
        
        {/* This makes a nice grid of sponsor cards */}
        {/* On phones: 1 card per row */}
        {/* On tablets: 2 cards per row */}
        {/* On computers: 3 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* For each sponsor in our list, make a fancy card */}
          {sponsors.map((sponsor, index) => (
            // This is our magical animated card! ✨
            <motion.div
              key={sponsor.name}  // Each card needs a unique name
              initial={{ opacity: 0, y: 20 }}  // Start invisible and below
              whileInView={{ opacity: 1, y: 0 }}  // Fade in and slide up when visible
              transition={{ duration: 0.5, delay: index * 0.1 }}  // Add a nice staggered effect
              className="bg-white shadow-lg p-6 rounded-xl hover:shadow-xl transition-shadow duration-300"
            >
              {/* This is where the sponsor's logo goes */}
              <div className="aspect-video relative mb-4 bg-ccc-gray-light rounded-lg overflow-hidden">
                <img
                  src={sponsor.logo}  // The sponsor's logo image
                  alt={sponsor.name}   // Description for screen readers
                  className="absolute inset-0 w-full h-full object-contain p-4"  // Make the logo fit nicely
                />
              </div>
              {/* The sponsor's name */}
              <h3 className="text-lg font-semibold mb-2 text-ccc-gray-dark">{sponsor.name}</h3>
              
              {/* A pretty badge showing their sponsor level */}
              {/* The color changes based on their level! */}
              <span className={`inline-block px-4 py-1 text-sm rounded-full ${
                sponsor.level === 'Platinum' ? 'bg-ccc-teal text-white' :  // Platinum gets teal
                sponsor.level === 'Gold' ? 'bg-ccc-teal-light text-ccc-teal-dark' :  // Gold gets light teal
                'bg-ccc-gray-light text-ccc-gray-dark'  // Silver gets gray
              }`}>
                {sponsor.level}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
