"use client";

import React, { useEffect, useState } from "react";
import { Bot, Send, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-4 text-white sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Spacey</p>
              <p className="truncate text-xs text-slate-300">
                {conversationId ? "In-app support thread" : "Start a support chat"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close support chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {conversationId ? (
          <SpaceyConversationPanel
            messages={messages}
            onSendMessage={handleSendReply}
            isSending={isSendingReply}
            className="flex-1"
            emptyLabel="In-app support thread"
            helperText="Reply here with any extra detail, screenshots, booking email, location, or invoice number."
          />
        ) : (
        <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
          <div className="mb-4 space-y-3 bg-slate-100 px-0 py-0">
            <div className="max-w-[85%] rounded-3xl rounded-bl-md bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm">
              Hi, I&apos;m Spacey. Tell me what&apos;s going on and I&apos;ll open a support thread right here in the app.
            </div>

            <div className="max-w-[85%] rounded-3xl rounded-bl-md bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm">
              Once you send the first message, the form will turn into a live chat so you can keep adding details without leaving this page.
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="First name"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Last name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Email address"
              {...EMAIL_INPUT_PROPS}
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Phone number"
            />
          </div>

          <div className="mt-3 grid gap-3">
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {TOPIC_OPTIONS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full resize-none rounded-[24px] border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Type your message..."
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Spacey will keep this support thread active in-app.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
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
