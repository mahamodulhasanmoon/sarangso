"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface Feature {
  id: number
  title: string
  description: string
  icon: string
  gradient: string
  sort_order: number
  is_active: boolean
}

const iconOptions = [
  { value: "Smartphone", label: "Smartphone" },
  { value: "Search", label: "Search" },
  { value: "Shield", label: "Shield" },
  { value: "Zap", label: "Zap" },
  { value: "Globe", label: "Globe" },
  { value: "Star", label: "Star" },
]

const gradientOptions = [
  { value: "from-blue-500 to-cyan-500", label: "Blue to Cyan" },
  { value: "from-purple-500 to-pink-500", label: "Purple to Pink" },
  { value: "from-green-500 to-teal-500", label: "Green to Teal" },
  { value: "from-orange-500 to-red-500", label: "Orange to Red" },
  { value: "from-indigo-500 to-purple-500", label: "Indigo to Purple" },
  { value: "from-yellow-500 to-orange-500", label: "Yellow to Orange" },
]

export default function FeaturesManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [features, setFeatures] = useState<Feature[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Smartphone",
    gradient: "from-blue-500 to-cyan-500",
    is_active: true,
  })

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
      return
    }

    fetchFeatures()
  }, [router])

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/features")
      const data = await response.json()
      setFeatures(data.features || [])
    } catch (error) {
      console.error("Failed to fetch features:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingFeature ? `/api/features/${editingFeature.id}` : "/api/features"
      const method = editingFeature ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchFeatures()
        setIsDialogOpen(false)
        resetForm()
        toast({
          variant: "success",
          title: "Success!",
          description: `Feature ${editingFeature ? "updated" : "added"} successfully!`,
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save feature",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save feature. Please try again.",
      })
    }
  }

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature)
    setFormData({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      gradient: feature.gradient,
      is_active: feature.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this feature?")) {
      try {
        const response = await fetch(`/api/features/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchFeatures()
          toast({
            variant: "success",
            title: "Success!",
            description: "Feature deleted successfully!",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete feature",
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete feature",
        })
      }
    }
  }

  const toggleFeatureStatus = async (id: number, is_active: boolean) => {
    try {
      const response = await fetch(`/api/features/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active }),
      })

      if (response.ok) {
        await fetchFeatures()
        toast({
          variant: "success",
          title: "Success!",
          description: `Feature ${is_active ? "activated" : "deactivated"} successfully!`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update feature status",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update feature status",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "Smartphone",
      gradient: "from-blue-500 to-cyan-500",
      is_active: true,
    })
    setEditingFeature(null)
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
              <h1 className="text-xl font-semibold text-gray-900">App Features Management</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingFeature(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingFeature ? "Edit Feature" : "Add New Feature"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input
                      placeholder="Feature title..."
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Textarea
                      placeholder="Feature description..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <Select
                        value={formData.icon}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gradient</label>
                      <Select
                        value={formData.gradient}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, gradient: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gradientOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                    />
                    <label className="text-sm font-medium text-gray-700">Active</label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingFeature ? "Update" : "Add"} Feature</Button>
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
            <CardTitle>App Features ({features.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}
                    >
                      <span className="text-white text-xs font-bold">{feature.icon.charAt(0)}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">Icon: {feature.icon}</span>
                      <span className="text-xs text-gray-500">Order: {feature.sort_order}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatureStatus(feature.id, !feature.is_active)}
                      className={feature.is_active ? "text-green-600" : "text-gray-400"}
                    >
                      {feature.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(feature)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(feature.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {features.length === 0 && (
              <div className="text-center py-12">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No features yet</h3>
                <p className="text-gray-600 mb-4">Add your first app feature to get started.</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
