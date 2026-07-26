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
    
    console.log('💾 Saving for user:', userId);

    // Delete all existing conversations
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    for (const doc of existing) {
      await ctx.db.delete(doc._id);
    }

    // Insert new conversations
    for (const conv of conversations || []) {
      const messages = (conv.messages || []).map((m: any) => ({
        id: m.id || `msg-${Date.now()}`,
        role: m.role || 'user',
        content: m.content || '',
        timestamp: typeof m.timestamp === 'number' ? m.timestamp : Date.now(),
      }));

      await ctx.db.insert("conversations", {
        userId: userId,
        conversationId: conv.id || `conv-${Date.now()}`,
        title: conv.title || 'Untitled',
        messages: messages,
        createdAt: typeof conv.createdAt === 'number' ? conv.createdAt : Date.now(),
        updatedAt: typeof conv.updatedAt === 'number' ? conv.updatedAt : Date.now(),
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
    console.log('🔵 Loading for user:', args.userId);

    const docs = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    console.log('🔵 Found docs:', docs.length);

    // ✅ Return the raw data without converting to Date objects
    // Let the client handle the conversion
    return docs.map((doc) => ({
      id: doc.conversationId,
      title: doc.title,
      messages: doc.messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp, // ✅ Keep as number
      })),
      createdAt: doc.createdAt, // ✅ Keep as number
      updatedAt: doc.updatedAt, // ✅ Keep as number
      pinned: doc.pinned,
    }));
  },
});

export const clearAll = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    for (const doc of docs) {
      await ctx.db.delete(doc._id);
    }

    return { deleted: docs.length };
  },
});