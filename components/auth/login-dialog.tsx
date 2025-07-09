"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LoginResponse {
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

export function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [userInfo, setUserInfo] = useState<LoginResponse['user'] | null>(null)
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/v1/auth/login', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      if (response.ok) {
        const data: LoginResponse = await response.json()
        setIsLoggedIn(true)
        setUserInfo(data.user)
        setIsOpen(false)
        
        // 存储token到localStorage
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user_info', JSON.stringify(data.user))
        
        toast({
          title: "登录成功",
          description: `欢迎回来，${data.user.full_name || data.user.username}！`,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "登录失败",
          description: errorData.detail || "用户名或密码错误",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "登录失败",
        description: "网络错误，请检查服务器连接",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserInfo(null)
    setUsername("")
    setPassword("")
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
    
    toast({
      title: "已退出登录",
      description: "您已成功退出登录",
    })
  }

  // 检查本地存储中是否有登录信息
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userInfoStr = localStorage.getItem('user_info')
    
    if (token && userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr)
        setIsLoggedIn(true)
        setUserInfo(user)
      } catch (error) {
        // 清除无效的存储数据
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_info')
      }
    }
  }, [])

  if (isLoggedIn && userInfo) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{userInfo.full_name || userInfo.username}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          退出
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LogIn className="h-4 w-4 mr-2" />
          登录
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>登录</DialogTitle>
          <DialogDescription>
            请输入您的用户名和密码进行登录
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "登录中..." : "登录"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}