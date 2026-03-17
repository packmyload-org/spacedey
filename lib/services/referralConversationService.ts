import { connectTypeORM } from '@/lib/db';
import ReferralSubmission from '@/lib/db/entities/ReferralSubmission';
import { createConversationMessage, type ConversationMessage } from '@/lib/conversations/messages';

export type ReferralConversationSnapshot = {
  conversationId: string;
  messages: ConversationMessage[];
  status: string;
};

function buildReferralIntroMessages(submission: ReferralSubmission) {
  return [
    createConversationMessage(
      'user',
      `I want to refer ${submission.refereeFirstName} in ${submission.refereeLocation}.`
    ),
    createConversationMessage(
      'assistant',
      `Thanks ${submission.firstName}, I’ve logged your referral for ${submission.refereeFirstName} in ${submission.refereeLocation}.`
    ),
    createConversationMessage(
      'assistant',
      'If there’s anything we should know before we reach out, reply here with the best contact time, what storage need they mentioned, or any move-in timing that will help us.'
    ),
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
  const repo = dataSource.getRepository(ReferralSubmission);
  const submission = await repo.findOne({ where: { id: submissionId } });

  if (!submission) {
    throw new Error('Referral submission not found.');
  }

  const now = new Date();
  submission.chatThreadId = submission.chatThreadId || crypto.randomUUID();
  submission.conversationMessages = buildReferralIntroMessages(submission);
  submission.followUpStatus = 'contacted';
  submission.botReplyCount = 2;
  submission.lastOutboundAt = now;
  await repo.save(submission);

  return {
    conversationId: submission.chatThreadId,
    messages: submission.conversationMessages,
    status: submission.followUpStatus,
  };
}

export async function appendReferralConversationMessage(args: {
  conversationId: string;
  message: string;
}): Promise<ReferralConversationSnapshot> {
  const dataSource = await connectTypeORM();
  const repo = dataSource.getRepository(ReferralSubmission);
  const submission = await repo.findOne({ where: { chatThreadId: args.conversationId } });

  if (!submission) {
    throw new Error('Referral conversation not found.');
  }

  const now = new Date();
  const userMessage = createConversationMessage('user', args.message, now);
  const assistantMessage = createConversationMessage(
    'assistant',
    buildReferralReply(submission),
    now
  );

  submission.conversationMessages = [
    ...submission.conversationMessages,
    userMessage,
    assistantMessage,
  ];
  submission.lastInboundMessage = args.message;
  submission.lastInboundAt = now;
  submission.lastOutboundAt = now;
  submission.botReplyCount += 1;
  submission.followUpStatus = submission.botReplyCount > 2 ? 'triaging' : 'responded';
  await repo.save(submission);

  return {
    conversationId: submission.chatThreadId || args.conversationId,
    messages: submission.conversationMessages,
    status: submission.followUpStatus,
  };
}
