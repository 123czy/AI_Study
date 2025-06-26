import { prompt } from './prompt'
import { validateResumeAnalysis } from './schema'
import { prisma } from '@/lib/prisma'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText, type Message } from 'ai'
import { jsonrepair } from 'jsonrepair'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const openai = createOpenAI({
  apiKey: process.env.NEXT_API_key,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

const requestSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string().min(1, { message: '简历内容不能为空' }),
})

// 清理并修复 AI 响应文本，确保它是有效的 JSON
function cleanAndRepairJSON(text: string): string {
  console.log('Original AI response:', text) // 记录原始响应
  // 使用 jsonrepair 修复可能的 JSON 格式问题
  try {
    return jsonrepair(text)
  } catch (error) {
    console.error('JSON repair failed:', error)
    return text // 如果修复失败，返回原始清理后的文本
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = requestSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.format() },
        { status: 400 }
      )
    }

    const { id, content, name } = validatedData.data

    // 构建消息
    const messages: Message[] = [
      { role: 'system', content: prompt.system, id: 'system' },
      {
        role: 'user',
        content: prompt.prompt.replace('{content}', content),
        id: 'user',
      },
    ]

    // 解析和验证 AI 返回的 JSON
    let parsedData
    let rawResponse = ''
    try {
      // 调用 AI 生成总结
      const result = await generateText({
        model: openai('qwen-plus'),
        messages,
        temperature: 0.1, // 降低随机性，使输出更加确定
      })

      rawResponse = result.text
      // 清理并修复响应
      const repairedJSON = cleanAndRepairJSON(rawResponse)
      console.log('Original AI response:', rawResponse) // 记录原始响应
      console.log('Repaired JSON:', repairedJSON) // 记录修复后的 JSON
      parsedData = JSON.parse(repairedJSON)
    } catch (error) {
      console.error('JSON parsing failed after repair:', error)
      return NextResponse.json(
        {
          error: 'Invalid JSON response from AI',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }

    // 使用 Zod schema 验证数据
    const validatedAnalysis = validateResumeAnalysis(parsedData)
    if (!validatedAnalysis) {
      return NextResponse.json(
        { error: 'AI response does not match expected schema' },
        { status: 500 }
      )
    }

    // 更新数据库
    const updatedInterviewer = await prisma.interViewer.update({
      where: { id },
      data: {
        name,
        aiSummary: JSON.stringify(validatedAnalysis),
      },
    })

    return NextResponse.json({
      message: 'AI summary generated successfully',
      data: {
        interviewer: updatedInterviewer,
        analysis: validatedAnalysis,
      },
    })
  } catch (error) {
    console.error('Error generating AI summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI summary' },
      { status: 500 }
    )
  }
}
