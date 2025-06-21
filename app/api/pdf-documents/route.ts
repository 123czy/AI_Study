import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    if (!type) {
      return NextResponse.json(
        { error: '文档类型是必需的' },
        { status: 400 }
      )
    }

    const documents = await prisma.pdfDocument.findMany({
      where: {
        fileType: type
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('PDF documents fetch error:', error)
    return NextResponse.json(
      { error: '获取PDF文档列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { fileName, fileUrl, fileType, fileSize } = await req.json()

    // 验证必需字段
    if (!fileName || !fileUrl || !fileType || !fileSize) {
      return NextResponse.json(
        { error: '缺少必需的字段' },
        { status: 400 }
      )
    }

    // 保存文件信息到数据库
    const pdfDocument = await prisma.pdfDocument.create({
      data: {
        fileName,
        fileUrl,
        fileType,
        fileSize,
      },
    })

    return NextResponse.json(pdfDocument)
  } catch (error) {
    console.error('PDF document creation error:', error)
    return NextResponse.json(
      { error: '创建PDF文档记录失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { fileName } = await req.json()

    if (!fileName) {
      return NextResponse.json(
        { error: '文件名是必需的' },
        { status: 400 }
      )
    }

    // 从数据库中删除记录
    await prisma.pdfDocument.deleteMany({
      where: {
        fileName: fileName
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PDF document deletion error:', error)
    return NextResponse.json(
      { error: '删除PDF文档记录失败' },
      { status: 500 }
    )
  }
} 