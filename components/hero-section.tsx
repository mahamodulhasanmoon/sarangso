"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  const settings = useSettings();
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {settings.siteName || "Sarangsho"}
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {settings.tagLine ||
                  "Swipe through the latest trusted news from verified sources worldwide."}
              </p>
              <p className="text-lg text-gray-500">
                {settings.siteDescription ||
                  "Stay informed with Sarangsho. Swipe through the latest trusted news from verified sources worldwide."}
              </p>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="{settings.appStoreLink || '#'}"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="flex items-center space-x-3 bg-black hover:bg-gray-800 text-white px-8 py-4"
                >
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <Play className="w-3 h-3 text-black fill-black" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </Button>
              </a>

              <a
                href="{settings.playStoreLink || '#'}"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center space-x-3 border-2 px-8 py-4 bg-transparent"
                >
                  <div className="w-6 h-6">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="currentColor"
                        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-500">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-500">News Sources</div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative mx-auto w-80 h-[600px]">
              {/* Phone Frame */}
              <div className="absolute inset-0 bg-gray-900 rounded-[3rem] p-2">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>

                  {/* Screen Content */}
                  {settings.heroImage ? (
                    <img
                      src={settings.heroImage}
                      alt="Hero Image"
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="pt-8 h-full bg-gradient-to-b from-blue-100 to-purple-100">
                      <div className="px-4 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                          <div className="text-lg font-bold">Sarangsho</div>
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        </div>

                        {/* News Cards */}
                        <div className="space-y-3">
                          <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="w-full h-32 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl mb-3"></div>
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="w-full h-32 bg-gradient-to-r from-purple-200 to-purple-300 rounded-xl mb-3"></div>
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
