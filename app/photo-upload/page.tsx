"use client"

import { PhotoUploadForm } from "@/components/photo/photo-upload-form"
import { PageHeader } from "@/components/shared/page-header"

export default function PhotoUploadPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        title="照片上传"
        description="上传您的精彩照片，分享美好时刻"
      />
      <div className="mt-8">
        <PhotoUploadForm />
      </div>
    </div>
  )
}