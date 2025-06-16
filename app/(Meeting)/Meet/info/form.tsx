"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// 定义选项
const genderOptions = [
  { value: "male", label: "男" },
  { value: "female", label: "女" },
]

const educationOptions = [
  { value: "highschool", label: "高中" },
  { value: "college", label: "大专" },
  { value: "bachelor", label: "本科" },
  { value: "master", label: "硕士" },
  { value: "phd", label: "博士" },
]

const techStackOptions = [
  { value: "frontend", label: "前端开发" },
  { value: "backend", label: "后端开发" },
  { value: "fullstack", label: "全栈开发" },
  { value: "devops", label: "DevOps" },
  { value: "mobile", label: "移动开发" },
]

const experienceOptions = [
  { value: "0-1", label: "0-1年" },
  { value: "1-3", label: "1-3年" },
  { value: "3-5", label: "3-5年" },
  { value: "5-10", label: "5-10年" },
  { value: "10+", label: "10年以上" },
]

const positionOptions = [
  { value: "frontend-dev", label: "前端开发工程师" },
  { value: "backend-dev", label: "后端开发工程师" },
  { value: "fullstack-dev", label: "全栈开发工程师" },
  { value: "mobile-dev", label: "移动端开发工程师" },
  { value: "devops-engineer", label: "DevOps工程师" },
]

const formSchema = z.object({
  username: z.string().min(2, { message: "用户名至少2个字符" }),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  gender: z.string().min(1, { message: "请选择性别" }),
  education: z.string().min(1, { message: "请选择学历" }),
  age: z.string().min(1, { message: "请输入年龄" }),
  techStack: z.string().min(1, { message: "请选择技术栈" }),
  experience: z.string().min(1, { message: "请选择工作年限" }),
  position: z.string().min(1, { message: "请选择面试岗位" }),
  additional: z.string().optional(),
})

const ProfileForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      gender: "",
      education: "",
      age: "",
      techStack: "",
      experience: "",
      position: "",
      additional: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="请输入您的用户名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input placeholder="请输入您的邮箱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>年龄</FormLabel>
              <FormControl>
                <Input placeholder="请输入您的年龄" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>性别</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>学历</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择学历" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>技术栈</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择技术栈" />
                  </SelectTrigger>
                  <SelectContent>
                    {techStackOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>工作年限</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择工作年限" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>面试岗位</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择面试岗位" />
                  </SelectTrigger>
                  <SelectContent>
                    {positionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additional"
          render={({ field }) => (
            <FormItem>
              <FormLabel>补充信息</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="请输入补充信息（选填）" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">提交信息</Button>
      </form>
    </Form>
  )
}

export default ProfileForm