import { createAnthropic } from '@ai-sdk/anthropic'
import { addMemories, getMemories, createMem0 } from '@mem0/vercel-ai-provider'
import { streamText } from 'ai'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

// 系统提示词，强调基于记忆的个性化回答
const SYSTEM_PROMPT = `
你是一位专业的AI助手。请基于用户的历史记忆来提供个性化的回答：

1. 优先使用用户的历史记忆来回答问题
2. 避免重复询问已知信息
3. 根据用户的偏好和过往经历调整回答风格
4. 如果记忆中有相关信息，请在回答中体现出来
5. 保持友好、专业的对话风格

记住：你拥有关于用户的长期记忆，请善用这些信息来提供更好的服务。
`

export async function POST(req: Request) {
  try {
    const { messages, userId, sessionId, useMemory = true } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages are required', { status: 400 })
    }

    if (!userId) {
      return new Response('User ID is required for memory functionality', {
        status: 400,
      })
    }

    // 检查必要的环境变量
    if (!process.env.NEXT_PUBLIC_ANTHROPIV_API_KEY) {
      return new Response('Anthropic API key not configured', { status: 500 })
    }

    if (!process.env.NEXT_PUBLIC_MEM0_API_KEY) {
      return new Response('MEM0 API key not configured', { status: 500 })
    }

    // 初始化Anthropic客户端
    const anthropic = createAnthropic({
      apiKey: process.env.NEXT_PUBLIC_ANTHROPIV_API_KEY,
    })

    const aiConfig = {
      provider: anthropic('claude-3-5-sonnet-20240620'),
      apiKey: process.env.NEXT_PUBLIC_ANTHROPIV_API_KEY,
    }

    // MEM0配置参数
    const mem0Config = {
      user_id: userId,
      mem0ApiKey: process.env.NEXT_PUBLIC_MEM0_API_KEY,
      org_id: process.env.MEM0_ORGANIZATION_NAME || 'default',
      project_id: process.env.MEM0_PROJECT_NAME || 'aiMeet',
    }

    let enhancedMessages = [...messages]
    let memoryContext = ''

    // 如果启用记忆功能
    if (useMemory) {
      try {
        // 获取相关记忆
        console.log('正在检索相关记忆...')
        const relevantMemories = await getMemories(messages, {
          ...aiConfig,
          ...mem0Config,
          rerank: true,
          threshold: 0.3, // 相关性阈值
          top_k: 5, // 返回最相关的5条记忆
          output_format: 'v1.0',
        })

        console.log('检索到的记忆数量:', relevantMemories.length)

        // 如果有相关记忆，添加到上下文中
        if (relevantMemories.length > 0) {
          memoryContext = relevantMemories
            .map((memory: any) => `- ${memory.memory}`)
            .join('\n')

          // 创建包含记忆的系统消息
          const systemMessageWithMemory = {
            role: 'system' as const,
            content: `${SYSTEM_PROMPT}

以下是关于用户的相关记忆信息：
${memoryContext}

请基于这些记忆信息来回答用户的问题，提供更个性化的回应。`,
          }

          // 将系统消息添加到对话开头
          enhancedMessages = [systemMessageWithMemory, ...messages]
        } else {
          // 没有相关记忆时使用基础系统提示
          const basicSystemMessage = {
            role: 'system' as const,
            content: SYSTEM_PROMPT,
          }
          enhancedMessages = [basicSystemMessage, ...messages]
        }
      } catch (memoryError) {
        console.warn('记忆服务错误，继续正常对话:', memoryError)
        // 如果记忆服务出错，使用基础系统提示
        const basicSystemMessage = {
          role: 'system' as const,
          content: SYSTEM_PROMPT,
        }
        enhancedMessages = [basicSystemMessage, ...messages]
      }
    }

    // 生成AI回复
    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022'), // 使用最新的Claude模型
      messages: enhancedMessages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // 异步存储新的记忆
    if (useMemory) {
      setImmediate(async () => {
        try {
          console.log('正在存储新的记忆...')
          const newMemories = await addMemories(messages, {
            ...aiConfig,
            ...mem0Config,
          })
          console.log('存储的新记忆数量:', newMemories.length)
        } catch (error) {
          console.error('存储记忆时出错:', error)
        }
      })
    }

    // 返回流式响应
    const response = result.toDataStreamResponse({
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })

    return response
  } catch (error) {
    console.error('聊天错误:', error)
    return new Response(
      JSON.stringify({
        error: '内部服务器错误',
        details: error instanceof Error ? error.message : '未知错误',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// 处理OPTIONS请求（CORS预检）
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
