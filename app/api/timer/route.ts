import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { action, sessionId } = await request.json()

    switch (action) {
      case 'start': {
        const now = new Date()
        
        if (sessionId) {
          // 恢复现有会话
          const session = await prisma.interviewSession.findUnique({
            where: { id: sessionId }
          })

          if (!session) {
            return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 })
          }

          const updatedSession = await prisma.interviewSession.update({
            where: { id: sessionId },
            data: {
              status: 'active',
              totalDuration: {
                increment: session.status === 'paused' ? 
                  Math.floor((now.getTime() - session.updatedAt.getTime()) / 1000) : 0
              }
            }
          })

          return NextResponse.json({
            success: true,
            sessionId: updatedSession.id,
            message: 'Timer resumed'
          })
        } else {
          // 创建新会话
          const newSession = await prisma.interviewSession.create({
            data: {
              startTime: now,
              status: 'active'
            }
          })

          return NextResponse.json({
            success: true,
            sessionId: newSession.id,
            message: 'Timer started'
          })
        }
      }

      case 'pause': {
        if (!sessionId) {
          return NextResponse.json({ success: false, message: 'Session ID required' }, { status: 400 })
        }

        const session = await prisma.interviewSession.findUnique({
          where: { id: sessionId }
        })

        if (!session) {
          return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 })
        }

        const updatedSession = await prisma.interviewSession.update({
          where: { id: sessionId },
          data: {
            status: 'paused',
            totalDuration: {
              increment: Math.floor((Date.now() - session.updatedAt.getTime()) / 1000)
            }
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Timer paused'
        })
      }

      case 'reset': {
        if (sessionId) {
          await prisma.interviewSession.update({
            where: { id: sessionId },
            data: {
              status: 'completed',
              endTime: new Date()
            }
          })
        }

        return NextResponse.json({
          success: true,
          message: 'Timer reset'
        })
      }

      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Timer API error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Session ID required' }, { status: 400 })
    }

    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 })
    }

    const now = new Date()
    const elapsedTime = session.status === 'active'
      ? (session.totalDuration * 1000) + (now.getTime() - session.updatedAt.getTime())
      : session.totalDuration * 1000

    const minutes = Math.floor(elapsedTime / 1000 / 60)
    
    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        elapsedTime,
        minutes,
        isRunning: session.status === 'active',
        startTime: session.startTime.getTime(),
        createdAt: session.createdAt.getTime(),
        status: session.status,
        currentStep: session.currentStep
      }
    })
  } catch (error) {
    console.error('Timer GET API error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
} 