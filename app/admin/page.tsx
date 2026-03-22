import AdminChatPanel from '@/components/admin/AdminChatPanel'
import PresenceHeartbeat from '@/components/admin/PresenceHeartbeat'

export default function AdminPage() {
  return (
    <>
      <PresenceHeartbeat />
      <AdminChatPanel />
    </>
  )
}
