"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Screenshot {
  id: number
  title: string
  description: string
  image_url: string
  sort_order: number
}

export function ScreenshotsGallery() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScreenshots()
  }, [])

  const fetchScreenshots = async () => {
    try {
      const response = await fetch("/api/screenshots")
      const data = await response.json()
      setScreenshots(data.screenshots || [])
    } catch (error) {
      console.error("Failed to fetch screenshots:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  if (loading) {
    return (
      <section id="screenshots" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="w-48 h-96 bg-gray-200 rounded-[2rem]"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (screenshots.length === 0) {
    return (
      <section id="screenshots" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">App Screenshots</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Screenshots will be displayed here once they are added from the admin panel.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="screenshots" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">App Screenshots</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a look at Sarangsho's intuitive interface designed for seamless news consumption.
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="flex justify-center">
            <div className="relative w-64 h-[500px]">
              <div className="absolute inset-0 bg-gray-900 rounded-[2rem] p-1">
                <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
                  <img
                    src={screenshots[currentIndex]?.image_url || "/placeholder.svg"}
                    alt={screenshots[currentIndex]?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button variant="outline" size="icon" onClick={prevSlide}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">{screenshots[currentIndex]?.title}</h3>
              <p className="text-sm text-gray-600">{screenshots[currentIndex]?.description}</p>
            </div>
            <Button variant="outline" size="icon" onClick={nextSlide}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
          {screenshots.map((screenshot, index) => (
            <div key={screenshot.id} className="group">
              <div className="relative w-48 h-96 mb-4">
                <div className="absolute inset-0 bg-gray-900 rounded-[2rem] p-1 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
                    <img
                      src={screenshot.image_url || "/placeholder.svg"}
                      alt={screenshot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">{screenshot.title}</h3>
                <p className="text-sm text-gray-600">{screenshot.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
