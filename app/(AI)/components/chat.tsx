'use client'

import { useState } from 'react'

interface ChatCompProps {
    className?: string
}

export default function ChatComp({ className = '' }: ChatCompProps) {
    const [messages, setMessages] = useState<string[]>([])
    const [input, setInput] = useState('')

    const handleSend = () => {
        if (!input.trim()) return
        setMessages([...messages, input])
        setInput('')
    }

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className="flex-1 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className="mb-4 p-3 bg-white rounded-lg shadow">
                        <div className="text-sm">{message}</div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Send
                </button>
            </div>
        </div>
    )
} 