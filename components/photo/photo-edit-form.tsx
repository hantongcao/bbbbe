"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Loader2, Save, ArrowLeft, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { PHOTO_CATEGORIES } from "@/lib/photo-constants"

// 内容状态枚举
export type ContentStatus = "draft" | "published" | "private" | "archived" | "deleted"

// 可见性枚举
export type Visibility = "public" | "friends" | "private"

interface PhotoEditData {
  id: number
  title: string
  description: string
  tags: string[]
  category: string
  status: ContentStatus
  location_name: string
  visibility: Visibility
  url: string
  user_id?: number
}

interface PhotoEditFormProps {
  photoId: string
}

export function PhotoEditForm({ photoId }: PhotoEditFormProps) {
  const [photoData, setPhotoData] = useState<PhotoEditData | null>(null)
  const [tagInput, setTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { userInfo, isLoggedIn } = useAuth()

  // 获取照片数据
  useEffect(() => {
    const fetchPhotoData = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('access_token')
        const response = await fetch(`/api/photos/${photoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error('获取照片数据失败')
        }
        
        const data = await response.json()
        
        // 检查权限 - 仅限管理员
        if (!userInfo?.is_admin) {
          toast({
            title: "权限不足",
            description: "只有管理员才能编辑照片",
            variant: "destructive",
            duration: 3000,
          })
          router.push('/gallery')
          return
        }
        
        setPhotoData({
          id: data.id,
          title: data.title || '',
          description: data.description || '',
          tags: data.tags || [],
          category: data.category || '',
          status: data.status || 'draft',
          location_name: data.location_name || '',
          visibility: data.visibility || 'public',
          url: data.url || '',
          user_id: data.user_id
        })
      } catch (error) {
        console.error('Failed to fetch photo data:', error)
        
        // 提供更详细的错误信息
        let errorMessage = "无法加载照片数据"
        let errorDescription = "请检查网络连接或稍后重试"
        
        if (error instanceof Error) {
          if (error.message.includes('500')) {
            errorMessage = "后端服务暂时不可用"
            errorDescription = "后端API服务器出现问题，请联系管理员或稍后重试"
          } else if (error.message.includes('401')) {
            errorMessage = "登录已过期"
            errorDescription = "请重新登录后再试"
          } else if (error.message.includes('403')) {
            errorMessage = "权限不足"
            errorDescription = "您没有权限访问此照片"
          } else if (error.message.includes('404')) {
            errorMessage = "照片不存在"
            errorDescription = "该照片可能已被删除"
          }
        }
        
        toast({
          title: errorMessage,
          description: errorDescription,
          variant: "destructive",
          duration: 5000,
        })
        
        // 设置离线模式
         setIsOfflineMode(true)
         
         // 设置一个默认的照片数据，允许用户至少看到编辑界面
         setPhotoData({
           id: parseInt(photoId),
           title: `照片 #${photoId}`,
           description: '',
           tags: [],
           category: '',
           status: 'draft',
           location_name: '',
           visibility: 'public',
           url: '',
           user_id: userInfo?.id || 0
         })
      } finally {
        setIsLoading(false)
      }
    }

    if (photoId && isLoggedIn) {
      fetchPhotoData()
    }
  }, [photoId, userInfo, isLoggedIn, toast, router])

  const addTag = () => {
    if (tagInput.trim() && photoData && !photoData.tags.includes(tagInput.trim())) {
      setPhotoData(prev => prev ? {
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      } : null)
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setPhotoData(prev => prev ? {
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    } : null)
  }

  const handleSave = async () => {
    if (!photoData) return
    
    setIsSaving(true)
    
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: photoData.title,
          description: photoData.description,
          tags: photoData.tags,
          category: photoData.category,
          status: photoData.status,
          location_name: photoData.location_name,
          visibility: photoData.visibility,
        }),
      })

      if (response.ok) {
        toast({
          title: "保存成功",
          description: "照片信息已更新",
          duration: 2000,
        })
        router.push('/gallery')
      } else {
        throw new Error('保存失败')
      }
    } catch (error) {
      console.error('Save failed:', error)
      toast({
        title: "保存失败",
        description: "请重试",
        variant: "destructive",
        duration: 2000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">加载中...</span>
        </CardContent>
      </Card>
    )
  }

  if (!photoData) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">照片数据加载失败</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">编辑照片</CardTitle>
          <Button
            variant="outline"
            onClick={() => router.push('/gallery')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回照片墙
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 离线模式警告 */}
        {isOfflineMode && (
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              <strong>离线编辑模式：</strong>无法连接到后端服务器，您可以编辑照片信息，但保存功能暂时不可用。请稍后重试或联系管理员。
            </AlertDescription>
          </Alert>
        )}
        
        {/* 标题 */}
        <div className="space-y-2">
          <Label htmlFor="title">标题 *</Label>
          <Input
            id="title"
            value={photoData.title}
            onChange={(e) => setPhotoData(prev => prev ? { ...prev, title: e.target.value } : null)}
            placeholder="为您的照片起个标题"
            required
          />
        </div>

        {/* 描述 */}
        <div className="space-y-2">
          <Label htmlFor="description">描述</Label>
          <Textarea
            id="description"
            value={photoData.description}
            onChange={(e) => setPhotoData(prev => prev ? { ...prev, description: e.target.value } : null)}
            placeholder="描述一下这张照片的故事..."
            rows={3}
          />
        </div>

        {/* 类型选择 */}
        <div className="space-y-2">
          <Label>类型 *</Label>
          <Select
            value={photoData.category}
            onValueChange={(value) => setPhotoData(prev => prev ? { ...prev, category: value } : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择照片类型" />
            </SelectTrigger>
            <SelectContent>
              {PHOTO_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 标签 */}
        <div className="space-y-2">
          <Label>标签</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="添加标签"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
            />
            <Button type="button" onClick={addTag} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {photoData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {photoData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 状态选择 */}
        <div className="space-y-2">
          <Label>状态</Label>
          <Select
            value={photoData.status}
            onValueChange={(value: ContentStatus) => setPhotoData(prev => prev ? { ...prev, status: value } : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择内容状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
              <SelectItem value="private">私密</SelectItem>
              <SelectItem value="archived">已归档</SelectItem>
              <SelectItem value="deleted">已删除</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 地点 */}
        <div className="space-y-2">
          <Label htmlFor="location">拍摄地点</Label>
          <Input
            id="location"
            value={photoData.location_name}
            onChange={(e) => setPhotoData(prev => prev ? { ...prev, location_name: e.target.value } : null)}
            placeholder="输入拍摄地点"
          />
        </div>

        {/* 可见性选择 */}
        <div className="space-y-2">
          <Label>可见性</Label>
          <Select
            value={photoData.visibility}
            onValueChange={(value: Visibility) => setPhotoData(prev => prev ? { ...prev, visibility: value } : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择可见性" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">公开</SelectItem>
              <SelectItem value="friends">仅好友可见</SelectItem>
              <SelectItem value="private">仅自己可见</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 保存按钮 */}
        <div className="flex gap-4">
          <Button 
            onClick={handleSave}
            className="flex-1" 
            disabled={isSaving || !photoData.title || !photoData.category || isOfflineMode}
            title={isOfflineMode ? "离线模式下无法保存" : ""}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isOfflineMode ? "保存不可用" : "保存更改"}
              </>
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/gallery')}
            disabled={isSaving}
          >
            {isOfflineMode ? "返回" : "取消"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}