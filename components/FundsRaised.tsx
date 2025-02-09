
'use client'

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export const FundsRaised = () => {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const [count, setCount] = useState(0)
  const target = 1250000 // $1.25M

  useEffect(() => {
    if (isInView) {
      const duration = 2000 // 2 seconds
      const steps = 50
      const stepValue = target / steps
      let current = 0

      const timer = setInterval(() => {
        current += stepValue
        if (current >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(current)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView])

  return (
    <section className="py-20 bg-muted/50">
      <div className="container max-w-4xl">
        <Card className="bg-background/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-serif"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Funds Raised to Date
              </motion.h2>
              <motion.div 
                className="text-5xl md:text-7xl font-bold text-primary"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                ${count.toLocaleString()}
              </motion.div>
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Supporting cancer patients and their families
              </motion.p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
