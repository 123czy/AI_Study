'use client'

import { useChat } from '@ai-sdk/react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mic, SendIcon } from 'lucide-react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error);
    },
    initialMessages:[
        {
            id:"1",
            role:"assistant",
            content:"你好,我是今天的面试官,请开始你的自我介绍"
        }
    ]
  });

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
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




  return (
    <div className="flex flex-col w-full h-[calc(100vh-500px)] mx-auto stretch bg-card rounded-lg border p-6">

       {messages.map(m => (
          <div key={m.id} className={`whitespace-pre-wrap mb-4 ${m.role === 'user' ? 'flex flex-row-reverse' : 'flex flex-start'}`}>
           {m.role === 'user' ? <div className='w-10 h-10 flex items-center justify-center text-white bg-primary rounded-full ml-2'>You</div> : <div className='w-10 h-10 flex items-center justify-center text-muted-foreground bg-secondary rounded-full mr-2'>AI</div>}
           <div className={`whitespace-pre-wrap ${m.role === 'user' ? 'max-w-[80%] bg-primary text-white p-2 rounded-lg' : 'max-w-[80%] bg-secondary p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl mr-2'}`}>{m.content}</div>
          </div>
       ))}

       {isLoading && (
         <div className="whitespace-pre-wrap mb-4">
           <strong>AI: </strong>
           <span className="animate-pulse">思考中...</span>
         </div>
       )}

      <form onSubmit={handleSubmit}>
        <Textarea
          className="fixed dark:bg-zinc-900 bottom-2 max-w-3xl h-[76px] p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="请输入你的回答"
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        >
        <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || isLoading}
        className="h-8 w-8"
      >
        <SendIcon className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
        </Textarea>
        <div className="fixed bottom-0 mb-1 flex items-center justify-center gap-4">
            <Button variant="secondary" size="icon" className="size-8" disabled={isLoading}>
               <Mic />
            </Button>
        </div>
      </form>
    </div>
  );
}