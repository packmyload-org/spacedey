"use client";

import { Bot, X } from "lucide-react";
import SpaceyConversationPanel from "@/components/chat/SpaceyConversationPanel";
import { useUserConversationStore } from "@/lib/store/useUserConversationStore";

export default function UserConversationDock() {
  const {
    isOpen,
    emptyLabel,
    helperText,
    statusMessage,
    messages,
    isSending,
    onSendMessage,
    closePanel,
  } = useUserConversationStore();

  if (!isOpen || !onSendMessage) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-[65] w-[min(calc(100vw-2rem),24rem)] sm:right-6 sm:w-[24rem]">
      <div className="pointer-events-auto space-y-3">
        {statusMessage ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800 shadow-sm">
            {statusMessage}
          </div>
        ) : null}

        <div className="flex items-center gap-3 rounded-[24px] bg-slate-950 px-4 py-4 text-white shadow-sm sm:px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Spacey</p>
            <p className="truncate text-xs text-slate-300">{emptyLabel}</p>
          </div>
          <button
            type="button"
            onClick={closePanel}
            className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close chat panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {helperText ? (
          <p className="px-1 text-[11px] font-medium text-slate-500">{helperText}</p>
        ) : null}

        <SpaceyConversationPanel
          messages={messages}
          onSendMessage={onSendMessage}
          isSending={isSending}
        />
      </div>
    </div>
  );
}
