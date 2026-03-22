import Image from 'next/image'
import { Message } from '@/types'

export default function MessageBubble({ message }: { message: Message }) {
  if (!message.content?.trim()) return null
  const isVisitor = message.role === 'visitor'
  const isAI = message.role === 'ai'

  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  if (isVisitor) {
    return (
      <div className="flex flex-col items-end gap-1 px-4 py-1">
        <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm text-white leading-relaxed bg-foreground">
          {message.content}
        </div>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1 px-4 py-1">
      <div className="flex items-end gap-2">
        <div className="w-7 h-7 rounded-full overflow-hidden border border-border shrink-0">
          <Image src="/images/pfp.png" alt="Ivan" width={28} height={28} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed border border-border bg-secondary">
          {message.content}
        </div>
      </div>
      <span className="text-xs text-muted-foreground ml-9">{time}</span>
    </div>
  )
}
