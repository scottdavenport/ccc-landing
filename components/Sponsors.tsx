
'use client'

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sponsors = [
  { name: "Platinum Sponsor 1", level: "Platinum", logo: "/sponsor-placeholder.svg" },
  { name: "Platinum Sponsor 2", level: "Platinum", logo: "/sponsor-placeholder.svg" },
  { name: "Gold Sponsor 1", level: "Gold", logo: "/sponsor-placeholder.svg" },
  { name: "Gold Sponsor 2", level: "Gold", logo: "/sponsor-placeholder.svg" },
  { name: "Silver Sponsor 1", level: "Silver", logo: "/sponsor-placeholder.svg" },
  { name: "Silver Sponsor 2", level: "Silver", logo: "/sponsor-placeholder.svg" },
]

const getLevelStyle = (level: string) => {
  switch (level) {
    case 'Platinum':
      return 'bg-primary text-primary-foreground'
    case 'Gold':
      return 'bg-secondary text-secondary-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export const Sponsors = () => {
  return (
    <section className="py-20">
      <div className="container">
        <motion.h2
          className="text-3xl md:text-4xl font-serif text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Sponsors
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-video relative bg-muted rounded-t-lg overflow-hidden">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{sponsor.name}</h3>
                  <Badge className={getLevelStyle(sponsor.level)}>
                    {sponsor.level}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
