import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveConversations = mutation({
  args: {
    userId: v.string(),
    conversations: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    // Delete old conversations
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const conv of existing) {
      await ctx.db.delete(conv._id);
    }
    
    // Save new conversations - convert Dates to numbers
    for (const conv of args.conversations) {
      await ctx.db.insert("conversations", {
        userId: args.userId,
        conversationId: conv.id,
        title: conv.title,
        messages: conv.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp instanceof Date ? m.timestamp.getTime() : m.timestamp,
        })),
        createdAt: conv.createdAt instanceof Date ? conv.createdAt.getTime() : conv.createdAt,
        updatedAt: conv.updatedAt instanceof Date ? conv.updatedAt.getTime() : conv.updatedAt,
        pinned: conv.pinned || false,
      });
    }
  },
});

export const loadConversations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    
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

export const clearAll = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const conv of existing) {
      await ctx.db.delete(conv._id);
    }
    
    return { deleted: existing.length };
  },
});