"use client";

import { Bot, Send } from "lucide-react";
import { useMemo, useState } from "react";
import type { ConversationMessage } from "@/lib/conversations/messages";

interface SpaceyConversationPanelProps {
  messages: ConversationMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
  className?: string;
  emptyLabel?: string;
  helperText?: string;
}

export default function SpaceyConversationPanel({
  messages,
  onSendMessage,
  isSending,
  className,
  emptyLabel = "Continue the conversation with Spacey",
  helperText = "Replies stay in this chat thread.",
}: SpaceyConversationPanelProps) {
  const [draft, setDraft] = useState("");

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (left, right) =>
          new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
      ),
    [messages]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();

    if (!trimmed || isSending) {
      return;
    }

    setDraft("");
    try {
      await onSendMessage(trimmed);
    } catch {
      setDraft(trimmed);
    }
  };

  return (
    <div className={className}>
      <div className="flex min-h-[320px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-950 px-4 py-4 text-white sm:px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Spacey</p>
            <p className="text-xs text-slate-300">{emptyLabel}</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-100 px-4 py-4 sm:px-5">
          {sortedMessages.map((message) => {
            const isAssistant = message.role === "assistant";

            return (
              <div
                key={message.id}
                className={isAssistant ? "max-w-[88%]" : "ml-auto max-w-[88%]"}
              >
                <div
                  className={`rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm whitespace-pre-wrap ${
                    isAssistant
                      ? "rounded-bl-md bg-white text-slate-800"
                      : "rounded-br-md bg-blue-600 text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
          <div className="flex items-end gap-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={2}
              placeholder="Type your message..."
              className="min-h-[52px] flex-1 resize-none rounded-[24px] border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D8E2FF]"
            />
            <button
              type="submit"
              disabled={isSending || draft.trim().length === 0}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              <Send className="h-4 w-4" />
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">{helperText}</p>
        </form>
      </div>
    </div>
  );
}
