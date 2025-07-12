"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Save, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/rich-text-editor"
import { createSlug, validateSlug } from "@/lib/utils/slug"
import { useToast } from "@/hooks/use-toast"

export default function NewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [page, setPage] = useState({
    title: "",
    slug: "",
    content: "",
    status: "draft",
    seoTitle: "",
    seoDescription: "",
  })
  const [slugError, setSlugError] = useState("")
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
    }
  }, [router])

  // Auto-generate slug from title
  useEffect(() => {
    if (page.title && isGeneratingSlug) {
      const newSlug = createSlug(page.title)
      setPage((prev) => ({ ...prev, slug: newSlug }))
      setSlugError("")
    }
  }, [page.title, isGeneratingSlug])

  const handleSlugChange = (value: string) => {
    setIsGeneratingSlug(false)
    setPage((prev) => ({ ...prev, slug: value }))

    if (value && !validateSlug(value)) {
      setSlugError("Slug can only contain lowercase letters, numbers, and hyphens")
    } else {
      setSlugError("")
    }
  }

  const handleSave = async (status: "draft" | "published") => {
    if (slugError) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the slug error before saving",
      })
      return
    }

    const pageData = { ...page, status }

    try {
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      })

      if (response.ok) {
        toast({
          variant: "success",
          title: "Success!",
          description: `Page ${status === "published" ? "published" : "saved as draft"} successfully!`,
        })
        router.push("/admin/pages")
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save page",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save page. Please try again.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/pages">
                <Button variant="ghost" size="sm">
                  ← Back to Pages
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">New Page</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => handleSave("draft")}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => handleSave("published")}>
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Input
                    placeholder="Enter page title..."
                    value={page.title}
                    onChange={(e) => setPage((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <Input
                    placeholder="page-url-slug"
                    value={page.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className={slugError ? "border-red-500" : ""}
                  />
                  {slugError && <p className="text-sm text-red-600 mt-1">{slugError}</p>}
                  <p className="text-sm text-gray-500 mt-1">URL: /{page.slug || "page-slug"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <RichTextEditor
                    value={page.content}
                    onChange={(content) => setPage((prev) => ({ ...prev, content }))}
                    placeholder="Write your page content here..."
                    height={600}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                  <Input
                    placeholder="SEO optimized title..."
                    value={page.seoTitle}
                    onChange={(e) => setPage((prev) => ({ ...prev, seoTitle: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                  <Textarea
                    placeholder="Meta description for search engines..."
                    rows={3}
                    value={page.seoDescription}
                    onChange={(e) => setPage((prev) => ({ ...prev, seoDescription: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Select
                    value={page.status}
                    onValueChange={(value) => setPage((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
