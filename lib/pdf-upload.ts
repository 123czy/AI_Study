import { supabase } from './supabase'

export type PdfFileType = 'user' | 'require' | 'company' | 'questions'

interface UploadPDFOptions {
  file: File
  type: PdfFileType
}

export async function uploadPDF({ file, type }: UploadPDFOptions) {
  try {
    // 验证文件类型
    if (file.type !== 'application/pdf') {
      throw new Error('只支持上传PDF文件')
    }

    // 验证文件大小 (限制为10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('文件大小不能超过10MB')
    }

    // 生成唯一的文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileName = `${timestamp}-${randomString}.pdf`

    // 创建文件的 ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // 尝试上传文件到 Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      if (uploadError.message.includes('storage.buckets row-level security')) {
        throw new Error('存储配置错误，请联系管理员设置正确的存储权限')
      }
      throw new Error(uploadError.message)
    }

    // 获取文件的公共URL
    const { data: { publicUrl } } = supabase.storage
      .from('pdfs')
      .getPublicUrl(fileName)

    // 通过 API 保存文件信息到数据库
    const response = await fetch('/api/pdf-documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileUrl: publicUrl,
        fileType: type,
        fileSize: file.size,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '保存文件信息失败')
    }

    const pdfDocument = await response.json()

    return {
      url: publicUrl,
      fileName,
      id: pdfDocument.id
    }
  } catch (error) {
    console.error('PDF上传错误:', error)
    // 如果是存储权限错误，返回更友好的错误信息
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      throw new Error('存储访问权限错误，请确保已正确设置存储桶权限')
    }
    throw error
  }
}

export async function deletePDF(fileName: string) {
  try {
    // 从存储中删除文件
    const { error: storageError } = await supabase.storage
      .from('pdfs')
      .remove([fileName])

    if (storageError) {
      console.error('Storage delete error:', storageError)
      throw new Error('删除文件失败，请稍后重试')
    }

    // 通过 API 从数据库中删除记录
    const response = await fetch('/api/pdf-documents', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '删除文件记录失败')
    }
  } catch (error) {
    console.error('PDF删除错误:', error)
    throw error
  }
}

export async function getPDFsByType(type: PdfFileType) {
  const response = await fetch(`/api/pdf-documents?type=${type}`)
  if (!response.ok) {
    throw new Error('获取PDF文档列表失败')
  }
  return response.json()
} 