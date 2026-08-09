// convex/conversations.ts
import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================
// 📥 SAVE CONVERSATIONS - Save to database
// ============================================================
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
      
      return { success: true, savedCount };
    } catch (error) {
      console.error('❌ Convex save error:', error);
      throw error;
    }
  },
});

// ============================================================
// 📤 LOAD CONVERSATIONS - Load from database
// ============================================================
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
      return [];
    }
  },
});

// ============================================================
// 🗑️ CLEAR ALL - Delete all conversations for a user
// ============================================================
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

// ============================================================
// 🧹 CLEANUP OLD CONVERSATIONS - Delete conversations older than X hours
// ============================================================
export const cleanupOldConversations = internalMutation({
  args: {
    hoursToKeep: v.optional(v.number()), // Default 48 hours
  },
  handler: async (ctx, args) => {
    const hoursToKeep = args.hoursToKeep || 48;
    const cutoffTime = Date.now() - (hoursToKeep * 60 * 60 * 1000);
    
    console.log(`🧹 Cleaning up conversations older than ${hoursToKeep} hours`);
    console.log(`🧹 Cutoff time: ${new Date(cutoffTime).toISOString()}`);
    
    // Get ALL conversations
    const allConversations = await ctx.db
      .query("conversations")
      .collect();
    
    console.log(`🧹 Found ${allConversations.length} total conversations`);
    
    let deletedCount = 0;
    let keptCount = 0;
    
    for (const conv of allConversations) {
      if (conv.updatedAt < cutoffTime) {
        await ctx.db.delete(conv._id);
        deletedCount++;
        console.log(`🗑️ Deleted: ${conv.conversationId} (${conv.title})`);
      } else {
        keptCount++;
      }
    }
    
    console.log(`🧹 Cleanup complete! Deleted: ${deletedCount}, Kept: ${keptCount}`);
    
    return {
      success: true,
      deleted: deletedCount,
      kept: keptCount,
      cutoffTime: new Date(cutoffTime).toISOString(),
    };
  },
});

// ============================================================
// 📊 GET DATABASE STATS - Check current usage
// ============================================================
export const getDatabaseStats = query({
  handler: async (ctx) => {
    const allConversations = await ctx.db
      .query("conversations")
      .collect();
    
    const now = Date.now();
    const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000);
    
    let oldCount = 0;
    let recentCount = 0;
    let totalMessages = 0;
    
    for (const conv of allConversations) {
      if (conv.updatedAt < fortyEightHoursAgo) {
        oldCount++;
      } else {
        recentCount++;
      }
      totalMessages += conv.messages.length;
    }
    
    return {
      totalConversations: allConversations.length,
      totalMessages: totalMessages,
      oldConversations: oldCount,
      recentConversations: recentCount,
      // Calculate approximate size
      averageMessagesPerConversation: allConversations.length > 0 
        ? Math.round(totalMessages / allConversations.length) 
        : 0,
    };
  },
});

// ============================================================
// 📤 EXPORT ALIASES - For backward compatibility
// ============================================================
export const saveConversationsClean = saveConversations;
export const loadConversationsClean = loadConversations;