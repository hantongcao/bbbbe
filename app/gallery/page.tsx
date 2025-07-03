"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getAllGalleryPosts } from "@/lib/data"
import type { GalleryPost } from "@/lib/types"
import { PageHeader } from "@/components/shared/page-header"
import { usePagination } from "@/hooks/use-pagination"
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox"

const POSTS_PER_PAGE = 3

export default function GalleryPage() {
  const allPosts = getAllGalleryPosts()
  const { currentPage, totalPages, prevPage, nextPage, currentItems } = usePagination(allPosts, POSTS_PER_PAGE)
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null)

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col min-h-[calc(100vh-14rem)] animate-fade-in-up">
        <div className="mb-12">
          <PageHeader title="光影集" description="一个通过我的镜头捕捉，并用文字记录的故事精选集。" />
        </div>

        <div className="flex-grow flex flex-col justify-center space-y-8">
          <div className="flex items-center justify-center gap-2 md:gap-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="h-12 w-12 rounded-full flex-shrink-0 bg-transparent"
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">上一页</span>
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 w-full max-w-5xl">
              {currentItems.map((post) => (
                <Card
                  key={post.id}
                  className="group cursor-pointer overflow-hidden flex flex-col bg-card hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
                  onClick={() => setSelectedPost(post)}
                >
                  <CardContent className="p-0 aspect-[4/5] overflow-hidden">
                    <Image
                      src={post.src.replace("800&height=450", "400&height=500") || "/placeholder.svg"}
                      alt={post.alt}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </CardContent>
                  <CardFooter className="p-4 flex flex-col items-start flex-grow">
                    <h3 className="font-bold text-lg leading-tight">{post.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="h-12 w-12 rounded-full flex-shrink-0 bg-transparent"
            >
              <ArrowRight className="h-6 w-6" />
              <span className="sr-only">下一页</span>
            </Button>
          </div>

          {totalPages > 1 && (
            <div className="text-center text-muted-foreground">
              第 <span className="text-primary font-bold text-lg">{currentPage}</span> / {totalPages} 页
            </div>
          )}
        </div>
      </div>

      {selectedPost && <GalleryLightbox post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </>
  )
}
