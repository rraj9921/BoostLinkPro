import "dotenv/config";
import { Worker, type Job } from "bullmq";
import { redis } from "./queues.ts";
import axios from "axios";
import { supabase } from "../config/supabase.ts";

const GRAPH = "https://graph.instagram.com/v18.0";

interface DmJobData {
  automationId: string;
  accessToken: string;
  commenterId: string;
  commenterUsername: string;
  commentId: string;
  dmMessage: string;
  commentReply: string;
  followCondition: boolean;
  igOwnerId: string;
}

const worker = new Worker("dm-queue", async (job: Job<DmJobData>) => {
  const {
    accessToken, commenterId, commenterUsername,
    commentId, dmMessage, commentReply, followCondition, igOwnerId, automationId,
  } = job.data;

  console.log(`Processing DM for @${commenterUsername}`);

  let dmSent           = false;
  let commentReplySent = false;
  let followMet        = !followCondition; // if no condition, treat as met

  try {
    // Check follow condition
    if (followCondition) {
      const r = await axios.get(`${GRAPH}/${igOwnerId}/followers`, {
        params: { access_token: accessToken, user_id: commenterId },
      });
      followMet = (r.data?.data ?? []).some((u: { id: string }) => u.id === commenterId);
    }

    // Send DM
    if (followMet && dmMessage) {
      await axios.post(`${GRAPH}/me/messages`,
        { recipient: { id: commenterId }, message: { text: dmMessage } },
        { params: { access_token: accessToken } }
      );
      dmSent = true;
    }

    // Post comment reply
    if (commentReply) {
      await axios.post(`${GRAPH}/${commentId}/replies`,
        { message: commentReply },
        { params: { access_token: accessToken } }
      );
      commentReplySent = true;
    }

    // Update log
    await supabase
      .from("comment_events")
      .update({ dm_sent: dmSent, comment_reply_sent: commentReplySent, follow_condition_met: followMet })
      .eq("automation_id", automationId)
      .eq("commenter_ig_id", commenterId);

    console.log(`Done: DM=${dmSent} reply=${commentReplySent}`);
  } catch (err) {
    console.error("Worker error:", err);
    throw err; // BullMQ will retry
  }
}, {
  connection: redis,
  concurrency: 5,
  limiter: { max: 200, duration: 3_600_000 }, // 200 DMs/hour (Meta limit)
});

worker.on("completed", (job) => console.log(`Job ${job.id} done`));
worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed:`, err.message));
console.log("DM Worker started");
