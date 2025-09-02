# Anthropic + MEM0 聊天记忆集成指南

本指南展示如何在项目中集成 Anthropic Claude 模型与 MEM0 记忆服务，实现具有长期记忆的 AI 聊天功能。

## 🚀 功能特性

- **智能记忆检索**：自动从历史对话中检索相关记忆
- **个性化回答**：基于用户历史信息提供个性化回应
- **自动记忆存储**：对话过程中自动存储重要信息
- **高性能**：使用最新的 Claude 3.5 Sonnet 模型
- **可配置**：支持记忆相关性阈值、数量等参数调整

## 📋 环境变量配置

在项目根目录创建 `.env.local` 文件并添加以下配置：

```bash
# ⚠️ 重要：这些是服务器端环境变量，不要使用 NEXT_PUBLIC_ 前缀！

# Anthropic API 配置
# 获取地址：https://console.anthropic.com/
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# MEM0 API 配置  
# 获取地址：https://app.mem0.ai/
MEM0_API_KEY=your_mem0_api_key_here
MEM0_ORGANIZATION_NAME=your_organization_name
MEM0_PROJECT_NAME=aiMeet

# 可选配置
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 其他已有的环境变量（保持不变）
NEXT_API_key=your_existing_api_key
DATABASE_URL=your_database_url
```

### ⚠️ 安全提醒

- **绝对不要**将API密钥使用 `NEXT_PUBLIC_` 前缀，这会将密钥暴露到客户端
- API密钥应该只在服务器端使用
- 确保 `.env.local` 文件在 `.gitignore` 中（已包含）

## 🛠 API 使用方法

### 基础聊天请求

```typescript
const response = await fetch('/api/chat-with-memory', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      {
        role: 'user',
        content: '你好，我是张三，我喜欢编程和看书',
      },
    ],
    userId: 'user_123',
    sessionId: 'session_456', // 可选
    useMemory: true, // 启用记忆功能
  }),
})
```

### 在 React 组件中使用

```tsx
import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWithMemory() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat-with-memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          userId: 'user_123', // 实际使用时应该是动态的用户ID
          useMemory: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // 处理流式响应
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      let assistantMessage = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        assistantMessage += chunk

        // 实时更新UI
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = assistantMessage
          } else {
            newMessages.push({ role: 'assistant', content: assistantMessage })
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // 处理错误
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-200">
              正在思考中...
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="输入消息..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}
```

## 🔧 高级配置

### 自定义记忆检索参数

```typescript
const response = await fetch('/api/chat-with-memory', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: messages,
    userId: userId,
    useMemory: true,
    memoryConfig: {
      threshold: 0.5, // 记忆相关性阈值 (0-1)
      topK: 3, // 返回最相关的记忆数量
      rerank: true, // 是否重新排序
    },
  }),
})
```

### 记忆管理工具函数

```typescript
// 清除用户记忆
export async function clearUserMemories(userId: string) {
  // 实现清除逻辑
}

// 获取用户所有记忆
export async function getUserMemories(userId: string) {
  // 实现获取逻辑
}

// 搜索特定记忆
export async function searchMemories(query: string, userId: string) {
  // 实现搜索逻辑
}
```

## 📝 记忆数据结构

MEM0 自动存储的记忆包含以下信息：

```typescript
interface MemoryItem {
  id: string
  memory: string // 记忆内容
  user_id: string // 用户ID
  metadata: {
    timestamp: string // 时间戳
    relevance_score: number // 相关性分数
  }
}
```

## 🎯 最佳实践

### 1. 用户 ID 管理

```typescript
// 使用稳定的用户标识符
const userId = user.id || `guest_${Date.now()}`
```

### 2. 错误处理

```typescript
try {
  const response = await fetch('/api/chat-with-memory', {
    // ... 配置
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  // 处理响应
} catch (error) {
  console.error('Chat error:', error)
  // 降级到无记忆模式
}
```

### 3. 记忆优化

- 定期清理过期记忆
- 为不同场景设置不同的记忆阈值
- 使用有意义的用户 ID 和会话 ID

## 🔍 故障排除

### 常见问题

1. **API 密钥错误**

   - 确认 Anthropic 和 MEM0 的 API 密钥正确配置
   - 检查密钥权限和配额

2. **记忆检索失败**

   - 检查用户 ID 是否正确
   - 确认 MEM0 服务状态

3. **响应缓慢**
   - 调整记忆检索参数
   - 考虑缓存策略

### 日志监控

API 会输出详细的日志信息：

```
正在检索相关记忆...
检索到的记忆数量: 3
正在存储新的记忆...
存储的新记忆数量: 1
```

## 📈 性能优化

1. **并行处理**：记忆存储在后台异步进行
2. **缓存策略**：考虑实现记忆缓存
3. **分页加载**：对于大量历史记忆进行分页
4. **压缩传输**：启用响应压缩

## 🔒 安全注意事项

1. **API 密钥保护**：确保密钥不会泄露到客户端
2. **用户数据隔离**：确保用户间的记忆数据隔离
3. **访问控制**：实现适当的用户身份验证
4. **数据加密**：考虑对敏感记忆数据进行加密

## 📖 相关资源

- [Anthropic API 文档](https://docs.anthropic.com/)
- [MEM0 官方文档](https://docs.mem0.ai/)
- [Vercel AI SDK](https://sdk.vercel.ai/)

---

通过这个集成方案，你的 AI 聊天应用将具备强大的长期记忆能力，为用户提供更加个性化和连贯的对话体验。
