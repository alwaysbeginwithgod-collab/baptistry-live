// convex/conversations.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveConversations = mutation({
  args: {
    userId: v.string(),
    conversations: v.any(),
  },
  handler: async (ctx, args) => {
    const { userId, conversations } = args;
    
    console.log('💾 SAVING to Convex - userId:', userId);
    console.log('💾 Conversations count:', conversations?.length || 0);
    
    // ✅ Delete old conversations for this user
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    console.log('💾 Deleting old conversations:', existing.length);
    
    for (const conv of existing) {
      await ctx.db.delete(conv._id);
    }

    // ✅ Save each conversation as a separate document
    for (const conv of conversations || []) {
      await ctx.db.insert("conversations", {
        userId: userId,
        conversationId: conv.id,
        title: conv.title || "Untitled",
        messages: conv.messages || [],
        createdAt: conv.createdAt || Date.now(),
        updatedAt: conv.updatedAt || Date.now(),
        pinned: conv.pinned || false,
      });
    }
    
    console.log('✅ Convex save completed');
  },
});

export const loadConversations = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('🔵 LOADING from Convex - userId:', args.userId);
    
    try {
      const conversationDocs = await ctx.db
        .query("conversations")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .collect();

      console.log('🔵 Found conversation documents:', conversationDocs.length);
      
      if (conversationDocs.length === 0) {
        return [];
      }
      
      const result = conversationDocs.map((conv) => ({
        id: conv.conversationId,
        title: conv.title,
        messages: conv.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp),
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        pinned: conv.pinned,
      }));
      
      console.log('🔵 Loaded conversations:', result.length);
      
      return result;
    } catch (error) {
      console.error('🔵 Error loading conversations:', error);
      return [];
    }
  },
});

export const clearAll = mutation({
  args: {
    userId: v.string(),
  },
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