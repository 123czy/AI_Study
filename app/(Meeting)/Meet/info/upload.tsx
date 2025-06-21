"use client"

import { PDFUploader } from '@/components/pdf-uploader'

interface UploadPageProps {
  type: 'user' | 'require' | 'company' | 'questions'
  onUploadSuccess?: (url: string, fileName: string) => void
}

export default function UploadPage({ type, onUploadSuccess }: UploadPageProps) {

  const typeMap = {
    user: '上传您的简历',
    require: '上传您的招聘要求',
    company: '上传您的公司介绍',
    questions: '上传您的必答题库',
  }

  const handleUploadSuccess = (url: string, fileName: string) => {
    onUploadSuccess?.(url, fileName)
  }

  const handleUploadError = (error: Error) => {
    console.error(`${type} PDF上传失败:`, error)
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <div className="text-sm font-bold pb-2">{typeMap[type]}</div>
      <PDFUploader
        type={type}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />
    </div>
  )
}