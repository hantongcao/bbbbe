import { ALL_BLOG_POSTS } from "@/data/blog"
import { ALL_GALLERY_POSTS } from "@/data/gallery"
import { CONTACT_INFO } from "@/data/contact"
import type { BlogPost, GalleryPost, ContactInfo } from "./types"

export const getRecentBlogPosts = (): BlogPost[] => ALL_BLOG_POSTS.slice(0, 3)
export const getAllBlogPosts = (): BlogPost[] => ALL_BLOG_POSTS
export const getBlogPostBySlug = (slug: string): BlogPost | undefined =>
  ALL_BLOG_POSTS.find((post) => post.slug === slug)
export const getAllGalleryPosts = (): GalleryPost[] => ALL_GALLERY_POSTS
export const getContactInfo = (): ContactInfo[] => CONTACT_INFO
