import { z } from 'zod'

// 教育经历 Schema
export const educationSchema = z.object({
  school: z.string().nullable(),
  degree: z.string().nullable(),
  major: z.string().nullable(),
  graduationYear: z.number().nullable(),
})

// 工作经验 Schema
export const workExperienceSchema = z.object({
  company: z.string().nullable(),
  position: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  description: z.string().nullable(),
})

// 项目经验 Schema
export const projectSchema = z.object({
  name: z.string().nullable(),
  role: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  description: z.string().nullable(),
  technologies: z.array(z.string()).nullable(),
})

// 技能 Schema
export const skillsSchema = z.object({
  programming: z.array(z.string()).nullable(),
  frameworks: z.array(z.string()).nullable(),
  languages: z.array(z.string()).nullable(),
  others: z.array(z.string()).nullable(),
})

// 简历分析结果 Schema
export const resumeAnalysisSchema = z.object({
  name: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  education: educationSchema,
  workExperience: z.array(workExperienceSchema),
  projects: z.array(projectSchema),
  skills: skillsSchema,
})

// 从 Zod schema 中推导出 TypeScript 类型
export type Education = z.infer<typeof educationSchema>
export type WorkExperience = z.infer<typeof workExperienceSchema>
export type Project = z.infer<typeof projectSchema>
export type Skills = z.infer<typeof skillsSchema>
export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>

// 验证函数
export function validateResumeAnalysis(data: unknown): ResumeAnalysis | null {
  try {
    return resumeAnalysisSchema.parse(data)
  } catch (error) {
    console.error('Resume analysis validation error:', error)
    return null
  }
}