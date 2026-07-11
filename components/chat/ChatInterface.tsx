"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Trash2,
  Download,
  PanelLeftOpen,
  PanelLeftClose,
  Plus,
  Loader2,
} from "lucide-react";
import ChatMessageBubble from "./ChatMessage";
import SuggestedPrompts from "./SuggestedPrompts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  saveChatSession,
  getAllChatSessions,
  deleteChatSession,
} from "@/lib/indexeddb";
import { LOCAL_STORAGE_KEYS, DEFAULT_SETTINGS } from "@/lib/constants";
import { AppSettings, ChatSession } from "@/types";
import { uid, cn, timeAgo } from "@/lib/utils";
import { pushToast } from "@/hooks/useToast";

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const [settings] = useLocalStorage<AppSettings>(
    LOCAL_STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    append,
  } = useChat({
    api: "/api/chat",
    body: {
      model: settings.model,
      temperature: settings.temperature,
    },
    onError: () => {
      pushToast("The AI assistant hit an error. Please try again.", "error");
    },
  });

  // Load session history on mount
  useEffect(() => {
    getAllChatSessions().then((all) => {
      setSessions(all);
      const initialPrompt = searchParams.get("q");
      if (initialPrompt) {
        const newId = uid("chat");
        setActiveId(newId);
        append({ role: "user", content: initialPrompt });
      } else if (all.length > 0) {
        setActiveId(all[0].id);
        setMessages(all[0].messages as any);
      } else {
        setActiveId(uid("chat"));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Persist session whenever messages change (debounced-ish via effect)
  useEffect(() => {
    if (!activeId || messages.length === 0) return;
    const title = (messages[0]?.content || "New chat").slice(0, 48);
    const session: ChatSession = {
      id: activeId,
      title,
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
        createdAt: Date.now(),
      })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveChatSession(session).then(() => {
      getAllChatSessions().then(setSessions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, activeId]);

  function startNewChat() {
    setActiveId(uid("chat"));
    setMessages([]);
  }

  function loadSession(session: ChatSession) {
    setActiveId(session.id);
    setMessages(session.messages as any);
    setHistoryOpen(false);
  }

  async function removeSession(id: string) {
    await deleteChatSession(id);
    const all = await getAllChatSessions();
    setSessions(all);
    if (id === activeId) startNewChat();
  }

  function exportChat() {
    const content = messages
      .map((m) => `**${m.role === "user" ? "You" : "AI Assistant"}:**\n${m.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `football-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast("Chat exported", "success");
  }

  function clearChat() {
    setMessages([]);
    pushToast("Chat cleared", "info");
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      {/* History sidebar */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 z-20 w-72 shrink-0 border-r border-black/5 bg-white/90 backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-pitch-950/95 md:static md:translate-x-0",
          historyOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-mist-500">
            History
          </span>
          <button onClick={startNewChat} className="btn-secondary !px-2.5 !py-1 text-xs">
            <Plus size={13} /> New
          </button>
        </div>
        <div className="h-[calc(100%-56px)] overflow-y-auto px-2 pb-4">
          {sessions.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-mist-500">
              No conversations yet.
            </p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              className={cn(
                "group mb-1 flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs",
                s.id === activeId
                  ? "bg-floodlight-500/15 text-floodlight-500"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              )}
              onClick={() => loadSession(s)}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{s.title}</p>
                <p className="text-[10px] text-mist-500">{timeAgo(s.updatedAt)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSession(s.id);
                }}
                className="opacity-0 transition group-hover:opacity-100"
                aria-label="Delete conversation"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-2.5 dark:border-white/10">
          <button
            onClick={() => setHistoryOpen((o) => !o)}
            className="flex items-center gap-1.5 text-xs text-mist-500 hover:text-floodlight-500"
          >
            {historyOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            History
          </button>
          <div className="flex gap-2">
            <button
              onClick={exportChat}
              disabled={messages.length === 0}
              className="btn-secondary !px-3 !py-1.5 text-xs disabled:opacity-40"
            >
              <Download size={13} /> Export
            </button>
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="btn-secondary !px-3 !py-1.5 text-xs disabled:opacity-40"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 md:px-8">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <SuggestedPrompts onSelect={(p) => append({ role: "user", content: p })} />
            </div>
          ) : (
            <div className="mx-auto max-w-3xl">
              {messages.map((m) => (
                <ChatMessageBubble key={m.id} role={m.role === "user" ? "user" : "assistant"} content={m.content} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 px-1 py-2 text-xs text-mist-500">
                  <Loader2 size={13} className="animate-spin" />
                  AI Assistant is thinking...
                </div>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-black/5 p-3 dark:border-white/10 md:p-4"
        >
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about tactics, form, transfers..."
              rows={1}
              className="input-field max-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) handleSubmit(e as any);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-primary !rounded-full !px-4 !py-3 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
