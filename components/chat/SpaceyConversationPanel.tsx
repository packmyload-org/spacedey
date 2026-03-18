"use client";

import { Bot, Send } from "lucide-react";
import { useMemo, useState } from "react";
import type { ConversationMessage } from "@/lib/conversations/messages";

interface SpaceyConversationPanelProps {
  messages: ConversationMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
  className?: string;
  showHeader?: boolean;
  title?: string;
  emptyLabel?: string;
  helperText?: string;
}

export default function SpaceyConversationPanel({
  messages,
  onSendMessage,
  isSending,
  className,
  showHeader = true,
  title = "Spacey",
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
        {showHeader ? (
          <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-950 px-4 py-4 text-white sm:px-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-slate-300">{emptyLabel}</p>
            </div>
          </div>
        ) : null}

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
          <div className="rounded-[26px] border border-[#D6E2FF] bg-[#F7F9FF] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              placeholder="Reply to Spacey..."
              className="min-h-[84px] w-full resize-none bg-transparent px-1 py-1 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
            />
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#DFE8FF] pt-3">
              <p className="text-[11px] font-medium text-slate-500">{helperText}</p>
              <button
                type="submit"
                disabled={isSending || draft.trim().length === 0}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1642F0] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(22,66,240,0.25)] transition hover:bg-[#1138D8] disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none"
              >
                <Send className="h-4 w-4" />
                {isSending ? "Sending" : "Send"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
