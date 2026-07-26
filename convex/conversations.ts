// convex/conversations.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveConversations = mutation({
  args: {
    userId: v.string(),
    conversations: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        messages: v.array(
          v.object({
            id: v.string(),
            role: v.string(),
            content: v.string(),
            timestamp: v.number(),
          })
        ),
        createdAt: v.number(),
        updatedAt: v.number(),
        pinned: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { userId, conversations } = args;
    
    console.log('💾 SAVING to Convex - userId:', userId);
    console.log('💾 Conversations count:', conversations.length);
    console.log('💾 First conversation:', conversations[0]?.id);
    
    // ✅ Delete old conversations first
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    console.log('💾 Deleting old conversations:', existing.length);
    
    for (const conv of existing) {
      await ctx.db.delete(conv._id);
    }

    // ✅ Save each conversation as a separate document
    let savedCount = 0;
    for (const conv of conversations) {
      // ✅ Ensure timestamps are numbers
      const messages = conv.messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: typeof m.timestamp === 'number' ? m.timestamp : new Date(m.timestamp).getTime(),
      }));
      
      const createdAt = typeof conv.createdAt === 'number' ? conv.createdAt : new Date(conv.createdAt).getTime();
      const updatedAt = typeof conv.updatedAt === 'number' ? conv.updatedAt : new Date(conv.updatedAt).getTime();
      
      await ctx.db.insert("conversations", {
        userId: userId,
        conversationId: conv.id,
        title: conv.title,
        messages: messages,
        createdAt: createdAt,
        updatedAt: updatedAt,
        pinned: conv.pinned || false,
      });
      savedCount++;
    }
    
    console.log('✅ Convex save completed - saved:', savedCount, 'conversations');
  },
});

export const loadConversations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    console.log('🔵 LOADING from Convex - userId:', args.userId);
    
    const conversationDocs = await ctx.db
      .query("conversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    console.log('🔵 Found conversation documents:', conversationDocs.length);
    
    // ✅ Convert back to the expected format
    const conversations = conversationDocs.map((conv) => ({
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
    
    console.log('🔵 Loaded conversations:', conversations.length);
    console.log('🔵 First conversation ID:', conversations[0]?.id);
    
    return conversations;
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