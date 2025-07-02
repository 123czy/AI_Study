'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface InterviewInfo {
  id: string
  email: string
  name: string
  jobTitle: string
  content: string
  aiSummary: string
  duration: number
}

const RecordPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [interviewInfo, setInterviewInfo] = useState<InterviewInfo | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }   

    const handleGetRecord = async () => {
        if(!email) {
            alert("请输入您的邮箱")
            return
        }
        setIsLoading(true)
        const response = await fetch(`/api/interViewer?email=${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(!response.ok) {
            alert("获取面试记录失败")
            return
        }
        const data = await response.json()
        setInterviewInfo({
          ...data.data,
          duration: 32
        })
        console.log("1111",data,interviewInfo)
        
        if(data.error) {
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
        setIsLoading(false)
    }

    const handleToInterview = () => {
      if(!email) {
        alert("请输入您的邮箱")
        return
      }
      router.push(`/Meet/Interview?email=${email}`)
    }
    
    return (
        
        <div className=" mt-4 lg:col-span-2 space-y-6">
          {/* 面试记录区域 */}
          <div className="bg-card rounded-lg border p-6  mx-auto">
            <h2 className="text-xl font-semibold mb-4">面试记录</h2>
            <div className="space-y-4" >
              <div className="grid grid-cols-1 sm:grid-cols-3 mx-auto rounded-lg  gap-2">
                <Input placeholder="请输入您的邮箱获取面试记录" type="email" value={email} onChange={handleEmailChange} />  
                <Button className="sm:w-1/3"  onClick={handleGetRecord}>获取面试记录</Button>
              </div>
            </div>
            <div className="mt-4">  
              <div className="flex items-center gap-2"> 
                <div className="flex flex-col items-start justify-center gap-2">
                  <p>面试时长：{interviewInfo?.duration}分钟</p>
                  <p>面试人：{interviewInfo?.name}</p>
                  <p>面试岗位：{interviewInfo?.jobTitle}</p>
                </div>
              </div>
              <div className="flex flex-start gap-2">
                <Button className="w-full sm:w-1/2 mt-4" onClick={handleToInterview}>开始面试</Button>
              </div>
            </div>
          </div>
        </div>
    )
}

export default RecordPage