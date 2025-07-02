"use client"
import { useState } from "react"
import UploadPageContent from "@/Meet/components/uploader"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, z } from "zod"
import { Form, FormControl, FormLabel, FormItem, FormField, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const typeMap = {
  user: '上传您的简历',
  require: '上传您的招聘要求',
  company: '上传您的公司介绍',
  questions: '上传您的必答题库',
}

interface UploadPageProps {
  type: 'user' | 'require' | 'company' | 'questions'
  onUploadSuccess?: (url: string, fileName: string) => void
}


const formSchema = z.object({
  content: z.string().min(1, { message: "内容不能为空" }),
})

export default function UploadPage({ type, onUploadSuccess }: UploadPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const response = await fetch('/api/company/info', {
      method: 'POST',
      body: JSON.stringify({content: values.content}),
    })
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      toast({
        title: '提交成功',
        description: '感谢您的提交，我们将在第一时间与您联系',
      })
    } else {
      console.error('Failed to submit form')
    }
    setIsSubmitting(false)
  }

  const handleUploadSuccess = (content: string) => {
    form.setValue('content', content, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handleUploadError = (error: Error) => {
    console.error(`${type} PDF上传失败:`, error)
  }

  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{typeMap[type]}</FormLabel>
              <FormControl>
                <UploadPageContent onUploadSuccess={handleUploadSuccess} />
              </FormControl>
              <FormMessage className="text-red-500"  />
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