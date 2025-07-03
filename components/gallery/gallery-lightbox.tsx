"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { GalleryPost } from "@/lib/types"

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
        <div className="p-6">
          <h2 className="font-sans text-2xl font-bold mb-2">{post.title}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
            <p>{post.content}</p>
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
