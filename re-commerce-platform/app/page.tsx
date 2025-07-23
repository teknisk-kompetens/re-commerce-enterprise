
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-section'
import PlatformSlideshow from '@/components/platform-slideshow'
import ContactForm from '@/components/contact-form'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PlatformSlideshow />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
