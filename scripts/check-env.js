#!/usr/bin/env node

/**
 * 环境变量检查脚本
 * 
 * 使用方法：
 * node scripts/check-env.js
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 检查 Anthropic + MEM0 环境变量配置...\n')

// 读取 .env.local 文件
const envLocalPath = path.join(process.cwd(), '.env')
const envExamplePath = path.join(process.cwd(), '.env.example')

// 必需的环境变量
const requiredVars = [
  'ANTHROPIC_API_KEY',
  'MEM0_API_KEY'
]

// 可选的环境变量
const optionalVars = [
  'MEM0_ORGANIZATION_NAME',
  'MEM0_PROJECT_NAME',
  'NEXT_PUBLIC_APP_URL'
]

// 错误的环境变量名称（用户可能会误用）
const incorrectVars = [
  'NEXT_PUBLIC_ANTHROPIC_API_KEY',
  'NEXT_PUBLIC_ANTHROPIV_API_KEY', // 常见拼写错误
  'NEXT_PUBLIC_MEM0_API_KEY'
]

function checkEnvFile() {
  console.log('📁 检查 .env.local 文件...')
  
  if (!fs.existsSync(envLocalPath)) {
    console.log('❌ .env.local 文件不存在')
    console.log('\n💡 请在项目根目录创建 .env.local 文件并添加以下内容：')
    console.log(`
# Anthropic API 配置
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# MEM0 API 配置
MEM0_API_KEY=your_mem0_api_key_here
MEM0_ORGANIZATION_NAME=your_organization_name
MEM0_PROJECT_NAME=aiMeet
`)
    return false
  }

  console.log('✅ .env.local 文件存在')
  return true
}

function parseEnvFile() {
  try {
    const envContent = fs.readFileSync(envLocalPath, 'utf8')
    const envVars = {}
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim()
        }
      }
    })
    
    return envVars
  } catch (error) {
    console.error('❌ 读取 .env.local 文件失败:', error.message)
    return null
  }
}

function checkRequiredVars(envVars) {
  console.log('\n🔑 检查必需的环境变量...')
  
  let allPresent = true
  
  requiredVars.forEach(varName => {
    const value = envVars[varName]
    if (!value || value.trim() === '' || value === 'your_' + varName.toLowerCase().replace('_', '_')) {
      console.log(`❌ ${varName}: 未设置或为示例值`)
      allPresent = false
    } else {
      // 显示部分值用于验证
      const displayValue = value.length > 10 ? 
        value.substring(0, 6) + '...' + value.substring(value.length - 4) : 
        '***'
      console.log(`✅ ${varName}: ${displayValue}`)
    }
  })
  
  return allPresent
}

function checkOptionalVars(envVars) {
  console.log('\n⚙️  检查可选的环境变量...')
  
  optionalVars.forEach(varName => {
    const value = envVars[varName]
    if (value && value.trim() !== '') {
      console.log(`✅ ${varName}: ${value}`)
    } else {
      console.log(`⚠️  ${varName}: 未设置（可选）`)
    }
  })
}

function checkIncorrectVars(envVars) {
  console.log('\n🚨 检查常见的错误配置...')
  
  let hasErrors = false
  
  incorrectVars.forEach(varName => {
    if (envVars[varName]) {
      console.log(`❌ 发现错误的环境变量: ${varName}`)
      console.log(`   应该使用: ${varName.replace('NEXT_PUBLIC_', '').replace('ANTHROPIV', 'ANTHROPIC')}`)
      hasErrors = true
    }
  })
  
  if (!hasErrors) {
    console.log('✅ 没有发现常见的配置错误')
  }
  
  return !hasErrors
}

function validateApiKeyFormats(envVars) {
  console.log('\n🔍 验证 API 密钥格式...')
  
  // Anthropic API Key 格式验证
  const anthropicKey = envVars['ANTHROPIC_API_KEY']
  if (anthropicKey) {
    if (anthropicKey.startsWith('sk-ant-')) {
      console.log('✅ ANTHROPIC_API_KEY: 格式正确')
    } else {
      console.log('⚠️  ANTHROPIC_API_KEY: 格式可能不正确（应以 sk-ant- 开头）')
    }
  }
  
  // MEM0 API Key 基本验证
  const mem0Key = envVars['MEM0_API_KEY']
  if (mem0Key) {
    if (mem0Key.length > 10) {
      console.log('✅ MEM0_API_KEY: 长度合理')
    } else {
      console.log('⚠️  MEM0_API_KEY: 长度可能不够')
    }
  }
}

function main() {
  let success = true
  
  // 检查文件存在
  if (!checkEnvFile()) {
    process.exit(1)
  }
  
  // 解析环境变量
  const envVars = parseEnvFile()
  if (!envVars) {
    process.exit(1)
  }
  
  // 检查必需变量
  if (!checkRequiredVars(envVars)) {
    success = false
  }
  
  // 检查可选变量
  checkOptionalVars(envVars)
  
  // 检查错误配置
  if (!checkIncorrectVars(envVars)) {
    success = false
  }
  
  // 验证格式
  validateApiKeyFormats(envVars)
  
  console.log('\n' + '='.repeat(50))
  
  if (success) {
    console.log('🎉 环境变量配置检查通过！')
    console.log('\n📝 下一步：')
    console.log('1. 启动开发服务器: npm run dev')
    console.log('2. 运行测试: node examples/anthropic-memory-test.js')
  } else {
    console.log('❌ 环境变量配置有问题，请修复后重试')
    console.log('\n💡 获取 API 密钥：')
    console.log('- Anthropic: https://console.anthropic.com/')
    console.log('- MEM0: https://app.mem0.ai/')
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

module.exports = { main } 