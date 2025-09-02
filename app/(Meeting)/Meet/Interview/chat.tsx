'use client'

import { useChat } from '@ai-sdk/react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mic, SendIcon, Brain, History } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';

export default function Chat() {
  const [sessionId, setSessionId] = useState<string>('');
  const [useMemory, setUseMemory] = useState(true);
  const [memories, setMemories] = useState<any[]>([]);
  const [showMemories, setShowMemories] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentInterviewId ,triggerStartTimer,triggerPauseTimer} = useInterview();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      userId: currentInterviewId || undefined,
      sessionId: sessionId || undefined,
      useMemory,
    },
    onError: (error) => {
      setTimeout(() => {
        triggerPauseTimer();
      }, 100);
      console.error('Chat error:', error);
    },
    onFinish: (message, options) => {
      // 开始面试计时
     // 延迟一小段时间确保UI更新完成
    setTimeout(() => {
       triggerStartTimer();
    }, 100);
      console.log('onFinish', message, options)
    },
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "你好,我是今天的面试官,请开始你的自我介绍"
      }
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 在客户端初始化会话ID
    setSessionId(`session_${Date.now()}`);
  }, []);

  // 当消息更新时自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 获取用户记忆
  const fetchMemories = async () => {
    if (!currentInterviewId) return;
    try {
      const response = await fetch(`/api/memory?userId=${currentInterviewId}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setMemories(data.memories.results || []);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };

  // 清空记忆
  const clearMemories = async () => {
    if (!currentInterviewId) return;
    try {
      const response = await fetch(`/api/memory?userId=${currentInterviewId}&clearAll=true`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMemories([]);
        console.log('Memories cleared');
      }
    } catch (error) {
      console.error('Error clearing memories:', error);
    }
  };

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        const form = e.currentTarget.form;
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    }
  };

  // 如果会话ID还未初始化，显示加载状态
  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 如果没有面试ID，显示提示信息
  if (!currentInterviewId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">未找到面试信息</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-200px)] mx-auto bg-card rounded-lg border">
      {/* 记忆功能控制栏 */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          <span className="text-sm font-medium">智能记忆</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseMemory(!useMemory)}
            className={useMemory ? "bg-primary text-primary-foreground" : ""}
          >
            {useMemory ? "已启用" : "已禁用"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowMemories(!showMemories);
              if (!showMemories) fetchMemories();
            }}
          >
            <History className="h-4 w-4 mr-1" />
            记忆历史
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearMemories}
            className="text-destructive hover:text-destructive"
          >
            清空记忆
          </Button>
        </div>
      </div>

      {/* 记忆历史面板 */}
      {showMemories && (
        <div className="p-4 bg-muted/50 border-b">
          <h4 className="text-sm font-medium mb-2">历史记忆 ({memories.length})</h4>
          {memories.length === 0 ? (
            <div className="text-sm text-muted-foreground">暂无记忆记录</div>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {memories.slice(0, 10).map((memory, index) => (
                <div key={index} className="text-sm p-2 bg-background rounded border">
                  <div className="font-medium text-xs text-muted-foreground mb-1">
                    {new Date(memory.metadata?.timestamp).toLocaleString()}
                  </div>
                  <div>{memory.memory}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 mb-4">
        <div className="space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
              {m.role === 'user' ? 
                <div className='w-8 h-8 flex items-center justify-center text-white bg-primary rounded-full'>You</div> 
                : 
                <div className='w-8 h-8 flex items-center justify-center text-muted-foreground bg-secondary rounded-full'>AI</div>
              }
              <div className={`max-w-[80%] p-3 rounded-lg ${
                m.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted border'
              }`}>
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2">
              <div className='w-8 h-8 flex items-center justify-center text-muted-foreground bg-secondary rounded-full'>AI</div>
              <div className="bg-muted border rounded-lg p-3">
                <span className="animate-pulse">思考中...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-full">
          <Textarea
            className="w-full dark:bg-zinc-900 min-h-[76px] p-4 pr-24 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-xl resize-none"
            value={input}
            placeholder="请输入你的回答"
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="h-8 w-8"
              disabled={isLoading}
            >
              <Mic className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-8 w-8"
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">发送消息</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}