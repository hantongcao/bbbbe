"use client"

import { useState, useEffect, useActionState } from "react"
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
import { loginUser } from "@/app/auth/actions"
import type { LoginFormState } from "@/lib/types"

const initialState: LoginFormState = {
  message: "",
  status: "idle",
}

export function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<LoginFormState['data']['user'] | null>(null)
  const [state, formAction, isPending] = useActionState(loginUser, initialState)
  const { toast } = useToast()

  // 处理登录状态变化
  useEffect(() => {
    if (state.status === "success" && state.data) {
      setIsLoggedIn(true)
      setUserInfo(state.data.user)
      setIsOpen(false)
      
      // 存储token到localStorage
      localStorage.setItem('access_token', state.data.access_token)
      localStorage.setItem('user_info', JSON.stringify(state.data.user))
      
      toast({
        title: "登录成功",
        description: state.message,
      })
    } else if (state.status === "error") {
      toast({
        title: "登录失败",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, toast])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserInfo(null)
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
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="请输入用户名"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="请输入密码"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "登录中..." : "登录"}
          </Button>
          {state.status !== "idle" && state.status === "error" && (
            <p className="text-sm text-center text-destructive">
              {state.message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}