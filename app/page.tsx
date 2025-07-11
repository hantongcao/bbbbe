import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Rss } from "lucide-react"
import { getRecentBlogPosts } from "@/lib/data"
import { BlogPostCard } from "@/components/blog/blog-post-card"

export default function HomePage() {
  const recentPosts = getRecentBlogPosts()

  return (
    <div className="animate-fade-in-up">
      {/* 英雄区域 */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tight">
              当代码与
              <br />
              <span className="text-primary">创想交汇</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
              欢迎来到我的数字空间。我是一位充满热情的开发者和设计师，致力于探索技术与美学的交集。在这里，我分享我的旅程、见解和创作。
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="group">
                <Link href="/blog">
                  阅读博客
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">联系我</Link>
              </Button>
            </div>
          </div>
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
            <div className="relative rounded-2xl shadow-2xl overflow-hidden">
              <Image
                src="/placeholder.svg?width=500&height=500"
                alt="抽象数字艺术"
                width={500}
                height={500}
                className="rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 近期文章 */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-sans text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Rss className="text-primary" />
              近期文章
            </h2>
            <Button asChild variant="ghost" className="group">
              <Link href="/blog">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} variant="compact" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
