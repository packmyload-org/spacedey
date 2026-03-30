"use client";

import React, { useEffect, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/useAuthStore";
import SpaceyConversationPanel from "@/components/chat/SpaceyConversationPanel";
import type { ConversationMessage } from "@/lib/conversations/messages";
import { EMAIL_INPUT_PROPS, normalizeEmail } from "@/lib/utils/email";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SupportFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

const TOPIC_OPTIONS = [
  "Booking help",
  "Billing question",
  "Storage access",
  "Move-in support",
  "Technical issue",
  "General support",
];

function buildInitialForm(): SupportFormData {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    topic: "General support",
    message: "",
  };
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<SupportFormData>(buildInitialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setIsSubmitting(false);
    setIsSendingReply(false);
    setFormData((current) => ({
      ...current,
      firstName: user?.firstName || current.firstName,
      lastName: user?.lastName || current.lastName,
      email: user?.email ? normalizeEmail(user.email) : current.email,
      phone: user?.phone || current.phone,
    }));
  }, [isOpen, user?.email, user?.firstName, user?.lastName, user?.phone]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    setConversationId(null);
    setMessages([]);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === "email" ? normalizeEmail(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/support/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Unable to start a support conversation right now.");
      }

      setConversationId(data?.conversation?.conversationId || null);
      setMessages(Array.isArray(data?.conversation?.messages) ? data.conversation.messages : []);

      toast.success("Spacey started your support conversation.", {
        description: "You can keep chatting here with follow-up details.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (message: string) => {
    if (!conversationId) {
      return;
    }

    setIsSendingReply(true);

    try {
      const response = await fetch(`/api/support/conversation/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Unable to send your message right now.");
      }

      setMessages(Array.isArray(data?.conversation?.messages) ? data.conversation.messages : []);
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(nextMessage);
      throw error;
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-6 left-4 z-[60] w-[min(calc(100vw-2rem),24rem)] sm:left-6 sm:w-[24rem]">
      <div className="pointer-events-auto flex max-h-[min(78vh,44rem)] flex-col overflow-hidden rounded-[30px] border border-[#D6E2FF] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
        <div className="border-b border-[#D6E2FF] bg-[linear-gradient(135deg,#0F1A48_0%,#1642F0_60%,#2E7BFF_100%)] px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/16 text-white ring-1 ring-white/25 backdrop-blur">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-white">Spacey</p>
                <p className="truncate text-sm text-blue-100">
                  {conversationId ? "Support thread is live" : "Quick support chat"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-blue-100 transition hover:bg-white/10 hover:text-white"
              aria-label="Close support chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!conversationId ? (
            <div className="mt-4 rounded-[22px] border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium leading-6 text-white">
                  Tell me what you need help with.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {conversationId ? (
          <SpaceyConversationPanel
            messages={messages}
            onSendMessage={handleSendReply}
            isSending={isSendingReply}
            className="flex-1"
          />
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-[#F7F9FF] px-4 py-4 sm:px-5">
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#6881BB]">
                    First name
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-[#D6E2FF] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D9E5FF]"
                    placeholder="First name"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#6881BB]">
                    Last name
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#D6E2FF] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D9E5FF]"
                    placeholder="Last name"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#6881BB]">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-[#D6E2FF] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D9E5FF]"
                    placeholder="Email address"
                    {...EMAIL_INPUT_PROPS}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#6881BB]">
                    Phone
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#D6E2FF] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D9E5FF]"
                    placeholder="Phone number"
                  />
                </label>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#6881BB]">
                  Topic
                </span>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#D6E2FF] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D9E5FF]"
                >
                  {TOPIC_OPTIONS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#6881BB]">
                  Message
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full resize-none rounded-[24px] border border-[#D6E2FF] bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none transition focus:border-[#1642F0] focus:ring-2 focus:ring-[#D9E5FF]"
                  placeholder="What do you need help with?"
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1642F0] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(22,66,240,0.22)] transition hover:bg-[#1138D8] disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
