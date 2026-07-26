// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    userId: v.string(),
    conversationId: v.string(),
    title: v.string(),
    messages: v.array(
      v.object({
        id: v.string(),
        role: v.string(),
        content: v.string(),
        timestamp: v.number(), // ✅ Must be number
      })
    ),
    createdAt: v.number(), // ✅ Must be number
    updatedAt: v.number(), // ✅ Must be number
    pinned: v.boolean(),
  }).index("by_userId", ["userId"]),
});