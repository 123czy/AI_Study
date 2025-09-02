import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
// import { getMem0Service, type MemoryItem } from '@/lib/mem0-service'
import MemoryService from '@/lib/memory'
import { addMemories ,getMemories,createMem0} from '@mem0/vercel-ai-provider';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { messages, userId, sessionId, useMemory } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages are required', { status: 400 })
    }

    // 注意：如果要使用Anthropic，请使用 /api/chat-with-memory 端点
    // 这里保持原有的阿里云模型配置

    const openai = createOpenAI({
      apiKey: process.env.NEXT_API_key,
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    })

    let enhancedMessages = messages;

    // 如果启用记忆功能且配置了MEM0_API_KEY
    if (useMemory && userId && process.env.NEXT_PUBLIC_MEM0_API_KEY) {
      try {
        const memoryService = new MemoryService(process.env.MEM0_API_KEY || '')
        await memoryService.addMemory({
          messages: messages,
          user_id: userId,
          agent_id: '123',
          session_id: sessionId,
          metadata: {
            type: 'conversation',
            timestamp: new Date().toISOString(),
          }
        })
        const latestUserMessage = messages[messages.length - 1];
        if (latestUserMessage?.role === 'user') {
          // 搜索相关记忆
          const relevantMemories = await memoryService.searchMemories(
            {
              query: latestUserMessage.content,
              user_id: userId,
              agent_id: '123',
              filters: {}
            }
          );
          const highRelevantMemories = relevantMemories.results.filter((memory: { score: number }) => memory.score > 0.6)
          console.log("highRelevantMemories11", highRelevantMemories)
          // 如果有相关记忆，添加到上下文中
          if (highRelevantMemories.length > 0) {
            // 获取用户历史记忆
                const memoryContext = highRelevantMemories
               .map((memory: { memory: string }) => `${memory.memory}`)
               .join('\n');

            // 获取之前ai的恢复内容
              const aiResponse = messages.filter((message: { role: string }) => message.role === 'assistant').map((message: { content: string }) => message.content)
              console.log("aiResponse11", aiResponse)
              const aiResponseContext = aiResponse.map((response: string) => `${response}`).join('\n');
              console.log("aiResponseContext11", aiResponseContext)

            const systemMessage = {
              role: 'system' as const,
              content: `你是一位专业的面试官。请参考以下历史记忆来提供更个性化的回答：\n\n${memoryContext}\n\n请基于这些信息进行面试对话。这是你之前的回复内容:\n\n${aiResponseContext}\n\n,请注意已经问过的问题不要重复问,请根据候选人的回答进行追问。`
            };

            enhancedMessages = [systemMessage];
          }
        }
      } catch (memoryError) {
        console.warn('Memory service error:', memoryError);
        // 如果记忆服务出错，继续正常的聊天流程
      }
    }

    console.log("enhancedMessages---------", enhancedMessages)

    const result = streamText({
      model: openai('qwen-plus'),
      messages: enhancedMessages,
    })

    const response = result.toDataStreamResponse({
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    })

    return response
  } catch (error) {
    console.error('Chat error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
