// convex/crons.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run every 24 hours
crons.interval(
  "cleanupOldConversations",
  { hours: 24 },
  internal.conversations.cleanupOldConversations,
  { hoursToKeep: 48 }
);

export default crons;