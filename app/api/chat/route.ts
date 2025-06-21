import { createOpenAI } from '@ai-sdk/openai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { streamObject } from 'ai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Add cache control headers
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  const { messages } = await req.json();

  const openai = createOpenAI({
    apiKey: process.env.NEXT_API_key,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  });

  const result = streamText({
    model: openai('qwen-plus'),
    messages,
  });

  const response = result.toDataStreamResponse();
  
  // Add headers to the response
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}