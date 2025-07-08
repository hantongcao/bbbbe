import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/config'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: '缺少联系信息ID' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_CONFIG.CONTACT_API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to delete contact:', error)
    return NextResponse.json(
      { error: '删除联系信息失败' },
      { status: 500 }
    )
  }
}