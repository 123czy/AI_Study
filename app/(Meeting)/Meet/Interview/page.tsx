'use client'

import { InterviewTimeline } from '@/Meet/components/InterviewTimeline'
import Chat from './chat'
export default function InterviewPage() {
  return (
        <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">面试管理系统</h1>
        <p className="text-muted-foreground mt-2">
          基于时间线的面试流程管理，帮助面试官把控面试节奏
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：面试时间线 */}
        <div className="lg:col-span-1">
          <InterviewTimeline />
        </div>

        {/* 右侧：面试内容区域 */}
        <div className="lg:col-span-2 space-y-6">
       
          {/* 候选人信息区域 */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">候选人信息</h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  候选人信息将在这里显示...
                </p>
              </div>
            </div>
          </div>
          <div className="py-4 mx-auto ">
            <Chat />
          </div>
        </div>
      </div>
    </div>
        
  )
} 