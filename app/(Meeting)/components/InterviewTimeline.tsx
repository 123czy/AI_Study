'use client'

import { useInterviewTimer } from '../hooks/useInterviewTimer'
import { timelineConfig } from '../Meet/api/prompt'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, Clock, AlertCircle } from 'lucide-react'

export const InterviewTimeline = () => {
  const {
    isRunning,
    elapsedTime,
    minutes,
    currentStep,
    isLoading,
    error,
    hasSession,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
    getCurrentStepInfo,
    getTotalProgress,
  } = useInterviewTimer()

  const currentStepInfo = getCurrentStepInfo()
  const totalProgress = getTotalProgress()

  return (
    <div className="space-y-6">
      {/* 计时器控制卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            面试计时器
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 时间显示 */}
          <div className="text-center">
            <div className="text-4xl font-bold font-mono">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {minutes} 分钟
            </div>
          </div>

          {/* 总体进度 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>总体进度</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </div>

          {/* 控制按钮 */}
          <div className="flex gap-2 justify-center">
            {!isRunning ? (
              <Button
                onClick={startTimer}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {hasSession ? '继续' : '开始面试'}
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                disabled={isLoading}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                暂停
              </Button>
            )}
            <Button
              onClick={resetTimer}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 当前阶段信息 */}
      {currentStepInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>当前阶段</span>
              <Badge variant={isRunning ? "default" : "secondary"}>
                {currentStepInfo.focus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>阶段进度</span>
                <span>{Math.round(currentStepInfo.progress)}%</span>
              </div>
              <Progress value={currentStepInfo.progress} className="h-2" />
            </div>

            <div className="text-sm text-muted-foreground">
              <div>剩余时间: {formatTime(currentStepInfo.timeLeft)}</div>
              <div className="mt-2">
                时间范围: {currentStepInfo.startTime}分钟 - {' '}
                {currentStepInfo.endTime === Infinity ? '结束' : `${currentStepInfo.endTime}分钟`}
              </div>
            </div>

            {/* 阶段提示 */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-1">阶段提示:</div>
              <div className="text-sm text-muted-foreground">
                {currentStepInfo.prompt.split('\n')[0]}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 时间线 */}
      <Card>
        <CardHeader>
          <CardTitle>面试时间线</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineConfig.steps.map((step, index) => {
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              const isPending = index > currentStep

              return (
                <div
                  key={step.focus}
                  className={`flex items-start gap-3 ${
                    isActive ? 'opacity-100' : isPending ? 'opacity-50' : 'opacity-75'
                  }`}
                >
                  {/* 时间线点 */}
                  <div className="relative flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        isActive
                          ? 'bg-primary border-primary'
                          : isCompleted
                          ? 'bg-green-500 border-green-500'
                          : 'bg-background border-muted-foreground'
                      }`}
                    />
                    {index < timelineConfig.steps.length - 1 && (
                      <div
                        className={`absolute top-3 left-1.5 w-0.5 h-8 -translate-x-1/2 ${
                          isCompleted ? 'bg-green-500' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>

                  {/* 阶段信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{step.focus}</h4>
                      {isActive && (
                        <Badge variant="default" className="text-xs">
                          进行中
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          已完成
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.startTime}分钟 - {' '}
                      {step.endTime === Infinity ? '结束' : `${step.endTime}分钟`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 