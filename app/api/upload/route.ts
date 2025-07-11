import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: '没有找到文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件格式' },
        { status: 400 }
      )
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过5MB' },
        { status: 400 }
      )
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const fileName = `${timestamp}_${Math.random().toString(36).substring(2)}${fileExtension}`
    
    // 转换文件为Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // 保存文件到public/uploads目录
    const filePath = path.join(process.cwd(), 'public/uploads', fileName)
    await writeFile(filePath, buffer)
    
    // 返回文件URL
    const fileUrl = `/uploads/${fileName}`
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    })
    
  } catch (error) {
    console.error('文件上传错误:', error)
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    )
  }
}