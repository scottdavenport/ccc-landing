
'use client'

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const winners = [
  {
    year: 2023,
    name: "John Smith",
    score: 68,
    achievement: "Tournament Champion",
  },
  {
    year: 2023,
    name: "Sarah Johnson",
    score: 70,
    achievement: "Runner-up",
  },
  {
    year: 2023,
    name: "Michael Williams",
    score: 71,
    achievement: "Third Place",
  },
]

export const PastWinners = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container">
        <motion.h2 
          className="text-3xl md:text-4xl font-serif text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Past Winners
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winners.map((winner, index) => (
            <motion.div
              key={winner.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="text-center">
                  <motion.div 
                    className="mb-4"
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                  >
                    <span className="text-5xl font-serif text-primary">{winner.score}</span>
                  </motion.div>
                  <h3 className="text-xl font-semibold">{winner.name}</h3>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-2">{winner.achievement}</p>
                  <span className="text-sm text-accent font-medium">{winner.year}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
