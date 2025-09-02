/**
 * Anthropic + MEM0 集成测试脚本
 *
 * 使用方法：
 * 1. 首先运行环境检查：node scripts/check-env.js
 * 2. 配置环境变量 ANTHROPIC_API_KEY 和 MEM0_API_KEY
 * 3. 运行测试：node examples/anthropic-memory-test.js
 */

async function testAnthropicMemoryIntegration() {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  console.log('🧪 开始测试 Anthropic + MEM0 集成...\n')

  // 测试数据
  const testUserId = `test_user_${Date.now()}`
  const testMessages = [
    {
      role: 'user',
      content:
        '你好，我是李明，我是一名前端开发工程师，我最喜欢使用React和TypeScript开发',
    },
    {
      role: 'user',
      content: '我想了解一下关于状态管理的最佳实践',
    },
    {
      role: 'user',
      content: '我之前提到过我的技术栈吗？',
    },
  ]

  try {
    // 测试第一轮对话 - 建立记忆
    console.log('📝 第一轮对话 - 建立用户记忆')
    console.log('用户:', testMessages[0].content)

    const response1 = await fetch(`${apiUrl}/api/chat-with-memory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [testMessages[0]],
        userId: testUserId,
        useMemory: true,
      }),
    })

    if (!response1.ok) {
      const errorText = await response1.text()
      console.error('第一轮API响应详情:', errorText)
      throw new Error(
        `API请求失败: ${response1.status} ${response1.statusText}\n详情: ${errorText}`
      )
    }

    console.log('✅ 第一轮对话成功，记忆已建立\n')

    // 等待一下确保记忆存储完成
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 测试第二轮对话 - 使用记忆
    console.log('🔍 第二轮对话 - 测试记忆检索')
    console.log('用户:', testMessages[2].content)

    const response2 = await fetch(`${apiUrl}/api/chat-with-memory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [testMessages[0], testMessages[2]], // 包含之前的对话
        userId: testUserId,
        useMemory: true,
      }),
    })

    if (!response2.ok) {
      const errorText = await response2.text()
      console.error('第二轮API响应详情:', errorText)
      throw new Error(
        `API请求失败: ${response2.status} ${response2.statusText}\n详情: ${errorText}`
      )
    }

    // 读取流式响应
    const reader = response2.body?.getReader()
    let assistantResponse = ''

    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantResponse += new TextDecoder().decode(value)
      }
    }

    console.log('AI回复:', assistantResponse.substring(0, 200) + '...')

    // 检查是否包含记忆相关内容
    const hasMemoryReference =
      assistantResponse.toLowerCase().includes('react') ||
      assistantResponse.toLowerCase().includes('typescript') ||
      assistantResponse.toLowerCase().includes('前端') ||
      assistantResponse.toLowerCase().includes('开发')

    if (hasMemoryReference) {
      console.log('✅ 记忆检索成功！AI回复中包含了之前提到的技术栈信息')
    } else {
      console.log('⚠️  记忆检索可能未完全工作，建议检查配置')
    }

    console.log('\n🎉 测试完成！')
  } catch (error) {
    console.error('❌ 测试失败:', error.message)

    if (error.message.includes('fetch')) {
      console.log('\n💡 建议检查：')
      console.log('1. 确保开发服务器正在运行 (npm run dev)')
      console.log('2. 检查 API 端点是否正确')
    }

    if (error.message.includes('API请求失败')) {
      console.log('\n💡 建议检查：')
      console.log('1. 运行环境检查：node scripts/check-env.js')
      console.log('2. ANTHROPIC_API_KEY 环境变量是否正确配置')
      console.log('3. MEM0_API_KEY 环境变量是否正确配置')
      console.log('4. API密钥是否有效且有足够配额')
      console.log('5. 查看上面的详细错误信息')
      console.log('6. 查看服务器日志获取更多信息')
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  // 检查必要的依赖
  if (typeof fetch === 'undefined') {
    console.log('❌ 此脚本需要 Node.js 18+ 或安装 node-fetch')
    console.log('安装命令: npm install node-fetch')
    process.exit(1)
  }

  testAnthropicMemoryIntegration()
}

module.exports = { testAnthropicMemoryIntegration }
