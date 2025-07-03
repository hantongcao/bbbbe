import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Share2, ThumbsUp } from "lucide-react"
import Image from "next/image"
import { getBlogPostBySlug } from "@/lib/data"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          返回博客
        </Link>
      </div>

      <article>
        <header className="mb-8">
          <h1 className="font-sans text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <Image
          src={post.imageUrl || "/placeholder.svg"}
          alt={post.title}
          width={1200}
          height={600}
          className="rounded-lg mb-8 w-full object-cover aspect-video"
        />

        {post.content && (
          <div
            className="prose dark:prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </article>

      <footer className="mt-12 pt-8 border-t">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">觉得这篇文章有用吗？</p>
          <div className="flex gap-2">
            <Button variant="outline">
              <ThumbsUp className="h-4 w-4 mr-2" />
              点赞
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              分享
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
