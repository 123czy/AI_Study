import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const openai = createOpenAI({
    apiKey: process.env.NEXT_API_key,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  })

  const result = streamText({
    model: openai('qwen-plus'),
    messages,
  })

  const response = result.toDataStreamResponse()

  return response
}
