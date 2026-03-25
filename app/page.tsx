import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Services from '@/components/Services'
import About from '@/components/About'
import TrustSection from '@/components/TrustSection'
import Download from '@/components/Download'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <About />
      <TrustSection />
      <Download />
      <Contact />
      <Footer />
    </main>
  )
}
