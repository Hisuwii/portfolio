'use client'

export default function ChatCTA() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('open-chat'))}
      className="glass rounded-2xl p-6 flex flex-col gap-3 text-left group transition-all hover:border-foreground/20 cursor-pointer w-full border border-border"
    >
      <div className="w-12 h-12 rounded-xl bg-foreground/8 flex items-center justify-center group-hover:scale-110 transition-transform">
        <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>

      <div>
        <p className="font-medium">Chat with me</p>
        <p className="text-sm text-muted-foreground mt-0.5">I reply personally via chat</p>
      </div>

      <p className="text-sm mt-auto text-muted-foreground flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
        Available for work
      </p>
    </button>
  )
}
