import { supabase } from "../../config/supabase";
import { dmQueue } from "../../jobs/queues";

export interface CommentEventData {
  igAccountId:       string;
  commenterId:       string;
  commenterUsername: string;
  commentText:       string;
  postId:            string;
  commentId:         string;
}

export async function processCommentEvent(event: CommentEventData): Promise<void> {
  console.log(`Comment: "${event.commentText}" by @${event.commenterUsername}`);

  const { data: igAccount } = await supabase
    .from("instagram_accounts")
    .select("id, user_id, access_token")
    .eq("ig_user_id", event.igAccountId)
    .single();

  if (!igAccount) return;

  const { data: automations } = await supabase
    .from("automations")
    .select("*")
    .eq("ig_account_id", igAccount.id)
    .eq("is_active", true);

  for (const automation of automations ?? []) {
    const commentLower   = event.commentText.toLowerCase();
    const matchedKeyword = (automation.keywords as string[]).find((kw) =>
      commentLower.includes(kw.toLowerCase())
    );
    if (!matchedKeyword) continue;
    if ((automation.post_ids as string[]).length > 0 && !(automation.post_ids as string[]).includes(event.postId)) continue;

    console.log(`Keyword "${matchedKeyword}" matched automation "${automation.name as string}"`);

    await supabase.from("comment_events").insert({
      automation_id:       automation.id,
      commenter_ig_id:     event.commenterId,
      commenter_username:  event.commenterUsername,
      comment_text:        event.commentText,
      post_id:             event.postId,
      keyword_matched:     matchedKeyword,
      dm_sent:             false,
      comment_reply_sent:  false,
    });

    await dmQueue.add("send-dm", {
      automationId:       automation.id,
      accessToken:        igAccount.access_token,
      commenterId:        event.commenterId,
      commenterUsername:  event.commenterUsername,
      commentId:          event.commentId,
      dmMessage:          automation.dm_message,
      commentReply:       automation.comment_reply,
      followCondition:    automation.follow_condition,
      igOwnerId:          event.igAccountId,
    }, { attempts: 3, backoff: { type: "exponential", delay: 2000 } });
  }
}
