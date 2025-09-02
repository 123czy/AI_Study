interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface MemoryItem {
  id: string
  content: string
  user_id: string
  session_id?: string
  metadata: {
    timestamp: string
    type: 'conversation' | 'fact' | 'preference'
    relevance_score?: number
  }
}

interface Mem0Config {
  apiKey: string
  organizationName: string
  projectName: string
}

interface ApiResponse {
  memories?: MemoryItem[]
  memory?: MemoryItem
  error?: string
}

class Mem0Service {
  private config: Mem0Config
  private baseUrl = 'https://api.mem0.ai'

  constructor(config: Mem0Config) {
    this.config = config
  }

  private async makeRequest(
    endpoint: string,
    method: string = 'GET',
    data?: any
  ): Promise {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      Authorization: `Token ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    }

    try {
      console.log('Making request to Mem0 API:', {
        url,
        method,
        headers: { ...headers, Authorization: 'Token ***' }, // 隐藏实际的 API Key
        data: data ? JSON.stringify(data) : undefined,
      })

      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Mem0 API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
        })
        throw new Error(
          `Mem0 API error: ${response.status} ${response.statusText}\nDetails: ${errorText}`
        )
      }

      const result = await response.json()
      console.log('Mem0 API response:', result)
      return result
    } catch (error) {
      console.error('Mem0 API request failed:', error)
      throw error
    }
  }

  async addMemory(
    content: string,
    userId: string,
    sessionId?: string,
    metadata?: any
  ): Promise {
    const data = {
      messages: [{ role: 'user', content }],
      user_id: userId,
      session_id: sessionId,
      metadata: {
        timestamp: new Date().toISOString(),
        type: 'conversation',
        ...metadata,
      },
      project_id: this.config.projectName,
    }

    return await this.makeRequest<ApiResponse>('/v2/memories', 'POST', data)
  }

  async searchMemories(query: string, userId: string): Promise {
    const data = {
      query,
      filters: JSON.stringify({ user_id: userId }),
      top_k: 10,
      rerank: true,
      project_id: this.config.projectName,
    }

    const response = await this.makeRequest<ApiResponse>(
      '/v2/memories/search',
      'POST',
      data
    )
    return response.memories || []
  }

  async getUserMemories(userId: string): Promise {
    const data = {
      filters: JSON.stringify({ user_id: userId }),
      project_id: this.config.projectName,
    }
    const response = await this.makeRequest<ApiResponse>(
      '/v2/memories',
      'POST',
      data
    )
    return response.memories || []
  }

  async updateMemory(
    memoryId: string,
    content: string,
    metadata?: any
  ): Promise {
    const data = {
      content,
      metadata: {
        ...metadata,
        updated_at: new Date().toISOString(),
      },
      project_id: this.config.projectName,
    }

    return await this.makeRequest(`/v1/memories/${memoryId}`, 'PUT', data)
  }

  async deleteMemory(memoryId: string): Promise {
    await this.makeRequest(`/v1/memories/${memoryId}`, 'DELETE')
  }

  // 清空用户所有记忆
  async clearUserMemories(userId: string): Promise {
    await this.makeRequest(`/v1/memories/users/${userId}`, 'DELETE')
  }

  // 获取记忆历史
  async getMemoryHistory(userId: string, sessionId?: string): Promise {
    await this.getUserMemories(userId, sessionId)
  }

  // 基于对话上下文提取关键信息
  extractKeyInfo(messages: Array): string {
    const userMessages = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
    const assistantMessages = messages
      .filter((m) => m.role === 'assistant')
      .map((m) => m.content)

    // 简单的关键信息提取逻辑
    const keyInfo: string[] = []

    // 提取用户提到的技能、经验、偏好等
    userMessages.forEach((msg) => {
      if (
        msg.includes('擅长') ||
        msg.includes('经验') ||
        msg.includes('技能')
      ) {
        keyInfo.push(msg)
      }
    })

    return keyInfo.join('; ')
  }
}

let mem0Instance: Mem0Service | null = null

export function getMem0Service(): Mem0Service {
  if (!mem0Instance) {
    const config: Mem0Config = {
      apiKey: process.env.NEXT_PUBLIC_MEM0_API_KEY || '',
      organizationName: process.env.NEXT_PUBLIC_MEM0_ORGANIZATION_NAME || '',
      projectName: process.env.NEXT_PUBLIC_MEM0_PROJECT_NAME || 'aiMeet',
    }

    console.log('Mem0 Config:', {
      hasApiKey: !!config.apiKey,
      hasOrgName: !!config.organizationName,
      projectName: config.projectName,
    })

    if (!config.apiKey) {
      throw new Error('NEXT_PUBLIC_MEM0_API_KEY is required')
    }

    mem0Instance = new Mem0Service(config)
  }

  return mem0Instance
}

export type { MemoryItem, Mem0Config }
export { Mem0Service }
