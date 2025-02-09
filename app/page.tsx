import { Hero } from '@/components/Hero'
import { PastWinners } from '@/components/PastWinners'
import { Sponsors } from '@/components/Sponsors'
import { FundsRaised } from '@/components/FundsRaised'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Hero />
      <PastWinners />
      <Sponsors />
      <FundsRaised />
    </main>
  )
}
