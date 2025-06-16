'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const UploadPage = () => {
    const [pdfContent, setPdfContent] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file)
            console.log("Selected file:", {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified
            })
        } else if (file) {
            alert('请选择 PDF 格式的文件')
        }
    }

    const parsePDF = async () => {
        if (!selectedFile) {
            alert('请先选择一个 PDF 文件')
            return
        }

        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('file', selectedFile)

            // 验证 FormData 内容
            console.log("FormData entries:", Array.from(formData.entries()))

            const response = await fetch('/api/parse-pdf', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'PDF 解析失败')
            }

            const data = await response.json()
            setPdfContent(data.content)
            console.log('PDF 解析成功，内容长度:', data.content.length)
        } catch (error) {
            console.error('PDF 处理错误:', error)
            alert('PDF 处理失败，请重试')
        } finally {
            setIsLoading(false)
        }
    }


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.type === 'application/pdf') {
            setSelectedFile(file)
            // 自动解析（如果你想要自动解析的话）
            // await parsePDF()
        } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            alert('Word文档处理功能即将推出')
        }
    }

    return (
        <div className="grid mt-4 w-full max-w-2xl gap-6">
            <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="resume">上传您的简历(支持pdf,docx,doc格式)</Label>
                <Input 
                    id="resume" 
                    type="file" 
                    accept=".pdf,.docx,.doc" 
                    onChange={handleFileChange}
                    disabled={isLoading} 
                />
                
                
                
                {selectedFile && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            已选择: {selectedFile.name}
                        </span>
                        <Button 
                            onClick={parsePDF} 
                            disabled={isLoading}
                            size="sm"
                        >
                            {isLoading ? '解析中...' : '解析PDF'}
                        </Button>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="text-sm text-muted-foreground">
                    正在解析文档内容...
                </div>
            )}

            {pdfContent && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">文档内容预览：</h3>
                    <div className="rounded-lg border p-4 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {pdfContent}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UploadPage