import Navbar from '@/components/portfolio/Navbar'
import Footer from '@/components/portfolio/Footer'
import ChatWidget from '@/components/chat/ChatWidget'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </>
  )
}
