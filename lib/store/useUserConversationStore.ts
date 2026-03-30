import { create } from "zustand";
import type { ConversationMessage } from "@/lib/conversations/messages";

interface UserConversationPanelConfig {
  emptyLabel?: string;
  helperText?: string;
  statusMessage?: string | null;
  messages: ConversationMessage[];
  isSending: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

interface UserConversationStore {
  isOpen: boolean;
  emptyLabel: string;
  helperText: string;
  statusMessage: string | null;
  messages: ConversationMessage[];
  isSending: boolean;
  onSendMessage: ((message: string) => Promise<void>) | null;
  openPanel: (config: UserConversationPanelConfig) => void;
  closePanel: () => void;
  resetPanel: () => void;
}

const initialState = {
  isOpen: false,
  emptyLabel: "Continue the conversation with Spacey",
  helperText: "Replies stay in this chat thread.",
  statusMessage: null,
  messages: [] as ConversationMessage[],
  isSending: false,
  onSendMessage: null as ((message: string) => Promise<void>) | null,
};

export const useUserConversationStore = create<UserConversationStore>((set) => ({
  ...initialState,

  openPanel: (config) =>
    set({
      isOpen: true,
      emptyLabel: config.emptyLabel ?? initialState.emptyLabel,
      helperText: config.helperText ?? initialState.helperText,
      statusMessage: config.statusMessage ?? null,
      messages: config.messages,
      isSending: config.isSending,
      onSendMessage: config.onSendMessage,
    }),

  closePanel: () =>
    set((current) => ({
      ...current,
      isOpen: false,
    })),

  resetPanel: () => set(initialState),
}));
