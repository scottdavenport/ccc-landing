import { Hero } from '@/components/Hero'
import { PastWinners } from '@/components/PastWinners'
import { Sponsors } from '@/components/Sponsors'
import { FundsRaised } from '@/components/FundsRaised'

export default function Home() {
  return (
    <main>
      <Hero />
      <PastWinners />
      <Sponsors />
      <FundsRaised />
    </main>
  )
}
