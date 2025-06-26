import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(req: Request) {
  try {
    const { jobTitle, content, question } = await req.json()

    if (!jobTitle || !content || !question) {
      return NextResponse.json(
        { error: '缺少必需的字段' },
        { status: 400 }
      )
    }


    // 保存到数据库
    const jobRequirement = await prisma.jobRequirement.create({
      data: {
        jobTitle,
        pdfUrl: '',
        fileName: '',
        pdfContent: content,
        questions: question,
      },
    })

    return NextResponse.json(jobRequirement)
  } catch (error) {
    console.error('创建职位要求错误:', error)
    return NextResponse.json(
      { error: '创建职位要求失败' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const jobRequirement = await prisma.jobRequirement.findUnique({
        where: { id }
      })
      return NextResponse.json(jobRequirement)
    }

    const jobRequirements = await prisma.jobRequirement.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(jobRequirements)
  } catch (error) {
    console.error('获取职位要求错误:', error)
    return NextResponse.json(
      { error: '获取职位要求失败' },
      { status: 500 }
    )
  }
} 