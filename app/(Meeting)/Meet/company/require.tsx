"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import UploadPage from "../info/upload"
import UploadPageContent from "@/Meet/components/uploader"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  jobTitle: z.string().min(2, {
    message: "岗位名称至少需要2个字符.",
  }),
  content: z.string().min(2, {
    message: "招聘要求不能为空.",
  }),
  question: z.string().min(2, {
    message: "题库不能为空.",
  }),
})

export function RequireForm({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const contentUploaderRef = useRef<{ reset: () => void } | null>(null)
  const questionUploaderRef = useRef<{ reset: () => void } | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      jobTitle: "",
      content: "",
      question: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!data.content || !data.question) {
      toast({
        variant: "destructive",
        title: "请先上传招聘要求文档和题库",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/job-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: data.jobTitle,
          content: data.content,
          question: data.question,
        }),
      })
      console.log("response",response)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '提交失败')
      }

      onUploadSuccess()

      // 重置表单和上传组件状态
      form.reset()
      contentUploaderRef.current?.reset()
      questionUploaderRef.current?.reset()

      // 可以选择跳转到其他页面
      // router.push('/some-path')
    } catch (error) {
      console.error('提交错误:', error)
      toast({
        variant: "destructive",
        title: "提交失败",
        description: error instanceof Error ? error.message : "提交过程中发生错误",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePdfUpload = (content: string) => {
    // 更新表单的content值
    form.setValue('content', content, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handleQuestionUpload = (content: string) => {
    form.setValue('question', content, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <Form {...form}>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>招聘岗位</FormLabel>
              <FormControl>
                <Input placeholder="请填写您要招聘的岗位" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>上传您的招聘要求</FormLabel>
              <FormControl>
                <UploadPageContent 
                  ref={contentUploaderRef}
                  onUploadSuccess={handlePdfUpload} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>上传您的当前招聘岗位题库</FormLabel>
              <FormControl>
                <UploadPageContent 
                  ref={questionUploaderRef}
                  onUploadSuccess={handleQuestionUpload} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '提交中...' : '提交'}
        </Button>
      </form>
    </Form>
  )
}

export default RequireForm
