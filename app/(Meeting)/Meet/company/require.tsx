"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import UploadPage from "../info/upload"
import UploadPageContent from "@/Meet/components/uploader"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Form,
  FormControl,
  FormDescription,
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
})

export function RequireForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      jobTitle: "",
      content: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!data.content) {
      toast({
        variant: "destructive",
        title: "请先上传招聘要求文档",
      })
      return
    }

    console.log("form data", data)

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: data.jobTitle,
          content: data.content,
        }),
      })
      console.log("response",response)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '提交失败')
      }

      toast({
        title: "提交成功",
        description: "招聘要求已保存",
      })

      // 重置表单
      form.reset()

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
                <UploadPageContent onUploadSuccess={handlePdfUpload} />
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
