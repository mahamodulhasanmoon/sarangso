"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copyright, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function SiteSettings() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    seoTitle: "",
    seoDescription: "",
    logo: "",
    favicon: "",
    heroImage: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    socialFacebook: "",
    socialTwitter: "",
    socialInstagram: "",
    socialLinkedin: "",
    googleAnalytics: "",
    metaKeywords: "",
    appStoreLink: "",
    playStoreLink: "",
    footerDescription: "",
    Copyright: "",
    tagLine: "",
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");
  const [heroImagePreview, setHeroImagePreview] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }

    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        if (data.settings.logo) {
          setLogoPreview(data.settings.logo);
        }
        if (data.settings.favicon) {
          setFaviconPreview(data.settings.favicon);
        }
        if (data.settings.heroImage) {
          setHeroImagePreview(data.settings.heroImage);
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setSettings((prev) => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFaviconPreview(result);
        setSettings((prev) => ({ ...prev, favicon: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setHeroImagePreview(result);
        setSettings((prev) => ({ ...prev, heroImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Success!",
          description: "Settings saved successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save settings",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  ← Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Site Settings
              </h1>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <Input
                      value={settings.siteName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          siteName: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Tagline
                    </label>
                    <Input
                      value={settings.tagLine}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          tagLine: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landing Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={settings.siteDescription}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          siteDescription: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Footer Description
                    </label>
                    <Textarea
                      rows={4}
                      value={settings.footerDescription}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          footerDescription: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      App Store Link
                    </label>
                    <Input
                      type="url"
                      placeholder="https://apps.apple.com/app/..."
                      value={settings.appStoreLink}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          appStoreLink: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Play Store Link
                    </label>
                    <Input
                      type="url"
                      placeholder="https://play.google.com/store/apps/..."
                      value={settings.playStoreLink}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          playStoreLink: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Copyright
                    </label>
                    <Input
                      type="text"
                      placeholder="© 2023 Your Company"
                      value={settings.Copyright}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          Copyright: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div className="space-y-4">
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="w-32 h-32 object-contain border rounded-lg"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 bg-white border rounded-full"
                          onClick={() => {
                            setLogoPreview("");
                            setSettings((prev) => ({ ...prev, logo: "" }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-32 h-32 flex flex-col items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600">Upload Logo</p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Logo
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Favicon Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon
                  </label>
                  <div className="space-y-4">
                    {faviconPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={faviconPreview || "/favicon-32x32.png"}
                          alt="Favicon preview"
                          className="w-16 h-16 object-contain border rounded-lg"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 bg-white border rounded-full"
                          onClick={() => {
                            setFaviconPreview("");
                            setSettings((prev) => ({ ...prev, favicon: "" }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center w-16 h-16 flex flex-col items-center justify-center">
                        <Upload className="w-5 h-5 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-600">Upload Favicon</p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconUpload}
                      className="hidden"
                      id="favicon-upload"
                    />
                    <label htmlFor="favicon-upload">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Favicon
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Hero Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image
                  </label>
                  <div className="space-y-4">
                    {heroImagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={heroImagePreview || "/placeholder.svg"}
                          alt="Hero image preview"
                          className="w-full max-w-md h-40 object-cover border rounded-lg"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 bg-white border rounded-full"
                          onClick={() => {
                            setHeroImagePreview("");
                            setSettings((prev) => ({ ...prev, heroImage: "" }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full max-w-md h-40 flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Upload Hero Image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 1200x600px or larger
                        </p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                      id="hero-image-upload"
                    />
                    <label htmlFor="hero-image-upload">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Hero Image
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <Input
                    value={settings.seoTitle}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        seoTitle: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <Textarea
                    rows={3}
                    value={settings.seoDescription}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        seoDescription: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords (comma separated)
                  </label>
                  <Input
                    value={settings.metaKeywords}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        metaKeywords: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Analytics Tracking ID
                  </label>
                  <Input
                    placeholder="UA-XXXXXXXXX-X"
                    value={settings.googleAnalytics}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        googleAnalytics: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <Input
                    value={settings.contactPhone}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        contactPhone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Address
                  </label>
                  <Textarea
                    rows={3}
                    value={settings.contactAddress}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        contactAddress: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://facebook.com/yourpage"
                    value={settings.socialFacebook}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        socialFacebook: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://twitter.com/yourprofile"
                    value={settings.socialTwitter}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        socialTwitter: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://instagram.com/yourprofile"
                    value={settings.socialInstagram}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        socialInstagram: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={settings.socialLinkedin}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        socialLinkedin: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
