"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface CustomPage {
  id: number
  title: string
  slug: string
  status: "published" | "draft"
  updated_at: string
}

export default function PagesManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [pages, setPages] = useState<CustomPage[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/pages")
      const data = await response.json()
      setPages(data.pages || [])
    } catch (error) {
      console.error("Failed to fetch pages:", error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
      return
    }

    fetchPages()
  }, [router])

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this page?")) {
      try {
        const response = await fetch(`/api/pages/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchPages()
          toast({
            variant: "success",
            title: "Success!",
            description: "Page deleted successfully!",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete page",
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete page",
        })
      }
    }
  }

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
              <h1 className="text-xl font-semibold text-gray-900">Pages Management</h1>
            </div>
            <Link href="/admin/pages/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Page
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search pages..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pages List */}
        <Card>
          <CardHeader>
            <CardTitle>All Pages ({filteredPages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-900">{page.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">/{page.slug}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          page.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {page.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Updated {new Date(page.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {page.status === "published" && (
                      <Link href={`/${page.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/pages/edit/${page.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPages.length === 0 && (
              <div className="text-center py-12">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "No pages match your search." : "Create your first page to get started."}
                </p>
                {!searchTerm && (
                  <Link href="/admin/pages/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Page
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
