import { createAdminClient } from '@/lib/supabase/admin';
import { ensureInAppConversationSchema } from '@/lib/db/ensureInAppConversationSchema';
import ReferralSubmission from '@/lib/db/entities/ReferralSubmission';
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

function buildReferralReply(botReplyCount: number) {
  if (botReplyCount <= 1) {
    return 'Thanks. I’ve attached that note to the referral and flagged it for the team.';
  }

  return 'Got it. I’ve added your latest update to the referral conversation.';
}

export async function initializeReferralConversation(
  submissionId: string
): Promise<ReferralConversationSnapshot> {
  await ensureInAppConversationSchema();
  const supabase = createAdminClient();

  const { data: submission, error: submissionError } = await supabase
    .from('referral_submissions')
    .select('*')
    .eq('id', submissionId)
    .maybeSingle();

  if (submissionError) {
    throw submissionError;
  }

  if (!submission) {
    throw new Error('Referral submission not found.');
  }

  const now = new Date().toISOString();
  const messages = buildReferralIntroMessages(submission as unknown as ReferralSubmission);
  const chatThreadId = submission.chatThreadId || crypto.randomUUID();

  await supabase
    .from('referral_submissions')
    .update({
      chatThreadId,
      followUpStatus: 'contacted',
      botReplyCount: 2,
      lastOutboundAt: now,
    })
    .eq('id', submission.id);

  const { data: savedMessages, error: messageError } = await supabase
    .from('referral_messages')
    .insert(
      messages.map((message) => ({
        submissionId: submission.id,
        role: message.role,
        content: message.content,
      }))
    )
    .select('*');

  if (messageError) {
    throw messageError;
  }

  return {
    conversationId: chatThreadId,
    messages: (savedMessages ?? []).map((message) => toConversationMessage(message)),
    status: 'contacted',
  };
}

export async function appendReferralConversationMessage(args: {
  conversationId: string;
  message: string;
}): Promise<ReferralConversationSnapshot> {
  await ensureInAppConversationSchema();
  const supabase = createAdminClient();

  const { data: submission, error: submissionError } = await supabase
    .from('referral_submissions')
    .select('*')
    .eq('chatThreadId', args.conversationId)
    .maybeSingle();

  if (submissionError) {
    throw submissionError;
  }

  if (!submission) {
    throw new Error('Referral conversation not found.');
  }

  const now = new Date().toISOString();
  const botReplyCount = submission.botReplyCount + 1;
  const followUpStatus = botReplyCount > 2 ? 'triaging' : 'responded';

  await supabase.from('referral_messages').insert([
    {
      submissionId: submission.id,
      role: 'user',
      content: args.message,
    },
    {
      submissionId: submission.id,
      role: 'assistant',
      content: buildReferralReply(submission.botReplyCount),
    },
  ]);

  await supabase
    .from('referral_submissions')
    .update({
      lastInboundMessage: args.message,
      lastInboundAt: now,
      lastOutboundAt: now,
      botReplyCount,
      followUpStatus,
    })
    .eq('id', submission.id);

  const { data: allMessages, error: messagesError } = await supabase
    .from('referral_messages')
    .select('*')
    .eq('submissionId', submission.id)
    .order('createdAt', { ascending: true });

  if (messagesError) {
    throw messagesError;
  }

  return {
    conversationId: submission.chatThreadId || args.conversationId,
    messages: (allMessages ?? []).map((message) => toConversationMessage(message)),
    status: followUpStatus,
  };
}
