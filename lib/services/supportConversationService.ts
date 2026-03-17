import { connectTypeORM } from '@/lib/db';
import SupportConversation from '@/lib/db/entities/SupportConversation';
import { createConversationMessage, type ConversationMessage } from '@/lib/conversations/messages';

export type SupportConversationContext = {
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  topic?: string | null;
  message: string;
};

export type SupportConversationSnapshot = {
  conversationId: string;
  messages: ConversationMessage[];
  status: string;
};

function buildSupportIntroMessages(context: SupportConversationContext) {
  const name = [context.firstName, context.lastName].filter(Boolean).join(' ').trim();
  const topicLabel = context.topic || 'General support';
  const phoneLabel = context.phone || 'Not provided';

  return [
    createConversationMessage('user', context.message),
    createConversationMessage(
      'assistant',
      `Hi ${context.firstName}, I’ve opened your support ticket and shared it with the Spacedey team.\n\nHere’s what I captured:\nName: ${name || context.email}\nEmail: ${context.email}\nPhone: ${phoneLabel}\nTopic: ${topicLabel}`
    ),
    createConversationMessage(
      'assistant',
      'You can keep replying here with any extra detail, screenshots, booking email, storage location, or invoice number. I’ll keep everything attached to this conversation.'
    ),
  ];
}

function buildSupportReply(
  conversation: SupportConversation,
  message: string
) {
  const normalizedMessage = message.toLowerCase();
  const mentionsBooking =
    normalizedMessage.includes('booking') ||
    normalizedMessage.includes('invoice') ||
    normalizedMessage.includes('payment');
  const mentionsAccess =
    normalizedMessage.includes('access') ||
    normalizedMessage.includes('gate') ||
    normalizedMessage.includes('lock');

  if (mentionsBooking) {
    return 'Got it. I’ve tagged this as an account and billing-related update. If you have the booking email, invoice number, or payment date, send that here too and I’ll keep the thread tidy for the team.';
  }

  if (mentionsAccess) {
    return 'Thanks. I’ve marked this as an access-related issue. If there is a specific site, unit number, or time you noticed the problem, add it here and I’ll attach it to the ticket.';
  }

  if (conversation.botReplyCount <= 1) {
    return 'Thanks, I’ve added that to your support ticket. If you have screenshots, booking email, storage location, or invoice details, drop them here and I’ll keep them with the conversation.';
  }

  return 'Understood. I’ve added your latest note and kept the ticket active for the Spacedey team.';
}

export async function startSupportConversation(
  context: SupportConversationContext
): Promise<SupportConversationSnapshot> {
  const dataSource = await connectTypeORM();
  const repo = dataSource.getRepository(SupportConversation);
  const now = new Date();
  const messages = buildSupportIntroMessages(context);
  const fullName = [context.firstName, context.lastName].filter(Boolean).join(' ').trim();

  const conversation = repo.create({
    threadId: crypto.randomUUID(),
    email: context.email,
    fullName: fullName || null,
    phone: context.phone || null,
    topic: context.topic || null,
    status: 'acknowledged',
    firstMessage: context.message,
    lastInboundMessage: context.message,
    lastInboundAt: now,
    lastOutboundAt: now,
    botReplyCount: 2,
    messages,
  });

  await repo.save(conversation);

  return {
    conversationId: conversation.threadId,
    messages: conversation.messages,
    status: conversation.status,
  };
}

export async function appendSupportConversationMessage(args: {
  conversationId: string;
  message: string;
}): Promise<SupportConversationSnapshot> {
  const dataSource = await connectTypeORM();
  const repo = dataSource.getRepository(SupportConversation);
  const conversation = await repo.findOne({ where: { threadId: args.conversationId } });

  if (!conversation) {
    throw new Error('Support conversation not found.');
  }

  const now = new Date();
  const userMessage = createConversationMessage('user', args.message, now);
  const assistantMessage = createConversationMessage(
    'assistant',
    buildSupportReply(conversation, args.message),
    now
  );

  conversation.messages = [...conversation.messages, userMessage, assistantMessage];
  conversation.lastInboundMessage = args.message;
  conversation.lastInboundAt = now;
  conversation.lastOutboundAt = now;
  conversation.botReplyCount += 1;
  conversation.status = conversation.botReplyCount > 2 ? 'triaging' : 'acknowledged';

  await repo.save(conversation);

  return {
    conversationId: conversation.threadId,
    messages: conversation.messages,
    status: conversation.status,
  };
}
