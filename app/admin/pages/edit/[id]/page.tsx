"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Eye, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import { createSlug, validateSlug } from "@/lib/utils/slug";

export default function EditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState({
    title: "",
    slug: "",
    content: "",
    status: "draft",
    seoTitle: "",
    seoDescription: "",
  });
  const [slugError, setSlugError] = useState("");
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }

    fetchPage();
  }, [router, params.id]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/pages/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const pageData = data.post;
        setPage({
          title: pageData.title,
          slug: pageData.slug,
          content: pageData.content,
          status: pageData.status,
          seoTitle: pageData.seo_title,
          seoDescription: pageData.seo_description,
        });
      } else if (response.status === 404) {
        toast({
          variant: "destructive",
          title: "Page Not Found",
          description: "The page you're trying to edit does not exist.",
        });
        router.push("/admin/pages");
      } else {
        throw new Error("Failed to fetch page");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load page data.",
      });
      //   router.push("/admin/pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page.title && isGeneratingSlug) {
      const newSlug = createSlug(page.title);
      setPage((prev) => ({ ...prev, slug: newSlug }));
      setSlugError("");
    }
  }, [page.title, isGeneratingSlug]);

  const handleSlugChange = (value: string) => {
    setIsGeneratingSlug(false);
    setPage((prev) => ({ ...prev, slug: value }));

    if (value && !validateSlug(value)) {
      setSlugError(
        "Slug can only contain lowercase letters, numbers, and hyphens."
      );
    } else {
      setSlugError("");
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (slugError) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please correct the slug error before saving.",
      });
      return;
    }

    const pageData = { ...page, status };

    try {
      const response = await fetch(`/api/pages/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Saved Successfully",
          description:
            status === "published" ? "Page published." : "Draft saved.",
        });
        router.push("/admin/pages");
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: error.message || "Could not save page.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong while saving the page.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
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
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Pages
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Edit Page</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => handleSave("draft")}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => handleSave("published")}>
                <Eye className="w-4 h-4 mr-2" />
                {page.status === "published" ? "Update" : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                placeholder="Page title"
                value={page.title}
                onChange={(e) => {
                  setPage((prev) => ({ ...prev, title: e.target.value }));
                  setIsGeneratingSlug(true);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <Input
                placeholder="page-url-slug"
                value={page.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className={slugError ? "border-red-500" : ""}
              />
              {slugError && (
                <p className="text-sm text-red-600 mt-1">{slugError}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                URL: /pages/{page.slug || "page-slug"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <RichTextEditor
                value={page.content}
                onChange={(content) =>
                  setPage((prev) => ({ ...prev, content }))
                }
                placeholder="Write your page content..."
                height={400}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <Input
                placeholder="Enter SEO title"
                value={page.seoTitle}
                onChange={(e) =>
                  setPage((prev) => ({ ...prev, seoTitle: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <Textarea
                placeholder="Enter SEO description"
                value={page.seoDescription}
                onChange={(e) =>
                  setPage((prev) => ({
                    ...prev,
                    seoDescription: e.target.value,
                  }))
                }
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
