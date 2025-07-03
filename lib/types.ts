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
