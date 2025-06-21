import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import * as pdfjsLib from 'pdfjs-dist'

// 设置PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

async function extractPDFContent(pdfUrl: string): Promise<string> {
  try {
    // 获取PDF文件的ArrayBuffer
    const response = await fetch(pdfUrl)
    const arrayBuffer = await response.arrayBuffer()

    // 加载PDF文档
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise

    let fullText = ''
    
    // 遍历所有页面并提取文本
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }

    return fullText.trim()
  } catch (error) {
    console.error('PDF内容提取错误:', error)
    throw new Error('无法提取PDF内容')
  }
}

export async function POST(req: Request) {
  try {
    const { jobTitle, pdfUrl, fileName } = await req.json()

    if (!jobTitle || !pdfUrl || !fileName) {
      return NextResponse.json(
        { error: '缺少必需的字段' },
        { status: 400 }
      )
    }

    // 提取PDF内容
    const pdfContent = await extractPDFContent(pdfUrl)

    // 保存到数据库
    const jobRequirement = await prisma.jobRequirement.create({
      data: {
        jobTitle,
        pdfUrl,
        pdfContent,
        fileName,
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