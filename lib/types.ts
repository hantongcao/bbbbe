import type React from "react"

export type BlogPost = {
  slug: string
  title: string
  date: string
  readTime: string
  excerpt: string
  tags: string[]
  category?: string
  imageUrl?: string
  content?: string
}

export type GalleryPost = {
  id: number
  src: string
  alt: string
  title: string
  tags: string[]
  content: string
}

export type ContactInfo = {
  icon: React.ElementType
  label: string
  value: string
  href: string
}

export type NavItem = {
  href: string
  label: string
}

export type ContactFormState = {
  message: string
  status: "success" | "error" | "idle"
}

export type LoginFormState = {
  message: string
  status: "idle" | "success" | "error"
  data?: {
    access_token: string
    token_type: string
    user: {
      username: string
      is_admin: boolean
      full_name: string
      require_password_change: boolean
      id: number
      created_at: string
      updated_at: string
    }
  }
}
