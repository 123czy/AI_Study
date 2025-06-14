'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EyeIcon, EyeOffIcon, InfoIcon } from 'lucide-react'
import { useApiKey } from '../hooks/useApiKey'
import { useGlobalModal, globalModal } from './GlobalModal'
import { useRouter } from 'next/navigation'

interface ApiKeyPageProps {
  onSuccess?: () => void
  onCancel?: () => void
}

const ApiKeyPage = ({ onSuccess, onCancel }: ApiKeyPageProps) => {
  const { saveApiKey, validateApiKey, apiKeyData } = useApiKey()
  const { showModal, hideModal } = useGlobalModal()
  const router = useRouter()
  const [formData, setFormData] = useState({
    apiKey: '',
    provider: apiKeyData?.provider || 'openai' as 'openai' | 'gemini',
    expiresIn: '7',// 天数
    level: 'A1',
    voice: 'A1',
    speed:'A3'
  })
  
  const [showApiKey, setShowApiKey] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const expirationOptions = [
    { value: '1', label: '1天' },
    { value: '3', label: '3天' },
    { value: '7', label: '7天' },
    { value: '30', label: '30天' },
    { value: '90', label: '90天' }
  ]

  const levelOptions = [
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' }
  ]

  const handleShowModal = () => {
    showModal({
      title: 'API Key设置',
      size: 'sm',
      content: <div className='text-left text-lg text-card-foreground/60'>Api Key 设置成功</div>,
      showCancel: false,
      showConfirm: true,
      confirmText: '确定',
      cancelText: '取消', 
      onClose: () => {
        console.log('Modal closed')
      },
      onConfirm: () => {
        router.push('/Main')
        console.log('保存自定义内容')
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])

    const newErrors: string[] = []

    // 验证API key
    if (!formData.apiKey.trim()) {
      newErrors.push('API Key不能为空')
      
    } else if (!validateApiKey(formData.apiKey, formData.provider)) {
      if (formData.provider === 'openai') {
        newErrors.push('OpenAI API Key格式不正确（应以sk-开头）')
      } else {
        newErrors.push('Gemini API Key格式不正确')
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    // 计算过期时间（毫秒）
    const expiresInMs = parseInt(formData.expiresIn) * 24 * 60 * 60 * 1000

    // 保存API key
    const success = saveApiKey(formData.apiKey, formData.provider, expiresInMs)
    
    if (success) {
      onSuccess?.()
      handleShowModal()
    } else {
      setErrors(['保存失败，请重试'])
    }

    setIsSubmitting(false)
  }

  const getProviderInfo = () => {
    if (formData.provider === 'openai') {
      return {
        name: 'OpenAI',
        description: 'API Key格式：sk-xxxxxxxxxx（以sk-开头）',
        link: 'https://platform.openai.com/api-keys'
      }
    } else {
      return {
        name: 'Google Gemini',
        description: 'API Key格式：xxxxxxxxxxxxx（35-45位字符）',
        link: 'https://aistudio.google.com/app/apikey'
      }
    }
  }

  const providerInfo = getProviderInfo()

  return (
    <div className="space-y-6 ">
      <div className="space-y-2">
        <h2 className="text-primary text-2xl font-semibold">设置 API Key</h2>
        <p className="text-sm text-card-foreground/60">
          请输入您的 AI 服务提供商 API Key 以使用相关功能
        </p>
      </div>

      {/* 使用说明 */}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <ul className="space-y-1 list-disc list-inside text-sm">
            <li>API Key 仅存储在您的浏览器本地，不会上传到服务器</li>
            <li>数据经过加密存储，保护您的隐私安全</li>
            <li>您可以随时清除或更换 API Key</li>
            <li>API Key 会在设定时间后自动过期</li>
          </ul>
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* AI 提供商选择 */}
        <div className="space-y-2">
          <Label htmlFor="provider" className='text-lg text-card-foreground/60'>AI 提供商</Label>
          <Select
            value={formData.provider}
            onValueChange={(value: 'openai' | 'gemini') => 
              setFormData(prev => ({ ...prev, provider: value, apiKey: '' }))
            }
          >
            <SelectTrigger className='shadow-sm border-border'>
              <SelectValue placeholder="选择 AI 提供商" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
              <SelectItem value="gemini">Google Gemini</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {providerInfo.description} | 
            <a 
              href={providerInfo.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              获取 API Key
            </a>
          </p>
        </div>

        {/* API Key 输入 */}
        <div className="space-y-2">
          <Label htmlFor="apiKey" className='text-lg text-card-foreground/60'>API Key</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? 'text' : 'password'}
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder={`请输入 ${providerInfo.name} API Key`}
              className="pr-10 border-border shadow-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* 过期时间选择 */}
        <div className="space-y-2">
          <Label htmlFor="expiresIn" className='text-lg text-card-foreground/60'>有效期</Label>
          <Select
            value={formData.expiresIn}
            onValueChange={(value) => setFormData(prev => ({ ...prev, expiresIn: value }))}
          >
            <SelectTrigger className='shadow-sm border-border'>
              <SelectValue placeholder="选择有效期" />
            </SelectTrigger>
            <SelectContent>
              {expirationOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            API Key 将在指定时间后自动过期，您可以随时重新设置
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level" className='text-lg text-card-foreground/60'>英语等级</Label>
          <Select
            value={formData.level}
            onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
          >
            <SelectTrigger className='shadow-sm border-border'>
              <SelectValue placeholder="选择英语等级" />
            </SelectTrigger>
            <SelectContent>
              {levelOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level" className='text-lg text-card-foreground/60'>发音音色</Label>
          <Select
            value={formData.level}
            onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
          >
            <SelectTrigger className='shadow-sm border-border'>
              <SelectValue placeholder="选择音色" />  
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A1">A1</SelectItem>
              <SelectItem value="A2">A2</SelectItem>
              <SelectItem value="B1">B1</SelectItem>
              <SelectItem value="B2">B2</SelectItem>
            </SelectContent>
          </Select>
          
        </div>

        <div className="space-y-2">
        <Label htmlFor="speed" className='text-lg text-card-foreground/60'>发音倍速</Label>
        <Select
            value={formData.speed}
            onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
          >
            <SelectTrigger className='shadow-sm border-border'>
              <SelectValue placeholder="选择音色" />  
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A1">0.5</SelectItem> 
              <SelectItem value="A2">0.8</SelectItem>
              <SelectItem value="A3">1</SelectItem>
              <SelectItem value="A4">1.2</SelectItem>
              <SelectItem value="A5">1.5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 错误信息 */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* 按钮组 */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1  border-border hover:border-primary hover:scale-105 hover:transition-all duration-300"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary text-white border-border hover:border-primary hover:scale-105 hover:transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ApiKeyPage 