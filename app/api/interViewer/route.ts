import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, { message: '姓名不能为空' }),
  email: z.string().email({ message: '邮箱格式不正确' }),
  jobTitle: z.string().min(1, { message: '岗位不能为空' }),
  content: z.string().min(1, { message: '内容不能为空' }),
})

// AI 处理和更新函数
async function processAIAndUpdate(interviewer: any, request: NextRequest) {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const aiUrl = `${protocol}://${host}/api/interViewer/ai`

    // 调用 AI 接口
    const aiResponse = await fetch(aiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: interviewer.id,
        name: interviewer.name,
        content: interviewer.content,
      }),
    })

    if (!aiResponse.ok) {
      throw new Error('AI processing failed')
    }

    const aiResult = await aiResponse.json()

    // 更新数据库中的 AI 总结
    await prisma.interViewer.update({
      where: { id: interviewer.id },
      data: {
        aiSummary: aiResult.data.analysis
          ? JSON.stringify(aiResult.data.analysis)
          : null,
      },
    })

    console.log(
      'AI processing and update completed for interviewer:',
      interviewer.id
    )
  } catch (error) {
    console.error('Error in AI processing:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, jobTitle, content } = await request.json()
    const validatedData = formSchema.safeParse({
      name,
      email,
      jobTitle,
      content,
    })

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.message },
        { status: 400 }
      )
    }

    // 1. 先创建记录，aiSummary 为空
    const interviewer = await prisma.interViewer.create({
      data: {
        name,
        email,
        jobTitle,
        content,
      },
    })

    // 2. 触发异步 AI 处理，不等待结果
    processAIAndUpdate(interviewer, request).catch((error) => {
      console.error('Background AI processing failed:', error)
    })

    // 3. 立即返回创建成功的响应
    return NextResponse.json({
      message: 'InterViewer created successfully',
      data: interviewer,
    })
  } catch (error) {
    console.error('Error creating interviewer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 获取单个面试者信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Missing email parameter' },
        { status: 400 }
      )
    }

    const interviewer = await prisma.interViewer.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        jobTitle: true,
        content: true,
        aiSummary: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!interviewer) {
      return NextResponse.json(
        { error: 'Interviewer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: interviewer })
  } catch (error) {
    console.error('Error fetching interviewer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 更新 AI 总结的 API 路由
export async function PUT(request: NextRequest) {
  try {
    const { id, aiSummary } = await request.json()

    const updatedInterviewer = await prisma.interViewer.update({
      where: { id },
      data: { aiSummary },
    })

    return NextResponse.json({
      message: 'AI summary updated successfully',
      data: updatedInterviewer,
    })
  } catch (error) {
    console.error('Error updating AI summary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
