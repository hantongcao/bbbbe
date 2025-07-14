"use client"

import Image from "next/image"
import { X, MapPin, FolderOpen, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { GalleryPost } from "@/lib/types"

// 分类映射
import { CATEGORY_LABELS } from "@/lib/photo-constants"

interface GalleryLightboxProps {
  post: GalleryPost
  onClose: () => void
}

export function GalleryLightbox({ post, onClose }: GalleryLightboxProps) {
  return (
    <div
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-card border rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-y-auto animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-video flex-shrink-0">
          <Image src={post.src || "/placeholder.svg"} alt={post.alt} fill className="object-cover" />
        </div>
        <div className="p-6 space-y-4">
          <h2 className="font-sans text-2xl font-bold">{post.title}</h2>
          
          {/* 基本信息 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">拍摄地点:</span>
              <span className="text-sm text-primary">{post.location_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">分类:</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{CATEGORY_LABELS[post.category] || post.category}</Badge>
            </div>
          </div>
          
          {/* 标签 */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">标签:</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* 描述和内容 */}
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm leading-relaxed text-muted-foreground">{post.description}</p>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm leading-relaxed">{post.content}</p>
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 bg-background/50 hover:bg-background/70 text-foreground rounded-full"
        aria-label="关闭"
      >
        <X className="w-6 h-6" />
      </Button>
    </div>
  )
}
