"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { uploadPDF, type PdfFileType } from '@/lib/pdf-upload'
import { useToast } from '@/components/ui/use-toast'
import { Upload } from 'lucide-react'

interface PDFUploaderProps {
  type: PdfFileType
  onUploadSuccess: (url: string, fileName: string) => void
  onUploadError?: (error: Error) => void
}

export function PDFUploader({ type, onUploadSuccess, onUploadError }: PDFUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // 创建本地预览URL
      const localPreviewUrl = URL.createObjectURL(file)
      setPreviewUrl(localPreviewUrl)

      // 上传文件
      const { url, id } = await uploadPDF({ 
        file,
        type 
      })
      
      // 上传成功回调
      onUploadSuccess(url, file.name)
      
      toast({
        title: "上传成功",
        description: "PDF文件已成功上传",
      })
    } catch (error) {
      console.error('上传失败:', error)
      toast({
        variant: "destructive",
        title: "上传失败",
        description: error instanceof Error ? error.message : "文件上传过程中发生错误",
      })
      onUploadError?.(error as Error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      
      <Button
        onClick={handleClick}
        disabled={isUploading}
        className="w-[100px] h-[60px] bg-card text-secondary-foreground hover:bg-card/80 border"
      >
        <Upload className="w-4 h-4 text-primary bg-primary" size={24} />
        {isUploading ? '上传中...' : '选择PDF文件'}
      </Button>

      {previewUrl && (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <iframe
            src={previewUrl}
            className="w-full h-[500px]"
            title="PDF预览"
          />
        </div>
      )}
    </div>
  )
} 