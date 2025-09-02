'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Edit3, Save, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface MemoryItem {
  id: string;
  content: string;
  user_id: string;
  session_id?: string;
  metadata: {
    timestamp: string;
    type: 'conversation' | 'fact' | 'preference';
    relevance_score?: number;
    source?: string;
  };
}

interface MemoryManagerProps {
  userId: string;
  sessionId?: string;
}

export default function MemoryManager({ userId, sessionId }: MemoryManagerProps) {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<MemoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMemory, setEditingMemory] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // 获取记忆列表
  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ userId });
      if (sessionId) params.append('sessionId', sessionId);

      const response = await fetch(`/api/memory?${params}`);
      console.log("response", response)
      // if (response.ok) {
      //   const data = await response.json();
      //   setMemories(data.memories || []);
      //   setFilteredMemories(data.memories || []);
      // }
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 搜索记忆
  const searchMemories = async (query: string) => {
    if (!query.trim()) {
      setFilteredMemories(memories);
      return;
    }

    try {
      const params = new URLSearchParams({ 
        userId,
        query: query.trim()
      });
      if (sessionId) params.append('sessionId', sessionId);

      const response = await fetch(`/api/memory?${params}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredMemories(data.memories || []);
      }
    } catch (error) {
      console.error('Error searching memories:', error);
      // 如果搜索失败，使用本地过滤
      const filtered = memories.filter(memory =>
        memory.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMemories(filtered);
    }
  };

  // 删除记忆
  const deleteMemory = async (memoryId: string) => {
    try {
      const response = await fetch(`/api/memory?memoryId=${memoryId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMemories(memories.filter(m => m.id !== memoryId));
        setFilteredMemories(filteredMemories.filter(m => m.id !== memoryId));
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  // 更新记忆
  const updateMemory = async (memoryId: string, content: string) => {
    try {
      const response = await fetch('/api/memory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memoryId,
          content,
        }),
      });

      if (response.ok) {
        const { memory } = await response.json();
        const updatedMemories = memories.map(m => 
          m.id === memoryId ? memory : m
        );
        setMemories(updatedMemories);
        setFilteredMemories(updatedMemories);
        setEditingMemory(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  };

  // 清空所有记忆
  const clearAllMemories = async () => {
    try {
      const response = await fetch(`/api/memory?userId=${userId}&clearAll=true`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMemories([]);
        setFilteredMemories([]);
      }
    } catch (error) {
      console.error('Error clearing memories:', error);
    }
  };

  // 搜索处理
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMemories(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    fetchMemories();
  }, [userId, sessionId]);

  // 获取类型样式
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conversation':
        return 'bg-blue-100 text-blue-800';
      case 'fact':
        return 'bg-green-100 text-green-800';
      case 'preference':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>记忆管理 ({filteredMemories.length})</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearAllMemories}
            disabled={memories.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            清空全部
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 搜索栏 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索记忆内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={fetchMemories}
            disabled={isLoading}
          >
            刷新
          </Button>
        </div>

        {/* 记忆列表 */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground mt-2">加载中...</p>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery ? '未找到匹配的记忆' : '暂无记忆记录'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(memory.metadata.type)}>
                      {memory.metadata.type}
                    </Badge>
                    {memory.metadata.source && (
                      <Badge variant="outline" className="text-xs">
                        {memory.metadata.source}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingMemory(memory.id);
                        setEditContent(memory.content);
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMemory(memory.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {editingMemory === memory.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateMemory(memory.id, editContent)}
                        disabled={!editContent.trim()}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        保存
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingMemory(null);
                          setEditContent('');
                        }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm mb-2">{memory.content}</p>
                )}

                <div className="text-xs text-muted-foreground">
                  {new Date(memory.metadata.timestamp).toLocaleString()}
                  {memory.metadata.relevance_score && (
                    <span className="ml-2">
                      相关度: {(memory.metadata.relevance_score * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 