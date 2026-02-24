import { Context } from "npm:hono";
import * as kv from "./kv_store.tsx";

interface CommunityPost {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  topic?: string;
  category: string;
  content: string;
  likes: number;
  reply_count: number;
  created_at: string;
  liked_by: string[];
}

interface Reply {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  likes: number;
  created_at: string;
}

// Get all community posts
export async function getAllPosts(c: Context) {
  try {
    const posts = await kv.getByPrefix("community_post_");
    const sortedPosts = (posts || []).sort((a: CommunityPost, b: CommunityPost) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return bTime - aTime;
    });
    return c.json({ posts: sortedPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
}

// Get single post
export async function getPost(c: Context) {
  try {
    const id = c.req.param("id");
    const post = await kv.get(`community_post_${id}`);
    
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    
    return c.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return c.json({ error: "Failed to fetch post" }, 500);
  }
}

// Create new post
export async function createPost(c: Context) {
  try {
    const body = await c.req.json();
    const { author_name, author_avatar, topic, category, content } = body;
    const userId = c.get('userId');
    const userEmail = c.get('userEmail');
    const user = c.get('user');
    const displayName = author_name || user?.user_metadata?.name || user?.user_metadata?.full_name || userEmail || 'Founder';
    
    if (!userId || !category || !content?.trim()) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const id = crypto.randomUUID();
    const post: CommunityPost = {
      id,
      author_id: userId,
      author_name: displayName,
      author_avatar,
      topic: topic || 'general',
      category,
      content: content.trim(),
      likes: 0,
      reply_count: 0,
      created_at: new Date().toISOString(),
      liked_by: []
    };
    
    await kv.set(`community_post_${id}`, post);
    
    return c.json({ post }, 201);
  } catch (error) {
    console.error("Error creating post:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
}

// Like/unlike post
export async function toggleLikePost(c: Context) {
  try {
    const id = c.req.param("id");
    const userId = c.get('userId');
    
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const post = await kv.get(`community_post_${id}`) as CommunityPost;
    
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    
    const liked_by = post.liked_by || [];
    const hasLiked = liked_by.includes(userId);
    
    const updatedPost: CommunityPost = {
      ...post,
      likes: hasLiked ? post.likes - 1 : post.likes + 1,
      liked_by: hasLiked 
        ? liked_by.filter(id => id !== userId)
        : [...liked_by, userId]
    };
    
    await kv.set(`community_post_${id}`, updatedPost);
    
    return c.json({ post: updatedPost });
  } catch (error) {
    console.error("Error toggling like:", error);
    return c.json({ error: "Failed to toggle like" }, 500);
  }
}

// Get replies for a post
export async function getReplies(c: Context) {
  try {
    const post_id = c.req.param("id");
    const allReplies = await kv.getByPrefix("community_reply_");
    const postReplies = allReplies
      .filter((reply: Reply) => reply.post_id === post_id)
      .sort((a: Reply, b: Reply) => {
        const aTime = new Date(a.created_at).getTime();
        const bTime = new Date(b.created_at).getTime();
        return aTime - bTime;
      });
    
    return c.json({ replies: postReplies || [] });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return c.json({ error: "Failed to fetch replies" }, 500);
  }
}

// Create reply
export async function createReply(c: Context) {
  try {
    const post_id = c.req.param("id");
    const body = await c.req.json();
    const { author_name, author_avatar, content } = body;
    const userId = c.get('userId');
    const userEmail = c.get('userEmail');
    const user = c.get('user');
    const displayName = author_name || user?.user_metadata?.name || user?.user_metadata?.full_name || userEmail || 'Founder';
    
    if (!userId || !content?.trim()) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const post = await kv.get(`community_post_${post_id}`) as CommunityPost;
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    
    const id = crypto.randomUUID();
    const reply: Reply = {
      id,
      post_id,
      author_id: userId,
      author_name: displayName,
      author_avatar,
      content: content.trim(),
      likes: 0,
      created_at: new Date().toISOString()
    };
    
    await kv.set(`community_reply_${id}`, reply);
    
    // Update reply count on post
    if (post) {
      post.reply_count = (post.reply_count || 0) + 1;
      await kv.set(`community_post_${post_id}`, post);
    }
    
    return c.json({ reply }, 201);
  } catch (error) {
    console.error("Error creating reply:", error);
    return c.json({ error: "Failed to create reply" }, 500);
  }
}
