import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import pdfParse from 'pdf-parse'

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData()
        const file: File | null = data.get('file') as unknown as File

        console.log("Received file:", {
            name: file?.name,
            type: file?.type,
            size: file?.size
        })

        if (!file) {
            return NextResponse.json(
                { success: false, error: '没有找到文件' },
                { status: 400 }
            )
        }

        // 将文件内容转换为 Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        console.log("Buffer size:", buffer.length)

        // 使用 pdf-parse 解析 PDF 内容
        const pdfData = await pdfParse(buffer)

        console.log("PDF parsed successfully, text length:", pdfData.text.length)

        return NextResponse.json({
            success: true,
            content: pdfData.text
        })

    } catch (error) {
        console.error('PDF 解析错误:', error)
        return NextResponse.json(
            { success: false, error: '文件处理失败' },
            { status: 500 }
        )
    }
} 