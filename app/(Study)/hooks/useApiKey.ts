'use client'

import { useState, useEffect } from 'react'

// API key存储的接口
interface ApiKeyData {
  key: string
  provider: 'openai' | 'gemini'
  timestamp: number
  expiresIn: number // 过期时间（毫秒）
}

// 简单的加密/解密函数（Base64 + 简单混淆）
const encryptApiKey = (data: ApiKeyData): string => {
  const jsonStr = JSON.stringify(data)
  const encoded = btoa(jsonStr)
  // 简单混淆：添加随机前缀和后缀
  const prefix = 'ak_'
  const suffix = '_' + Date.now().toString(36)
  return prefix + encoded + suffix
}

const decryptApiKey = (encryptedData: string): ApiKeyData | null => {
  try {
    // 移除前缀和后缀
    const withoutPrefix = encryptedData.replace(/^ak_/, '')
    const withoutSuffix = withoutPrefix.replace(/_[a-z0-9]+$/, '')
    const decoded = atob(withoutSuffix)
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Failed to decrypt API key:', error)
    return null
  }
}

// 默认过期时间：7天
const DEFAULT_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000

export const useApiKey = () => {
  const [apiKeyData, setApiKeyData] = useState<ApiKeyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 检查API key是否过期
  const isExpired = (data: ApiKeyData): boolean => {
    return Date.now() > (data.timestamp + data.expiresIn)
  }

  // 从localStorage加载API key
  const loadApiKey = (): ApiKeyData | null => {
    try {
      const stored = localStorage.getItem('user_api_key')
      if (!stored) return null

      const decrypted = decryptApiKey(stored)
      if (!decrypted) return null

      // 检查是否过期
      if (isExpired(decrypted)) {
        localStorage.removeItem('user_api_key')
        return null
      }

      return decrypted
    } catch (error) {
      console.error('Failed to load API key:', error)
      localStorage.removeItem('user_api_key')
      return null
    }
  }

  // 保存API key
  const saveApiKey = (key: string, provider: 'openai' | 'gemini', expiresIn: number = DEFAULT_EXPIRES_IN): boolean => {
    try {
      const data: ApiKeyData = {
        key: key.trim(),
        provider,
        timestamp: Date.now(),
        expiresIn
      }

      const encrypted = encryptApiKey(data)
      localStorage.setItem('user_api_key', encrypted)
      setApiKeyData(data)
      return true
    } catch (error) {
      console.error('Failed to save API key:', error)
      return false
    }
  }

  // 清除API key
  const clearApiKey = (): void => {
    localStorage.removeItem('user_api_key')
    setApiKeyData(null)
  }

  // 验证API key格式
  const validateApiKey = (key: string, provider: 'openai' | 'gemini'): boolean => {
    if (!key || key.trim().length === 0) return false

    switch (provider) {
      case 'openai':
        // OpenAI API key格式：sk-开头
        return key.trim().startsWith('sk-')
      case 'gemini':
        // Gemini API key不做格式校验
        return true
      default:
        return false
    }
  }

  // 获取剩余有效时间（毫秒）
  const getRemainingTime = (): number => {
    if (!apiKeyData) return 0
    const remaining = (apiKeyData.timestamp + apiKeyData.expiresIn) - Date.now()
    return Math.max(0, remaining)
  }

  // 获取剩余有效时间（格式化字符串）
  const getRemainingTimeFormatted = (): string => {
    const remaining = getRemainingTime()
    if (remaining === 0) return '已过期'

    const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    
    if (days > 0) return `${days}天${hours}小时`
    if (hours > 0) return `${hours}小时`
    return '不到1小时'
  }

  // 组件初始化时加载API key
  useEffect(() => {
    const data = loadApiKey()
    setApiKeyData(data)
    setIsLoading(false)
  }, [])

  return {
    apiKeyData,
    isLoading,
    hasValidApiKey: !!apiKeyData,
    saveApiKey,
    clearApiKey,
    validateApiKey,
    getRemainingTime,
    getRemainingTimeFormatted,
    isExpired: apiKeyData ? isExpired(apiKeyData) : true
  }
} 