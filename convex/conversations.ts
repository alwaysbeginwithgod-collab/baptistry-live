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
    
    console.log('💾 SAVING - userId:', userId);
    console.log('💾 Conversations count:', conversations?.length || 0);

    try {
      // ✅ Delete all existing conversations for this user
      const existing = await ctx.db
        .query("conversations")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();

      console.log('💾 Deleting old conversations:', existing.length);

      for (const doc of existing) {
        await ctx.db.delete(doc._id);
      }

      // ✅ Insert new conversations
      let savedCount = 0;
      for (const conv of conversations || []) {
        const messages = (conv.messages || []).map((m: any) => ({
          id: String(m.id || `msg-${Date.now()}`),
          role: String(m.role || 'user'),
          content: String(m.content || ''),
          timestamp: typeof m.timestamp === 'number' ? m.timestamp : Date.now(),
        }));

        await ctx.db.insert("conversations", {
          userId: userId,
          conversationId: String(conv.id || `conv-${Date.now()}`),
          title: String(conv.title || 'Untitled'),
          messages: messages,
          createdAt: typeof conv.createdAt === 'number' ? conv.createdAt : Date.now(),
          updatedAt: typeof conv.updatedAt === 'number' ? conv.updatedAt : Date.now(),
          pinned: conv.pinned || false,
        });
        savedCount++;
      }

      console.log(`✅ Convex save completed - saved ${savedCount} conversations`);
      
      // ✅ Return the saved conversations for confirmation
      return { success: true, savedCount };
    } catch (error) {
      console.error('❌ Convex save error:', error);
      throw error;
    }
  },
});

export const loadConversations = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('🔵 LOADING - userId:', args.userId);

    try {
      const docs = await ctx.db
        .query("conversations")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .collect();

      console.log('🔵 Found docs:', docs.length);

      // ✅ Log each conversation for debugging
      for (const doc of docs) {
        console.log('🔵 Conversation:', doc.conversationId, 'Title:', doc.title, 'Messages:', doc.messages.length);
      }

      if (docs.length === 0) {
        console.log('🔵 No conversations found, returning empty array');
        return [];
      }

      const result = docs.map((doc) => ({
        id: doc.conversationId,
        title: doc.title,
        messages: doc.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        pinned: doc.pinned,
      }));

      console.log('🔵 Loaded conversations:', result.length);
      return result;
    } catch (error) {
      console.error('🔵 Error loading conversations:', error);
      return []; // Always return empty array on error
    }
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

export const saveConversationsClean = saveConversations;
export const loadConversationsClean = loadConversations;