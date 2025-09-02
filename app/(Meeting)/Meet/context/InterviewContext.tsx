'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface InterviewContextType {
  currentInterviewId: string | null
  setCurrentInterviewId: (id: string | null) => void
    // 添加计时器控制方法
    triggerPauseTimer: () => void
    setTriggerPauseTimer: (callback: () => void) => void
    triggerStartTimer: () => void
    setTriggerStartTimer: (callback: () => void) => void
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined)

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(null)
  const [startTimerCallback, setStartTimerCallback] = useState<() => void>(() => {})
  const [pauseTimerCallback, setPauseTimerCallback] = useState<() => void>(() => {})

  const triggerPauseTimer = () => {
    if (pauseTimerCallback) {
      pauseTimerCallback()
    }
  }

  const setTriggerPauseTimer = (callback: () => void) => {
    setPauseTimerCallback(() => callback)
  }
  const triggerStartTimer = () => {
    if (startTimerCallback) {
      startTimerCallback()
    }
  }

  const setTriggerStartTimer = (callback: () => void) => {
    setStartTimerCallback(() => callback)
  }

  return (
    <InterviewContext.Provider value={{ currentInterviewId,setCurrentInterviewId,triggerPauseTimer, setTriggerPauseTimer, triggerStartTimer, setTriggerStartTimer }}>
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterview() {
  const context = useContext(InterviewContext)
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider')
  }
  return context
} 