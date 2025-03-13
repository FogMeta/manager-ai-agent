import { ChatWindow } from '@/components/ChatWindow'
import Image from 'next/image'

export default function Home() {
  const InfoCard = (
    <div className="p-4 md:p-6 rounded text-center w-full max-h-[85%] overflow-hidden">
      <h1 className="text-1xl md:text-2xl mb-4 flex items-center justify-center">
        <Image src="/logo-small.png" alt="Logo" width={32} height={32} />
        <span className="ml-4">Manager AI Agent</span>
      </h1>
      <h1 className="text-subtitle mb-4 flex items-center justify-center">
        How can I help you today?
      </h1>
    </div>
  )
  return (
    // emoji="🤖"
    <ChatWindow
      endpoint="api/hello"
      titleText="Manager AI Agent"
      placeholder="I'm your friendly Aptos agent! Ask me anything..."
      emptyStateComponent={InfoCard}
    ></ChatWindow>
  )
}
