interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface MemoryItem {
  messages: Message[]
  user_id: string
  agent_id: string
  session_id?: string
  metadata?: {
    timestamp: string
    type: 'conversation' | 'fact' | 'preference'
    relevance_score?: number
  }
}

interface SearchMemoriesResponse {
  query: string
  user_id: string
  agent_id: string
  filters: any
}

class MemoryService {
  private apiKey: string
  private baseUrl = 'http://localhost:8888'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getMemories(userId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/memories?user_id=${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching memories:', error)
      return []
    }
  }

  async addMemory(memory: MemoryItem) {
    try {
      const response = await fetch(`${this.baseUrl}/memories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memory),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error adding memory:', error)
      return []
    }
  }

  async deleteMemory(userId: string, agent_id: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/memories?user_id=${userId}&agent_id=${agent_id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      const data = await response.json()
      console.log('deleteMemory', data, userId, agent_id)
      return data
    } catch (error) {
      console.error('Error deleting memory:', error)
      return []
    }
  }

  async searchMemories(query: SearchMemoriesResponse) {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      })
      const data = await response.json()
      console.log('searchMemories', data, query)
      return data
    } catch (error) {
      console.error('Error searching memories:', error)
      return []
    }
  }
}

export default MemoryService
export type { MemoryItem, SearchMemoriesResponse }
