import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getAllBlogPosts } from "@/lib/data"
import { PageHeader } from "@/components/shared/page-header"
import { BlogPostCard } from "@/components/blog/blog-post-card"

export default function BlogPage() {
  const blogPosts = getAllBlogPosts()

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in-up">
      {/* 头部 */}
      <PageHeader title="我的数字花园" description="一个关于 Web 开发、设计和前沿技术的文章集合。" />

      {/* 搜索与筛选 */}
      <div className="max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="搜索文章..." className="pl-10" />
        </div>
      </div>

      {/* 博客网格 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
