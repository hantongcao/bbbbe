"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, MapPin, Camera, Tag, FolderOpen, Loader2, Edit, Trash2, ZoomIn } from "lucide-react"
import type { GalleryPost } from "@/lib/types"
import { PageHeader } from "@/components/shared/page-header"
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox"
import { useAuth } from "@/hooks/use-auth"

import { CATEGORY_LABELS } from "@/lib/photo-constants"

const POSTS_PER_PAGE = 3

// API响应类型
interface ApiPhoto {
  id: number
  title: string
  description: string
  url: string
  location_name: string
  category: string
  tags: string[]
  user_id?: number
  created_at: string
  updated_at: string
}

interface ApiResponse {
  items: ApiPhoto[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPage: number
  }
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null)
  const { isLoggedIn, userInfo } = useAuth()

  // 从API获取照片数据
  const fetchPhotos = async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/photos?page=${page}&perPage=${POSTS_PER_PAGE}&watch=false`)
      
      if (!response.ok) {
        throw new Error('获取照片数据失败')
      }
      
      const data: ApiResponse = await response.json()
      
      // 转换API数据为GalleryPost格式
      const galleryPosts: GalleryPost[] = data.items.map((photo) => {
        // 处理图片URL - 使用本地静态文件路径
        let imageUrl = photo.url
        
        // 如果URL包含文件名，提取文件名并构建本地路径
        if (imageUrl) {
          // 提取文件名（去掉可能的路径前缀）
          const fileName = imageUrl.split('/').pop() || imageUrl
          // 构建本地静态文件路径
          imageUrl = `/uploads/${fileName}`
        }
        
        return {
          id: photo.id,
          src: imageUrl || "/placeholder.svg",
          alt: photo.title,
          title: photo.title,
          description: photo.description,
          location_name: photo.location_name,
          category: photo.category,
          tags: photo.tags,
          content: photo.description, // 保持与GalleryPost类型兼容
          user_id: photo.user_id
        }
      })
      
      setPhotos(galleryPosts)
      setCurrentPage(data.pagination.page)
      setTotalPages(data.pagination.totalPage)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos(1)
  }, [])

  const handlePageChange = (page: number) => {
    fetchPhotos(page)
  }

  const prevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  // 删除照片
  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('确定要删除这张照片吗？')) {
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // 重新获取当前页面的照片
        fetchPhotos(currentPage)
      } else {
        alert('删除失败，请重试')
      }
    } catch (error) {
      console.error('删除照片失败:', error)
      alert('删除失败，请重试')
    }
  }

  // 编辑照片 - 跳转到编辑页面
  const handleEditPhoto = (photoId: number) => {
    window.location.href = `/photo-edit/${photoId}`
  }

  // 检查当前用户是否可以编辑/删除照片 - 仅限管理员
  const canEditPhoto = (photo: GalleryPost) => {
    return isLoggedIn && userInfo && userInfo.is_admin
  }

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col min-h-[calc(100vh-14rem)] animate-fade-in-up">
        <div className="mb-12">
          <PageHeader title="光影集" description="一个通过我的镜头捕捉，并用文字记录的故事精选集。" />
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">加载中...</span>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchPhotos(currentPage)} variant="outline">
              重试
            </Button>
          </div>
        )}

        {/* 照片列表 */}
        {!loading && !error && (
          <div className="grid gap-6">
            {photos.map((post) => (
            <Card key={post.id} className="hover:shadow-lg hover:border-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => setSelectedPost(post)}
                       className="text-primary hover:text-primary hover:bg-primary/10 border-primary/20 hover:border-primary/30 transition-colors"
                     >
                       <ZoomIn className="h-4 w-4 mr-1" />
                       查看大图
                     </Button>
                     {canEditPhoto(post) && (
                       <>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleEditPhoto(post.id)}
                           className="text-primary hover:text-primary hover:bg-primary/10 border-primary/20 hover:border-primary/30 transition-colors"
                         >
                           <Edit className="h-4 w-4 mr-1" />
                           编辑
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleDeletePhoto(post.id)}
                           className="text-primary hover:text-primary hover:bg-primary/10 border-primary/20 hover:border-primary/30 transition-colors"
                         >
                           <Trash2 className="h-4 w-4 mr-1" />
                           删除
                         </Button>
                       </>
                     )}
                   </div>
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
                      {/* 只有当拍摄地点不为空时才显示 */}
                      {post.location_name && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">拍摄地点:</span>
                          <span className="text-sm text-primary">{post.location_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">分类:</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{CATEGORY_LABELS[post.category] || post.category}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {/* 只有当标签不为空时才显示标签区域 */}
                      {post.tags && post.tags.length > 0 && (
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
                      )}
                      
                      {/* 只显示描述，避免重复 */}
                      {post.description && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm leading-relaxed">{post.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* 分页组件 */}
        {!loading && !error && totalPages > 1 && (
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
