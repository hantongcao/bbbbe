"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ArrowLeft, ArrowRight, MapPin, Camera, Tag, FolderOpen } from "lucide-react"
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

        {/* 照片列表 */}
        <div className="grid gap-6">
          {currentItems.map((post) => (
            <Card key={post.id} className="hover:shadow-lg hover:border-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    {post.title}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPost(post)}
                    className="text-primary hover:text-primary hover:bg-primary/10 border-primary/20 hover:border-primary/30 transition-colors"
                  >
                    查看大图
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* 照片预览 */}
                  <div className="md:col-span-1">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer" onClick={() => setSelectedPost(post)}>
                      <Image
                        src={post.src || "/placeholder.svg"}
                        alt={post.alt}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>
                  
                  {/* 照片信息 */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">拍摄地点:</span>
                        <span className="text-sm text-primary">{post.location_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">分类:</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{post.category}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">标签:</span>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm leading-relaxed text-muted-foreground mb-2">{post.description}</p>
                        <p className="text-sm leading-relaxed">{post.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 分页组件 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              上一页
            </Button>
            
            <div className="text-center text-muted-foreground">
              第 <span className="text-primary font-bold text-lg">{currentPage}</span> / {totalPages} 页
            </div>
            
            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              下一页
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {selectedPost && <GalleryLightbox post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </>
  )
}
