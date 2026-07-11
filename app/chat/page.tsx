import { Suspense } from "react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-mist-500">Loading chat…</div>}>
      <ChatInterface />
    </Suspense>
  );
}
