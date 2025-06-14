'use client'
import { useState } from 'react'
import { useApiKey } from '@/Study/hooks/useApiKey'
import ChatComp from '@/AI/components/chat'

interface ChatProps {
    params: {
        type: string
    }
}

export default function Chat({ params }: ChatProps) {
    const { apiKeyData, isLoading } = useApiKey()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!apiKeyData) {
        return <div>Please set your API key first</div>
    }

    return (
        <div className="container mx-auto p-6 h-[calc(100vh-4rem)]">
            <h1 className="text-2xl font-bold mb-6">Chat - {params.type}</h1>
            <ChatComp className="h-[calc(100%-4rem)]" />
        </div>
    )
}



