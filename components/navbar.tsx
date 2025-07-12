"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const settings = useSettings();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {settings.logo ? (
              <img
                src={settings.logo || "/logo.svg"}
                alt="Sarangsho Logo"
                className="w-auto h-12 rounded-lg"
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Sarangsho
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#screenshots"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Screenshots
            </Link>
            <Link
              href="/#blog"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Blog
            </Link>
          </div>

          {/* Download Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href={settings.playStoreLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Download className="w-4 h-4" />
                <span>App Store</span>
              </Button>
            </a>
            <a
              href={settings.playStoreLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Download className="w-4 h-4" />
                <span>Play Store</span>
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="#screenshots"
                className="text-gray-600 hover:text-gray-900"
              >
                Screenshots
              </Link>
              <Link href="#blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-gray-900"
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <a
                  href={settings.appStoreLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-center space-x-2 bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                    <span>App Store</span>
                  </Button>
                </a>
                <a
                  href={settings.playStoreLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Download className="w-4 h-4" />
                    <span>Play Store</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
