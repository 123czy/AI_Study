'use client'

import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/Study/components/ScenesCard"
import DynamicIcon, { IconName } from "../../components/IconMap"
import mock from "../mock.json"
import { useGlobalModal, globalModal } from '../../components/GlobalModal'
import { useRouter } from 'next/navigation'
import { useApiKey } from '../../hooks/useApiKey'
import ApiKeyPage from '../../components/ApiKeyPage'
import { useEffect } from 'react'

interface Scene {
    id: number
    title: string
    description: string
    link: string
    icon: IconName
}

const ScenesPage = () => {
    const router = useRouter()
    const scenes = mock.scenes as Scene[]
    const { showModal, hideModal } = useGlobalModal()
    const { hasValidApiKey, isLoading, apiKeyData, getRemainingTimeFormatted } = useApiKey()


    const handleSceneClick = (link: string, title: string) => {
        if (!hasValidApiKey) {
            showModal({
                title: '需要设置 API Key',
                description: `使用 "${title}" 功能需要先设置 AI 服务提供商的 API Key`,
                content: (
                    <div className="p-4 bg-muted rounded-md">
                        <h3 className="font-medium mb-2">为什么需要 API Key？</h3>
                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                            <li>AI 对话功能需要调用第三方服务</li>
                            <li>API Key 确保服务的稳定性和质量</li>
                            <li>您的数据安全存储在本地浏览器中</li>
                            <li>支持 OpenAI 和 Google Gemini 两种服务</li>
                        </ul>
                    </div>
                ),
                showCancel: true,
                showConfirm: true,
                confirmText: '设置 API Key',
                cancelText: '稍后再说',
                onConfirm: () => {
                    hideModal()
                    router.push('/Main/Setting')
                }
            })
        } else {
            // 有效的 API Key，直接跳转
            router.push('/Main/Scenes' + link)
        }
    }

    // 页面加载时检查 API Key 状态
    useEffect(() => {
        if (!isLoading && !hasValidApiKey) {
            // 可以选择在页面加载时就显示设置提示
        }
    }, [isLoading, hasValidApiKey])

    if (isLoading) {
        return (
            <div className="container mx-auto py-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">正在加载...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 xl:px-8 lg:px-6 md:px-4 space-y-6">
            {/* API Key 状态显示 */}
            {hasValidApiKey && apiKeyData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-green-800">
                                已配置 {apiKeyData.provider === 'openai' ? 'OpenAI' : 'Google Gemini'} API Key
                            </h3>
                            <p className="text-xs text-green-600">
                                剩余有效期：{getRemainingTimeFormatted()}
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/Main/Setting')}
                            className="text-xs text-green-700 hover:text-green-900 underline"
                        >
                            重新设置
                        </button>
                    </div>
                </div>
            )}

            {!hasValidApiKey && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-yellow-800">
                                尚未配置 API Key
                            </h3>
                            <p className="text-xs text-yellow-600">
                                设置 API Key 后即可使用所有 AI 功能
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/Main/Setting')}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                        >
                            立即设置
                        </button>
                    </div>
                </div>
            )}

            {/* 场景卡片网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {scenes.map((scene) => {
                    return (
                        <Card 
                            key={scene.id} 
                            variant="outline" 
                            size="sm" 
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleSceneClick(scene.link, scene.title)}
                        >
                            <CardHeader>
                                <DynamicIcon name={scene.icon} className="w-8 h-8 text-primary mb-4" />
                                <div className="flex items-center gap-2">
                                    <CardTitle>{scene.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{scene.description}</CardDescription>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default ScenesPage