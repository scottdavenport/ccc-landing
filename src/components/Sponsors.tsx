
import { motion } from "framer-motion";

const sponsors = [
  { name: "Platinum Sponsor 1", level: "Platinum", logo: "/sponsor-placeholder.svg" },
  { name: "Platinum Sponsor 2", level: "Platinum", logo: "/sponsor-placeholder.svg" },
  { name: "Gold Sponsor 1", level: "Gold", logo: "/sponsor-placeholder.svg" },
  { name: "Gold Sponsor 2", level: "Gold", logo: "/sponsor-placeholder.svg" },
  { name: "Silver Sponsor 1", level: "Silver", logo: "/sponsor-placeholder.svg" },
  { name: "Silver Sponsor 2", level: "Silver", logo: "/sponsor-placeholder.svg" },
];

export const Sponsors = () => {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">Our Sponsors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white shadow-lg p-6 rounded-xl hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-video relative mb-4 bg-ccc-gray-light rounded-lg overflow-hidden">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-ccc-gray-dark">{sponsor.name}</h3>
              <span className={`inline-block px-4 py-1 text-sm rounded-full ${
                sponsor.level === 'Platinum' ? 'bg-ccc-teal text-white' :
                sponsor.level === 'Gold' ? 'bg-ccc-teal-light text-ccc-teal-dark' :
                'bg-ccc-gray-light text-ccc-gray-dark'
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
