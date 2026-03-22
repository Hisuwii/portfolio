import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are an AI assistant on Ivan Jade Quilang's portfolio. Reply directly and specifically to what was asked. Keep it short — 1 to 2 sentences max.

About Ivan:
- Full Stack Developer — React, Next.js, TypeScript, Node.js, PHP, Laravel, Tailwind CSS, Supabase, MySQL
- Based in the Philippines
- Open to freelance, collabs, full-time roles
- Email: quilangivanjade3@gmail.com

Rules:
- Answer the specific question asked. Do NOT give the same generic reply every time.
- Greeting → greet back casually, ask how you can help
- Who is Ivan → say he's a full stack dev who builds modern web apps, briefly name his stack
- Skills → list his actual skills relevant to the question
- Project → ask what kind of project with genuine curiosity
- Pricing → say Ivan handles that personally and will follow up
- Availability → yes, he's open and will reach out
- NEVER say "Ivan's away right now" — just answer naturally
- NEVER mention you are "covering" for anyone
- Sound like Ivan himself, not an assistant`

export async function getAIReply(messageHistory: { role: string; content: string }[]): Promise<string> {
  // Only use the last visitor message to keep it clean
  const lastVisitor = [...messageHistory].reverse().find((m) => m.role === 'visitor')
  if (!lastVisitor) return ''

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: lastVisitor.content },
  ]

  const models = [
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile',
    'gemma2-9b-it',
  ]

  for (const model of models) {
    try {
      const response = await groq.chat.completions.create({
        model,
        messages,
        max_tokens: 150,
        temperature: 0.7,
      })
      const reply = response.choices[0]?.message?.content?.trim()
      if (reply) {
        console.log(`[groq] ✅ Replied using ${model}`)
        return reply
      }
    } catch (err: any) {
      console.warn(`[groq] ⚠️ ${model} failed:`, err?.message ?? err)
    }
  }

  return ''
}
