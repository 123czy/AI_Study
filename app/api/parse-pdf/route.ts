import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import pdfParse from 'pdf-parse'
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


const splitDocs = async (docs: any) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    })

    const texts = await textSplitter.splitDocuments(docs)

    return texts
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData()
        const file: File | null = data.get('file') as unknown as File


        if (!file) {
            return NextResponse.json(
                { success: false, error: '没有找到文件' },
                { status: 400 }
            )
        }

        // 将文件内容转换为 Buffer
        const bytes = await file.arrayBuffer()
        // const buffer = new Blob([bytes],{type: 'application/pdf'})
        const buffer2 = Buffer.from(bytes)

        const pdf = await pdfParse(buffer2)
        const pdfData = pdf.text


        // const loader = new WebPDFLoader(buffer, {
        //     // required params = ...
        //     // optional params = ...
        // });

        // const docs = await loader.load();

        // const pdfData = docs[0].pageContent;

        // const splitTextDocs = await splitDocs(docs)


        return NextResponse.json({
            success: true,
            content: pdfData
        })

    } catch (error) {
        console.error('PDF 解析错误:', error)
        return NextResponse.json(
            { success: false, error: '文件处理失败' },
            { status: 500 }
        )
    }
} 

