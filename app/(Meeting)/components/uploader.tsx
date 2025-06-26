'use client'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useCallback, forwardRef, useImperativeHandle } from "react"
import { useLatestState } from "../hooks/useLatestState"

interface UploadPageContentProps {
    onUploadSuccess: (content: string) => void
}

const UploadPageContent = forwardRef<{ reset: () => void }, UploadPageContentProps>(({ onUploadSuccess }, ref) => {
    const [pdfContent, setPdfContent] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const selectedFileRef = useLatestState(selectedFile)

    // 暴露重置方法给父组件
    useImperativeHandle(ref, () => ({
        reset: () => {
            setPdfContent("")
            setSelectedFile(null)
            selectedFileRef.current = null
        }
    }))

    const parsePDF = async () => {
        const currentFile = selectedFileRef.current
        if (!currentFile) {
            alert('请先选择一个 PDF 文件')
            return
        }

        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('file', currentFile)

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
            // 处理文本内容：
            // 1. 移除开头和结尾的空白字符
            // 2. 将多个连续的换行符替换为单个换行符
            // 3. 移除每行开头的空白字符
            const processedContent = data.content
                .trim() // 移除开头和结尾的空白字符
                .replace(/\n\s*\n/g, '\n') // 将多个连续的换行符替换为单个换行符
                .split('\n') // 分割成行
                .map((line: string) => line.trim()) // 处理每一行，移除行首尾的空白字符
                .filter((line: string) => line) // 移除空行
                .join('\n'); // 重新组合成字符串

            setPdfContent(processedContent)
            onUploadSuccess(processedContent)
            console.log('PDF 解析成功，内容长度:', processedContent.length)
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
            selectedFileRef.current = file
            // 自动解析（如果你想要自动解析的话）
            await parsePDF()
        } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            alert('Word文档处理功能即将推出')
        }
    }

    return (
        <div className="grid mt-4 w-full max-w-2xl gap-6">
            <div className="grid w-full max-w-sm items-center gap-3">
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
                    <Textarea
                        value={pdfContent}
                        readOnly
                        className="h-[300px] resize-none overflow-y-auto"
                    />
                </div>
            )}
        </div>
    )
})

UploadPageContent.displayName = 'UploadPageContent'

export default UploadPageContent