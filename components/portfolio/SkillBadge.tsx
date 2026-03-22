import { Skill } from '@/types'

export default function SkillBadge({ skill }: { skill: Skill }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary text-foreground border border-border">
      {skill.name}
    </span>
  )
}
