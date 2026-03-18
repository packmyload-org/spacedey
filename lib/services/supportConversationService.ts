import { connectTypeORM } from '@/lib/db';
import { ensureInAppConversationSchema } from '@/lib/db/ensureInAppConversationSchema';
import SupportConversation from '@/lib/db/entities/SupportConversation';
import SupportMessage from '@/lib/db/entities/SupportMessage';
import {
  type ConversationMessage,
  toConversationMessage,
} from '@/lib/conversations/messages';

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
    {
      role: 'user' as const,
      content: context.message,
    },
    {
      role: 'assistant' as const,
      content: `Hi ${context.firstName}, I’ve opened your support ticket and shared it with the Spacedey team.\n\nHere’s what I captured:\nName: ${name || context.email}\nEmail: ${context.email}\nPhone: ${phoneLabel}\nTopic: ${topicLabel}`,
    },
    {
      role: 'assistant' as const,
      content:
        'You can keep replying here with any extra detail, screenshots, booking email, storage location, or invoice number. I’ll keep everything attached to this conversation.',
    },
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
  await ensureInAppConversationSchema(dataSource);
  const repo = dataSource.getRepository(SupportConversation);
  const messageRepo = dataSource.getRepository(SupportMessage);
  const now = new Date();
  const messages = buildSupportIntroMessages(context);
  const fullName = [context.firstName, context.lastName].filter(Boolean).join(' ').trim();

  const conversation = repo.create({
    threadId: crypto.randomUUID(),
    email: context.email,
    fullName: fullName || null,
    topic: context.topic || null,
    status: 'acknowledged',
    firstMessage: context.message,
    lastInboundMessage: context.message,
    lastInboundAt: now,
    lastOutboundAt: now,
    botReplyCount: 2,
  });

  await repo.save(conversation);
  const savedMessages = await messageRepo.save(
    messages.map((message) =>
      messageRepo.create({
        conversationId: conversation.id,
        role: message.role,
        content: message.content,
      })
    )
  );

  return {
    conversationId: conversation.threadId,
    messages: savedMessages.map((message) => toConversationMessage(message)),
    status: conversation.status,
  };
}

export async function appendSupportConversationMessage(args: {
  conversationId: string;
  message: string;
}): Promise<SupportConversationSnapshot> {
  const dataSource = await connectTypeORM();
  await ensureInAppConversationSchema(dataSource);
  const repo = dataSource.getRepository(SupportConversation);
  const messageRepo = dataSource.getRepository(SupportMessage);
  const conversation = await repo.findOne({ where: { threadId: args.conversationId } });

  if (!conversation) {
    throw new Error('Support conversation not found.');
  }

  const now = new Date();
  await messageRepo.save([
    messageRepo.create({
      conversationId: conversation.id,
      role: 'user',
      content: args.message,
    }),
    messageRepo.create({
      conversationId: conversation.id,
      role: 'assistant',
      content: buildSupportReply(conversation, args.message),
    }),
  ]);
  conversation.lastInboundMessage = args.message;
  conversation.lastInboundAt = now;
  conversation.lastOutboundAt = now;
  conversation.botReplyCount += 1;
  conversation.status = conversation.botReplyCount > 2 ? 'triaging' : 'acknowledged';

  await repo.save(conversation);
  const allMessages = await messageRepo.find({
    where: { conversationId: conversation.id },
    order: { createdAt: 'ASC' },
  });

  return {
    conversationId: conversation.threadId,
    messages: allMessages.map((message) => toConversationMessage(message)),
    status: conversation.status,
  };
}
