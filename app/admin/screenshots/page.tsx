"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, Upload, X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Screenshot {
  id: number
  title: string
  description: string
  image_url: string
  sort_order: number
}

export default function ScreenshotsManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingScreenshot, setEditingScreenshot] = useState<Screenshot | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
  })
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
      return
    }

    fetchScreenshots()
  }, [router])

  const fetchScreenshots = async () => {
    try {
      const response = await fetch("/api/screenshots")
      const data = await response.json()
      setScreenshots(data.screenshots || [])
    } catch (error) {
      console.error("Failed to fetch screenshots:", error)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image_url: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingScreenshot ? `/api/screenshots/${editingScreenshot.id}` : "/api/screenshots"
      const method = editingScreenshot ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchScreenshots()
        setIsDialogOpen(false)
        resetForm()
        toast({
          variant: "success",
          title: "Success!",
          description: `Screenshot ${editingScreenshot ? "updated" : "added"} successfully!`,
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save screenshot",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save screenshot. Please try again.",
      })
    }
  }

  const handleEdit = (screenshot: Screenshot) => {
    setEditingScreenshot(screenshot)
    setFormData({
      title: screenshot.title,
      description: screenshot.description,
      image_url: screenshot.image_url,
    })
    setImagePreview(screenshot.image_url)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this screenshot?")) {
      try {
        const response = await fetch(`/api/screenshots/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchScreenshots()
          toast({
            variant: "success",
            title: "Success!",
            description: "Screenshot deleted successfully!",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete screenshot",
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete screenshot",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({ title: "", description: "", image_url: "" })
    setImagePreview("")
    setEditingScreenshot(null)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    resetForm()
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
              <h1 className="text-xl font-semibold text-gray-900">Screenshots Management</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingScreenshot(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Screenshot
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingScreenshot ? "Edit Screenshot" : "Add New Screenshot"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input
                      placeholder="Screenshot title..."
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Textarea
                      placeholder="Brief description..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Screenshot preview"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            onClick={() => {
                              setImagePreview("")
                              setFormData((prev) => ({ ...prev, image_url: "" }))
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Upload screenshot image</p>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button type="button" variant="outline" className="w-full bg-transparent" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Image
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingScreenshot ? "Update" : "Add"} Screenshot</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>App Screenshots ({screenshots.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {screenshots.map((screenshot) => (
                <div
                  key={screenshot.id}
                  className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[3/5] overflow-hidden">
                    <img
                      src={screenshot.image_url || "/placeholder.svg"}
                      alt={screenshot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{screenshot.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{screenshot.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <GripVertical className="w-4 h-4 mr-1" />
                        Order: {screenshot.sort_order}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(screenshot)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(screenshot.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {screenshots.length === 0 && (
              <div className="text-center py-12">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No screenshots yet</h3>
                <p className="text-gray-600 mb-4">Add your first app screenshot to get started.</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Screenshot
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
