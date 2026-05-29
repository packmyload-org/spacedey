import { Chat, type Message, type Thread } from 'chat';
import { MemoryStateAdapter } from '@chat-adapter/state-memory';
import { createAdminClient } from '@/lib/supabase/admin';
import { createConfiguredResendAdapter, createResendThread } from '@/lib/services/emailChatConfig';

const DEFAULT_FROM_NAME = 'Spacedey Referrals';

let referralFollowUpChat: Chat | null = null;
let referralResendAdapter: ReturnType<typeof createConfiguredResendAdapter> | null = null;

function createIntroMessage(args: {
  firstName: string;
  refereeFirstName: string;
  refereeLocation: string;
}) {
  return {
    markdown: [
      `Hi ${args.firstName},`,
      '',
      `Thanks for referring ${args.refereeFirstName} in ${args.refereeLocation}. We have logged the referral and started the follow-up on our side.`,
      '',
      'If there is anything useful we should know before we reach out, reply here with:',
      '',
      '1. The best time to contact them',
      '2. What storage need they mentioned',
      '3. Any location or move-in timing context',
      '',
      'We will keep the process moving from here.',
    ].join('\n'),
  };
}

function createFollowUpReply(firstName: string) {
  return {
    markdown: [
      `Thanks ${firstName},`,
      '',
      'We have added your note to the referral and flagged it for the team.',
      '',
      'If your referral has any urgency, you can keep replying in this thread and we will include it in the handoff.',
    ].join('\n'),
  };
}

function getReferralFollowUpChat() {
  if (referralFollowUpChat) {
    return referralFollowUpChat;
  }

  const resend = getReferralResendAdapter();

  const chat = new Chat({
    userName: 'referral-follow-up',
    adapters: { resend },
    state: new MemoryStateAdapter(),
  });

  const handleInboundMessage = async (thread: Thread, message: Message) => {
    const supabase = createAdminClient();
    const { data: submission } = await supabase
      .from('referral_submissions')
      .select('*')
      .eq('chatThreadId', thread.id)
      .maybeSingle();

    if (!submission) {
      return;
    }

    const now = new Date().toISOString();
    const followUpStatus = submission.botReplyCount > 1 ? 'triaging' : 'responded';

    await supabase
      .from('referral_submissions')
      .update({
        lastInboundMessage: String(message.text || '').trim() || null,
        lastInboundAt: now,
        followUpStatus,
      })
      .eq('id', submission.id);

    if (submission.botReplyCount > 1) {
      return;
    }

    await thread.post({
      ...createFollowUpReply(submission.firstName),
      fallbackText: 'Thanks. We have attached your referral follow-up note for the team.',
    });

    await supabase
      .from('referral_submissions')
      .update({
        botReplyCount: submission.botReplyCount + 1,
        lastOutboundAt: now,
        followUpStatus: 'triaging',
      })
      .eq('id', submission.id);
  };

  chat.onNewMention(async (thread, message) => {
    await thread.subscribe();
    await handleInboundMessage(thread, message);
  });

  chat.onSubscribedMessage(async (thread, message) => {
    await handleInboundMessage(thread, message);
  });

  referralFollowUpChat = chat;
  return chat;
}

function getReferralResendAdapter() {
  if (referralResendAdapter) {
    return referralResendAdapter;
  }

  referralResendAdapter = createConfiguredResendAdapter({
    fallbackName: DEFAULT_FROM_NAME,
  });

  return referralResendAdapter;
}

export function isReferralFollowUpConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function sendReferralFollowUpEmail(args: {
  submissionId: string;
  firstName: string;
  email: string;
  refereeFirstName: string;
  refereeLocation: string;
}) {
  const chat = getReferralFollowUpChat();
  await chat.initialize();
  const resend = getReferralResendAdapter();
  const threadId = await resend.openDM(args.email);
  const thread = createResendThread(chat, resend, threadId);

  await thread.subscribe();
  await thread.post({
    ...createIntroMessage({
      firstName: args.firstName,
      refereeFirstName: args.refereeFirstName,
      refereeLocation: args.refereeLocation,
    }),
    fallbackText:
      `Hi ${args.firstName}, thanks for your Spacedey referral. Reply with timing or context that will help us reach ${args.refereeFirstName}.`,
  });

  const supabase = createAdminClient();
  await supabase
    .from('referral_submissions')
    .update({
      chatThreadId: thread.id,
      followUpStatus: 'contacted',
      botReplyCount: 1,
      lastOutboundAt: new Date().toISOString(),
    })
    .eq('id', args.submissionId);

  return thread.id;
}

export async function handleReferralFollowUpWebhook(request: Request) {
  const chat = getReferralFollowUpChat();
  return chat.webhooks.resend(request);
}
