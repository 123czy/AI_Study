'use client'

import { InterviewTimeline } from '@/Meet/components/InterviewTimeline'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// 动态导入Chat组件，禁用SSR
const Chat = dynamic(() => import('./chat'), {
  ssr: false,
})

export default function InterviewPage() {
  const [email, setEmail] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("mounted", {
      apiKey: process.env.NEXT_PUBLIC_MEM0_API_KEY ? '存在' : '不存在',
      orgName: process.env.NEXT_PUBLIC_MEM0_ORGANIZATION_NAME ? '存在' : '不存在',
      projectName: process.env.NEXT_PUBLIC_MEM0_PROJECT_NAME
    })
  }, [])

  if (!mounted) {
    return null // 或者返回一个加载状态的UI
  }
  
  return (
        <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">面试管理系统</h1>
        <div className="text-muted-foreground mt-2">
          基于时间线的面试流程管理，帮助面试官把控面试节奏
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  h-full">
        {/* 左侧：面试时间线 */}
        <div className="lg:col-span-1 max-h-[calc(100vh-220px)] overflow-y-auto">
          <InterviewTimeline />
        </div>

        {/* 右侧：面试内容区域 */}
        <div className="lg:col-span-2 space-y-6">
       
          {/* 候选人信息区域 */}
          
          <div className="mx-auto">
            <Chat />
          </div>
        </div>
      </div>
    </div>
        
  )
} 