import Navbar from '@/components/shared/Navbar'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import VideoShowcase from '@/components/sections/VideoShowcase'
import HowItWorks from '@/components/sections/HowItWorks'
import Pricing from '@/components/sections/Pricing'
import Waitlist from '@/components/sections/Waitlist'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <VideoShowcase />
      <HowItWorks />
      <Pricing />
      <Waitlist />
      <Footer />
    </main>
  )
}
