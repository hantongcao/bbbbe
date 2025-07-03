import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import { AUTHOR_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-20 border-t border-border/40 bg-background/95 backdrop-blur-lg">
      <div className="container mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              由 <span className="font-semibold text-primary">{AUTHOR_NAME}</span> 用 ❤️ 精心构建
            </p>
            <p className="text-xs text-muted-foreground mt-1">&copy; {new Date().getFullYear()} 版权所有</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="领英">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="mailto:hello@example.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="邮箱"
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
