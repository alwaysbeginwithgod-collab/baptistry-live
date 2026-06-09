import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Save all conversations for a user
export const saveConversations = mutation({
  args: {
    userId: v.string(),
    conversations: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    // Delete old conversations for this user
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const conv of existing) {
      await ctx.db.delete(conv._id);
    }
    
    // Save new conversations
    for (const conv of args.conversations) {
      await ctx.db.insert("conversations", {
        userId: args.userId,
        conversationId: conv.id,
        title: conv.title,
        messages: conv.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp).getTime(),
        })),
        createdAt: new Date(conv.createdAt).getTime(),
        updatedAt: new Date(conv.updatedAt).getTime(),
        pinned: conv.pinned || false,
      });
    }
  },
});

// Load conversations for a user - returns null if no userId provided
export const loadConversations = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // If no userId provided, return null
    if (!args.userId) {
      return null;
    }
    
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    
    if (conversations.length === 0) {
      return null;
    }
    
    return conversations.map((conv) => ({
      id: conv.conversationId,
      title: conv.title,
      messages: conv.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      pinned: conv.pinned,
    }));
  },
});