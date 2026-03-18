import { connectTypeORM } from '@/lib/db';
import { ensureInAppConversationSchema } from '@/lib/db/ensureInAppConversationSchema';
import ReferralSubmission from '@/lib/db/entities/ReferralSubmission';
import ReferralMessage from '@/lib/db/entities/ReferralMessage';
import { type ConversationMessage, toConversationMessage } from '@/lib/conversations/messages';

export type ReferralConversationSnapshot = {
  conversationId: string;
  messages: ConversationMessage[];
  status: string;
};

function buildReferralIntroMessages(submission: ReferralSubmission) {
  return [
    {
      role: 'user' as const,
      content: `I want to refer ${submission.refereeFirstName} in ${submission.refereeLocation}.`,
    },
    {
      role: 'assistant' as const,
      content: `Thanks ${submission.firstName}, I’ve logged your referral for ${submission.refereeFirstName} in ${submission.refereeLocation}.`,
    },
    {
      role: 'assistant' as const,
      content:
        'If there’s anything we should know before we reach out, reply here with the best contact time, what storage need they mentioned, or any move-in timing that will help us.',
    },
  ];
}

function buildReferralReply(submission: ReferralSubmission) {
  if (submission.botReplyCount <= 1) {
    return 'Thanks. I’ve attached that note to the referral and flagged it for the team.';
  }

  return 'Got it. I’ve added your latest update to the referral conversation.';
}

export async function initializeReferralConversation(
  submissionId: string
): Promise<ReferralConversationSnapshot> {
  const dataSource = await connectTypeORM();
  await ensureInAppConversationSchema(dataSource);
  const repo = dataSource.getRepository(ReferralSubmission);
  const messageRepo = dataSource.getRepository(ReferralMessage);
  const submission = await repo.findOne({ where: { id: submissionId } });

  if (!submission) {
    throw new Error('Referral submission not found.');
  }

  const now = new Date();
  const messages = buildReferralIntroMessages(submission);
  submission.chatThreadId = submission.chatThreadId || crypto.randomUUID();
  submission.followUpStatus = 'contacted';
  submission.botReplyCount = 2;
  submission.lastOutboundAt = now;
  await repo.save(submission);
  const savedMessages = await messageRepo.save(
    messages.map((message) =>
      messageRepo.create({
        submissionId: submission.id,
        role: message.role,
        content: message.content,
      })
    )
  );

  return {
    conversationId: submission.chatThreadId,
    messages: savedMessages.map((message) => toConversationMessage(message)),
    status: submission.followUpStatus,
  };
}

export async function appendReferralConversationMessage(args: {
  conversationId: string;
  message: string;
}): Promise<ReferralConversationSnapshot> {
  const dataSource = await connectTypeORM();
  await ensureInAppConversationSchema(dataSource);
  const repo = dataSource.getRepository(ReferralSubmission);
  const messageRepo = dataSource.getRepository(ReferralMessage);
  const submission = await repo.findOne({ where: { chatThreadId: args.conversationId } });

  if (!submission) {
    throw new Error('Referral conversation not found.');
  }

  const now = new Date();
  await messageRepo.save([
    messageRepo.create({
      submissionId: submission.id,
      role: 'user',
      content: args.message,
    }),
    messageRepo.create({
      submissionId: submission.id,
      role: 'assistant',
      content: buildReferralReply(submission),
    }),
  ]);
  submission.lastInboundMessage = args.message;
  submission.lastInboundAt = now;
  submission.lastOutboundAt = now;
  submission.botReplyCount += 1;
  submission.followUpStatus = submission.botReplyCount > 2 ? 'triaging' : 'responded';
  await repo.save(submission);
  const allMessages = await messageRepo.find({
    where: { submissionId: submission.id },
    order: { createdAt: 'ASC' },
  });

  return {
    conversationId: submission.chatThreadId || args.conversationId,
    messages: allMessages.map((message) => toConversationMessage(message)),
    status: submission.followUpStatus,
  };
}
