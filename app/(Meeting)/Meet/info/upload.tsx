"use client"
import { useState } from "react"
import UploadPageContent from "@/Meet/components/uploader"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, z } from "zod"
import { Form, FormControl, FormLabel, FormItem, FormField, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
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

const jobSchema = z.array(z.object({
  id: z.string().min(1, { message: "岗位不能为空" }),
  jobTitle: z.string().min(1, { message: "岗位不能为空" }),
}))

const formSchema = z.object({
  jobTitle: z.string().min(1, { message: "岗位不能为空" }),
  content: z.string().min(1, { message: "内容不能为空" }),
  name: z.string().min(1, { message: "姓名不能为空" }),
  email: z.string().email({ message: "邮箱格式不正确" }),
})

export default function UploadPage({ type, onUploadSuccess }: UploadPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobs, setJobs] = useState<{ id: string, jobTitle: string }[]>([])
  const { toast } = useToast()
  

  const fetchJobs = async () => {
    const response = await fetch('/api/jobs')
    const data = await response.json()
    const validatedData = jobSchema.safeParse(data)
    if (validatedData.success) {
      setJobs(validatedData.data)
    } else {
      console.error('Failed to fetch jobs')
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      jobTitle: "",
      name: "",
      email: "",
      
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const response = await fetch('/api/interViewer', {
      method: 'POST',
      body: JSON.stringify({...values, aiSummary: ""}),
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>您的姓名</FormLabel>
              <FormControl>
                <Input className="w-[300px]" type="text" {...field} />
              </FormControl>
              <FormMessage className="text-red-500"  />
            </FormItem>
          )}
        />
        <FormField 
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>您的邮箱</FormLabel>
              <FormControl>
                <Input className="w-[300px]" type="email" {...field} />
              </FormControl>
              <FormMessage className="text-red-500"  />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>选择您的应聘岗位</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="选择岗位" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {jobs.map((job: any) => (
                        <SelectItem key={job.id} value={job.jobTitle}>{job.jobTitle}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
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