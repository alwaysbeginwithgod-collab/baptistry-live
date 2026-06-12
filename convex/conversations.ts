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
    
    // Save new conversations - convert Dates to numbers (milliseconds)
    for (const conv of args.conversations) {
      await ctx.db.insert("conversations", {
        userId: args.userId,
        conversationId: conv.id,
        title: conv.title,
        messages: conv.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          // Convert Date to number if it's a Date object
          timestamp: m.timestamp instanceof Date ? m.timestamp.getTime() : m.timestamp,
        })),
        // Convert Dates to numbers
        createdAt: conv.createdAt instanceof Date ? conv.createdAt.getTime() : conv.createdAt,
        updatedAt: conv.updatedAt instanceof Date ? conv.updatedAt.getTime() : conv.updatedAt,
        pinned: conv.pinned || false,
      });
    }
  },
});

// Load conversations for a user - convert numbers back to Dates
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
        // Convert number timestamp back to Date
        timestamp: new Date(m.timestamp),
      })),
      // Convert numbers back to Dates
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      pinned: conv.pinned,
    }));
  },
});