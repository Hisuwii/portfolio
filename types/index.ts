export type MessageRole = 'visitor' | 'owner' | 'ai'

export interface Message {
  id: string
  session_id: string
  role: MessageRole
  content: string
  created_at: string
}

export interface OwnerPresence {
  id: number
  status: 'online' | 'away' | 'offline'
  last_seen: string
}

export interface Contact {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image?: string
  liveUrl?: string
  repoUrl?: string
  featured: boolean
  credentials?: { username: string; password: string }
}

export interface Skill {
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'other'
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}
