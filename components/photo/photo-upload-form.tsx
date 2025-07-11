"use client"

import { useState, useRef, useActionState, useEffect } from "react"
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
import { Progress } from "@/components/ui/progress"
import { Upload, X, Plus, Image as ImageIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { submitPhotoData } from "@/app/photo-upload/actions"
import type { PhotoUploadState } from "@/lib/types"

const PHOTO_CATEGORIES = ["自拍", "日常", "人像", "风景", "艺术"]

// 内容状态枚举
export type ContentStatus = "draft" | "published" | "private" | "archived" | "deleted"

// 可见性枚举
export type Visibility = "public" | "friends" | "private"

interface PhotoData {
  title: string
  description: string
  tags: string[]
  category: string
  file: File | null
  status?: ContentStatus
  location_name?: string
  visibility?: Visibility
}

const initialState: PhotoUploadState = {
  message: "",
  status: "idle",
}

export function PhotoUploadForm() {
  const [photoData, setPhotoData] = useState<PhotoData>({
    title: "",
    description: "",
    tags: [],
    category: "",
    file: null,
    status: "draft",
    location_name: "",
    visibility: "public",
  })
  const [tagInput, setTagInput] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()
  
  const [state, formAction, isPending] = useActionState(submitPhotoData, initialState)
  
  // 处理Server Action的结果
  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "上传成功",
        description: state.message,
        duration: 2000,
      })
      // 重置表单
      setPhotoData({
        title: "",
        description: "",
        tags: [],
        category: "",
        file: null,
        status: "draft",
        location_name: "",
        visibility: "public",
      })
      setPreview(null)
      setUploadedFileUrl(null)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      formRef.current?.reset()
    } else if (state.status === "error") {
      toast({
        title: "上传失败",
        description: state.message,
        variant: "destructive",
        duration: 2000,
      })
    }
  }, [state, toast])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setPhotoData(prev => ({ ...prev, file }))
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: "文件格式错误",
          description: "请选择图片文件",
          variant: "destructive",
          duration: 2000,
        })
      }
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setPhotoData(prev => ({ ...prev, file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const addTag = () => {
    if (tagInput.trim() && !photoData.tags.includes(tagInput.trim())) {
      setPhotoData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setPhotoData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleFileUpload = async () => {
    if (!photoData.file) return null
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', photoData.file)
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        throw new Error('文件上传失败')
      }

      const uploadResult = await uploadResponse.json()
      setUploadProgress(100)
      setUploadedFileUrl(uploadResult.url)
      
      toast({
        title: "文件上传成功",
        description: "现在可以提交照片信息了",
        duration: 2000,
      })
      
      return uploadResult
    } catch (error) {
      console.error('File upload failed:', error)
      toast({
        title: "文件上传失败",
        description: error instanceof Error ? error.message : "文件上传失败，请重试。",
        variant: "destructive",
        duration: 2000,
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // 确保文件已上传
    if (!uploadedFileUrl) {
      toast({
        title: "请先上传文件",
        description: "请先点击'上传文件'按钮上传图片文件",
        variant: "destructive",
        duration: 2000,
      })
      return
    }
    
    // 创建FormData并调用Server Action
    const formData = new FormData(event.currentTarget)
    formAction(formData)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">上传照片</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} ref={formRef} className="space-y-6">
          {/* 隐藏字段用于传递数据给Server Action */}
          <input type="hidden" name="title" value={photoData.title} />
          <input type="hidden" name="description" value={photoData.description} />
          <input type="hidden" name="category" value={photoData.category} />
          <input type="hidden" name="tags" value={photoData.tags.join(',')} />
          <input type="hidden" name="status" value={photoData.status || 'draft'} />
          <input type="hidden" name="location_name" value={photoData.location_name || ''} />
          <input type="hidden" name="visibility" value={photoData.visibility || 'public'} />
          {uploadedFileUrl && (
            <>
              <input type="hidden" name="fileUrl" value={uploadedFileUrl} />
              <input type="hidden" name="fileFormat" value={photoData.file?.type.split('/')[1] || 'jpg'} />
            </>
          )}
          
          {/* 文件上传区域 */}
          <div className="space-y-2">
            <Label>选择照片</Label>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    alt="预览"
                    width={300}
                    height={200}
                    className="mx-auto rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreview(null)
                      setPhotoData(prev => ({ ...prev, file: null }))
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">点击或拖拽上传照片</p>
                    <p className="text-sm text-muted-foreground">支持 JPG、PNG、GIF 格式</p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* 标题 */}
          <div className="space-y-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={photoData.title}
              onChange={(e) => setPhotoData(prev => ({ ...prev, title: e.target.value }))}
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
              onChange={(e) => setPhotoData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="描述一下这张照片的故事..."
              rows={3}
            />
          </div>

          {/* 类型选择 */}
          <div className="space-y-2">
            <Label>类型 *</Label>
            <Select
              value={photoData.category}
              onValueChange={(value) => setPhotoData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择照片类型" />
              </SelectTrigger>
              <SelectContent>
                {PHOTO_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
              onValueChange={(value: ContentStatus) => setPhotoData(prev => ({ ...prev, status: value }))}
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
              value={photoData.location_name || ""}
              onChange={(e) => setPhotoData(prev => ({ ...prev, location_name: e.target.value }))}
              placeholder="输入拍摄地点"
            />
          </div>

          {/* 可见性选择 */}
          <div className="space-y-2">
            <Label>可见性</Label>
            <Select
              value={photoData.visibility}
              onValueChange={(value: Visibility) => setPhotoData(prev => ({ ...prev, visibility: value }))}
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

          {/* 上传进度 */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>上传进度</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
            
            {/* 文件上传成功状态 */}
            {uploadedFileUrl && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center text-green-700">
                  <Upload className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">文件已成功上传</span>
                </div>
                <p className="text-xs text-green-600 mt-1">现在可以填写照片信息并提交</p>
              </div>
            )}

          {/* 文件上传按钮 */}
          {photoData.file && !uploadedFileUrl && (
            <Button 
              type="button" 
              onClick={handleFileUpload}
              className="w-full mb-4" 
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  上传文件中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  上传文件
                </>
              )}
            </Button>
          )}
          
          {/* 提交表单按钮 */}
          <Button 
              type="submit" 
              className="w-full" 
              disabled={isPending || isUploading || !uploadedFileUrl || !photoData.title || !photoData.category}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  提交照片信息
                </>
              )}
            </Button>
        </form>
      </CardContent>
    </Card>
  )
}