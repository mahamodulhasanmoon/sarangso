"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  FileText,
  ImageIcon,
  Settings,
  Users,
  PlusCircle,
  Eye,
  Edit,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalScreenshots: number;
  totalPages: number;
  totalFeatures: number;
}

interface RecentPost {
  id: number;
  title: string;
  status: string;
  created_at: string;
  slug: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalScreenshots: 0,
    totalPages: 0,
    totalFeatures: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
    } else {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const statsResponse = await fetch("/api/admin/dashboard/stats");
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch recent posts
      const postsResponse = await fetch("/api/admin/dashboard/recent-posts");
      const postsData = await postsResponse.json();
      setRecentPosts(postsData.posts || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  const dashboardStats = [
    {
      title: "Total Blog Posts",
      value: loading ? "..." : stats.totalPosts.toString(),
      icon: FileText,
      color: "text-blue-600",
      subtitle: `${stats.publishedPosts} published, ${stats.draftPosts} drafts`,
    },
    {
      title: "Screenshots",
      value: loading ? "..." : stats.totalScreenshots.toString(),
      icon: ImageIcon,
      color: "text-green-600",
      subtitle: "App gallery images",
    },
    {
      title: "Custom Pages",
      value: loading ? "..." : stats.totalPages.toString(),
      icon: Users,
      color: "text-purple-600",
      subtitle: "Static pages",
    },
    {
      title: "App Features",
      value: loading ? "..." : stats.totalFeatures.toString(),
      icon: BarChart3,
      color: "text-orange-600",
      subtitle: "Homepage features",
    },
  ];

  const quickActions = [
    {
      title: "New Blog Post",
      href: "/admin/blog/new",
      icon: PlusCircle,
      color: "bg-blue-600",
    },
    {
      title: "Upload Screenshot",
      href: "/admin/screenshots",
      icon: ImageIcon,
      color: "bg-green-600",
    },
    {
      title: "Manage Features",
      href: "/admin/features",
      icon: Settings,
      color: "bg-purple-600",
    },
    {
      title: "Create Page",
      href: "/admin/pages/new",
      icon: FileText,
      color: "bg-orange-600",
    },
    {
      title: "Admin Profile",
      href: "/admin/profile",
      icon: User,
      color: "bg-indigo-600",
    },
    {
      title: "Site Settings",
      href: "/admin/settings",
      icon: Settings,
      color: "bg-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" target="_blank" className="flex items-center">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.subtitle}
                      </p>
                    )}
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Button variant="ghost" className="w-full justify-start">
                      <div
                        className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}
                      >
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      {action.title}
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Blog Posts</CardTitle>
                  <CardDescription>Manage your latest content</CardDescription>
                </div>
                <Link href="/admin/blog">
                  <Button size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentPosts.length > 0 ? (
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {post.title}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                post.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {post.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No blog posts yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first blog post to get started.
                    </p>
                    <Link href="/admin/blog/new">
                      <Button>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create Post
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
