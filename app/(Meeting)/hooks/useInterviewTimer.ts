'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { timelineConfig } from '../../api/chat/prompt'

interface TimerData {
  sessionId: string
  elapsedTime: number
  minutes: number
  isRunning: boolean
  startTime: number
  createdAt: number
}

interface TimerState {
  data: TimerData | null
  currentStep: number
  isLoading: boolean
  error: string | null
}

export const useInterviewTimer = () => {
  const [state, setState] = useState<TimerState>({
    data: null,
    currentStep: 0,
    isLoading: false,
    error: null
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastFetchRef = useRef<number>(0)

  // 获取当前阶段
  const getCurrentStep = useCallback((minutes: number) => {
    const stepIndex = timelineConfig.steps.findIndex(step => 
      minutes >= step.startTime && minutes < step.endTime
    )
    return stepIndex !== -1 ? stepIndex : timelineConfig.steps.length - 1
  }, [])

  // 获取当前阶段信息
  const getCurrentStepInfo = useCallback(() => {
    const step = timelineConfig.steps[state.currentStep]
    if (!step || !state.data) return null

    const currentMinutes = state.data.minutes
    const timeLeft = Math.max(0, (step.endTime - currentMinutes) * 60 * 1000)
    const stepDuration = (step.endTime - step.startTime) * 60 * 1000
    const stepElapsed = Math.max(0, (currentMinutes - step.startTime) * 60 * 1000)
    const progress = stepDuration > 0 ? Math.min(100, (stepElapsed / stepDuration) * 100) : 0

    return {
      ...step,
      timeLeft,
      progress,
      stepDuration,
      stepElapsed
    }
  }, [state.currentStep, state.data])

  // 获取总体进度
  const getTotalProgress = useCallback(() => {
    if (!state.data) return 0
    const totalDuration = 32 * 60 * 1000 // 32分钟总时长
    return Math.min(100, (state.data.elapsedTime / totalDuration) * 100)
  }, [state.data])

  // API 调用函数
  const callTimerAPI = useCallback(async (action: string, sessionId?: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch('/api/timer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, sessionId }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  // 获取计时器状态
  const fetchTimerStatus = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/timer?sessionId=${sessionId}`)
      const result = await response.json()

      if (result.success && result.data) {
        const currentStep = getCurrentStep(result.data.minutes)
        setState(prev => ({
          ...prev,
          data: result.data,
          currentStep,
          error: null
        }))
        lastFetchRef.current = Date.now()
      }
    } catch (error) {
      console.error('Failed to fetch timer status:', error)
    }
  }, [getCurrentStep])

  // 开始计时
  const startTimer = useCallback(async () => {
    try {
      const result = await callTimerAPI('start', state.data?.sessionId)
      if (result.sessionId) {
        await fetchTimerStatus(result.sessionId)
      }
    } catch (error) {
      console.error('Failed to start timer:', error)
    }
  }, [callTimerAPI, fetchTimerStatus, state.data?.sessionId])

  // 暂停计时
  const pauseTimer = useCallback(async () => {
    if (!state.data?.sessionId) return

    try {
      await callTimerAPI('pause', state.data.sessionId)
      await fetchTimerStatus(state.data.sessionId)
    } catch (error) {
      console.error('Failed to pause timer:', error)
    }
  }, [callTimerAPI, fetchTimerStatus, state.data?.sessionId])

  // 重置计时
  const resetTimer = useCallback(async () => {
    try {
      await callTimerAPI('reset', state.data?.sessionId)
      setState(prev => ({
        ...prev,
        data: null,
        currentStep: 0
      }))
    } catch (error) {
      console.error('Failed to reset timer:', error)
    }
  }, [callTimerAPI, state.data?.sessionId])

  // 格式化时间
  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 1000 / 60)
    const seconds = Math.floor((ms / 1000) % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [])

  // 定时更新状态（避免频繁调用 API）
  useEffect(() => {
    if (state.data?.isRunning && state.data.sessionId) {
      intervalRef.current = setInterval(() => {
        const now = Date.now()
        // 每10秒同步一次服务器状态，其他时间本地计算
        if (now - lastFetchRef.current > 10000) {
          if (state.data?.sessionId) {
            fetchTimerStatus(state.data.sessionId)
          }
        } else {
          // 本地更新时间
          setState(prev => {
            if (!prev.data) return prev
            
            const elapsedTime = now - prev.data.startTime
            const minutes = Math.floor(elapsedTime / 1000 / 60)
            const currentStep = getCurrentStep(minutes)
            
            return {
              ...prev,
              data: {
                ...prev.data,
                elapsedTime,
                minutes
              },
              currentStep
            }
          })
        }
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.data?.isRunning, state.data?.sessionId, fetchTimerStatus, getCurrentStep])

  return {
    // 状态
    isRunning: state.data?.isRunning || false,
    elapsedTime: state.data?.elapsedTime || 0,
    minutes: state.data?.minutes || 0,
    currentStep: state.currentStep,
    isLoading: state.isLoading,
    error: state.error,
    hasSession: !!state.data,

    // 操作
    startTimer,
    pauseTimer,
    resetTimer,

    // 工具函数
    formatTime,
    getCurrentStepInfo,
    getTotalProgress,
  }
} 