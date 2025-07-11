"use server"

import type { PhotoUploadState } from "@/lib/types"
import { API_CONFIG } from "@/lib/config"

export async function submitPhotoData(
  prevState: PhotoUploadState,
  formData: FormData
): Promise<PhotoUploadState> {
  console.log("=== Server Action Called ===")
  console.log("FormData entries:")
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`)
  }
  
  const title = formData.get("title")
  const description = formData.get("description")
  const category = formData.get("category")
  const tags = formData.get("tags")
  const fileUrl = formData.get("fileUrl")
  const fileFormat = formData.get("fileFormat")
  const status = formData.get("status")
  const locationName = formData.get("location_name")
  const visibility = formData.get("visibility")

  console.log("Extracted values:", { title, description, category, tags, fileUrl, fileFormat, status, locationName, visibility })

  // Basic validation
  if (!title || !category || !fileUrl) {
    console.log("Validation failed:", { title: !!title, category: !!category, fileUrl: !!fileUrl })
    return {
      message: "请填写标题、选择类型并上传图片。",
      status: "error",
    }
  }

  try {
    const submitData = {
      title: title.toString(),
      description: description?.toString() || "",
      url: fileUrl.toString(),
      format: fileFormat?.toString() || "jpg",
      location_name: locationName?.toString() || "",
      status: status?.toString() || "published",
      visibility: visibility?.toString() || "public",
      tags: tags ? tags.toString().split(",").filter(tag => tag.trim()) : [],
      category: category.toString(),
      taken_at: new Date().toISOString()
    }

    console.log("Submitting photo data to:", API_CONFIG.PHOTOS_API_URL)
    console.log("Submit data:", submitData)

    const response = await fetch(API_CONFIG.PHOTOS_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response text:", errorText)
      
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("Photo submitted successfully:", result)

    return {
      message: "照片已成功上传！",
      status: "success",
    }
  } catch (error) {
    console.error("Failed to submit photo:", error)
    return {
      message: error instanceof Error ? error.message : "上传失败，请稍后重试。",
      status: "error",
    }
  }
}