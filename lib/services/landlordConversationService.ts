import { connectTypeORM } from '@/lib/db';
import { ensureInAppConversationSchema } from '@/lib/db/ensureInAppConversationSchema';
import LandlordInquiry from '@/lib/db/entities/LandlordInquiry';
import LandlordMessage from '@/lib/db/entities/LandlordMessage';
import { type ConversationMessage, toConversationMessage } from '@/lib/conversations/messages';

export type LandlordConversationSnapshot = {
  conversationId: string;
  messages: ConversationMessage[];
  status: string;
};

function buildLandlordIntroMessages(inquiry: LandlordInquiry) {
  const locationLabel = [inquiry.streetAddress, inquiry.region].filter(Boolean).join(', ');
  const sizeLabel = inquiry.squareFootage || 'the available square footage';
  const detailsLine = inquiry.details
    ? `I’ve also noted: ${inquiry.details}`
    : 'If there is anything important about access, ceiling height, power, or security, send it here.';

  return [
    {
      role: 'user' as const,
      content: `I have a property at ${locationLabel} and want Spacedey to review it for storage use.`,
    },
    {
      role: 'assistant' as const,
      content: `Thanks ${inquiry.firstName}, I’ve logged your property at ${locationLabel} for the partnerships team and started a review for ${sizeLabel}.`,
    },
    {
      role: 'assistant' as const,
      content: `${detailsLine}\n\nYou can reply here with exact availability, access notes, photos, floor plan context, or the best callback window.`,
    },
  ];
}

function buildLandlordReply(inquiry: LandlordInquiry, message: string) {
  const normalizedMessage = message.toLowerCase();
  if (
    normalizedMessage.includes('photo') ||
    normalizedMessage.includes('image') ||
    normalizedMessage.includes('plan')
  ) {
    return 'Perfect. I’ve marked this as additional property context. If there’s a preferred call window or access detail, send that too and I’ll keep it with the enquiry.';
  }

  if (inquiry.botReplyCount <= 1) {
    return 'Thanks. I’ve attached that update to your landlord enquiry and flagged it for the partnerships team.';
  }

  return 'Understood. I’ve added your latest landlord note and kept the enquiry active for review.';
}

export async function initializeLandlordConversation(
  inquiryId: string
): Promise<LandlordConversationSnapshot> {
  const dataSource = await connectTypeORM();
  await ensureInAppConversationSchema(dataSource);
  const repo = dataSource.getRepository(LandlordInquiry);
  const messageRepo = dataSource.getRepository(LandlordMessage);
  const inquiry = await repo.findOne({ where: { id: inquiryId } });

  if (!inquiry) {
    throw new Error('Landlord enquiry not found.');
  }

  const now = new Date();
  const messages = buildLandlordIntroMessages(inquiry);
  inquiry.chatThreadId = inquiry.chatThreadId || crypto.randomUUID();
  inquiry.status = 'contacted';
  inquiry.botReplyCount = 2;
  inquiry.lastOutboundAt = now;
  await repo.save(inquiry);
  const savedMessages = await messageRepo.save(
    messages.map((message) =>
      messageRepo.create({
        inquiryId: inquiry.id,
        role: message.role,
        content: message.content,
      })
    )
  );

  return {
    conversationId: inquiry.chatThreadId,
    messages: savedMessages.map((message) => toConversationMessage(message)),
    status: inquiry.status,
  };
}

export async function appendLandlordConversationMessage(args: {
  conversationId: string;
  message: string;
}): Promise<LandlordConversationSnapshot> {
  const dataSource = await connectTypeORM();
  await ensureInAppConversationSchema(dataSource);
  const repo = dataSource.getRepository(LandlordInquiry);
  const messageRepo = dataSource.getRepository(LandlordMessage);
  const inquiry = await repo.findOne({ where: { chatThreadId: args.conversationId } });

  if (!inquiry) {
    throw new Error('Landlord conversation not found.');
  }

  const now = new Date();
  await messageRepo.save([
    messageRepo.create({
      inquiryId: inquiry.id,
      role: 'user',
      content: args.message,
    }),
    messageRepo.create({
      inquiryId: inquiry.id,
      role: 'assistant',
      content: buildLandlordReply(inquiry, args.message),
    }),
  ]);
  inquiry.lastInboundMessage = args.message;
  inquiry.lastInboundAt = now;
  inquiry.lastOutboundAt = now;
  inquiry.botReplyCount += 1;
  inquiry.status = inquiry.botReplyCount > 2 ? 'triaging' : 'responded';
  await repo.save(inquiry);
  const allMessages = await messageRepo.find({
    where: { inquiryId: inquiry.id },
    order: { createdAt: 'ASC' },
  });

  return {
    conversationId: inquiry.chatThreadId || args.conversationId,
    messages: allMessages.map((message) => toConversationMessage(message)),
    status: inquiry.status,
  };
}
