import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ScreenshotsGallery } from "@/components/screenshots-gallery"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ScreenshotsGallery />
      <BlogSection />
      <Footer />
    </div>
  )
}
