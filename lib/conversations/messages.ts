export type ConversationMessageRole = 'assistant' | 'user';

export interface ConversationMessage {
  id: string;
  role: ConversationMessageRole;
  content: string;
  createdAt: string;
}

export function createConversationMessage(
  role: ConversationMessageRole,
  content: string,
  createdAt = new Date()
): ConversationMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: createdAt.toISOString(),
  };
}
