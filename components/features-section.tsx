"use client"

import { useEffect, useState } from "react"
import { Smartphone, Search, Shield, Zap, Globe, Star } from "lucide-react"

interface Feature {
  id: number
  title: string
  description: string
  icon: string
  gradient: string
  sort_order: number
  is_active: boolean
}

const iconMap = {
  Smartphone,
  Search,
  Shield,
  Zap,
  Globe,
  Star,
}

export function FeaturesSection() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/features")
      const data = await response.json()
      setFeatures(data.features || [])
    } catch (error) {
      console.error("Failed to fetch features:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-8 rounded-2xl bg-gray-50">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Sarangsho?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience news consumption like never before with our innovative features designed for the modern reader.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features
            .filter((f) => f.is_active)
            .map((feature) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Smartphone

              return (
                <div
                  key={feature.id}
                  className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}
