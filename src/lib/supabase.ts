// Use the single Supabase client from integrations to avoid duplicate instances
import { supabase } from '@/integrations/supabase/client'
import { mockBlogAPI } from './mockData'

// Re-export the supabase client for backward compatibility
export { supabase }

// Supabase is always configured
export const isSupabaseConfigured = true

// Edge function URL for admin operations
const EDGE_FUNCTION_URL = 'https://ahdxviaqamejzvtbsicg.supabase.co/functions/v1/admin-blog'

// Helper to get auth headers for edge function (JWT only - no fallback)
const getAdminHeaders = async () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  
  return headers
}

// Helper to sanitize post data before sending to Supabase
const sanitizePostData = (post: any) => {
  const { 
    id, created_at, updated_at, likes_count, views_count, comments_count, blog_comments, 
    ...cleanData 
  } = post
  return cleanData
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  featured_image?: string | null
  tags: string[]
  published: boolean
  publish_at?: string | null
  created_at: string
  updated_at: string
  likes_count: number
  views_count: number
  comments_count?: number
  allow_comments: boolean
  author_name: string
  location?: string | null
}

export interface BlogComment {
  id: string
  post_id: string
  author: string
  content: string
  created_at: string
}

export interface BlogLike {
  id: string
  post_id: string
  user_ip: string
  created_at: string
}

// Blog API functions - will use mock data if Supabase is not configured
export const blogAPI = {
  // Get all published blog posts (public)
  async getPosts(): Promise<BlogPost[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getPosts()
    }

    const nowIso = new Date().toISOString()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .or(`publish_at.lte.${nowIso},publish_at.is.null`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Get ALL posts (admin) - uses edge function with JWT auth
  async getAllPosts(): Promise<BlogPost[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getAllPosts()
    }

    // Use edge function for admin operations with JWT auth
    const headers = await getAdminHeaders()
    const response = await fetch(`${EDGE_FUNCTION_URL}/posts`, { headers })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch posts')
    }
    return response.json()
  },

  // Get single blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getPostBySlug(slug)
    }

    const nowIso = new Date().toISOString()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .or(`publish_at.lte.${nowIso},publish_at.is.null`)
      .single()
    
    if (error) return null
    return data
  },

  // Create new blog post (admin only) - uses edge function with JWT
  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'views_count'>): Promise<BlogPost> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.createPost(post)
    }

    const cleanPost = sanitizePostData(post)

    // Use edge function for admin operations with JWT auth
    const headers = await getAdminHeaders()
    const response = await fetch(`${EDGE_FUNCTION_URL}/posts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(cleanPost)
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error('Edge function createPost error:', error)
      throw new Error(error.error || 'Failed to create post')
    }
    
    return response.json()
  },

  // Update blog post (admin only) - uses edge function with JWT
  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.updatePost(id, updates)
    }

    const cleanUpdates = sanitizePostData(updates)

    // Use edge function for admin operations with JWT auth
    const headers = await getAdminHeaders()
    const response = await fetch(`${EDGE_FUNCTION_URL}/posts/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(cleanUpdates)
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error('Edge function updatePost error:', error)
      throw new Error(error.error || 'Failed to update post')
    }
    
    return response.json()
  },

  // Delete blog post (admin only) - uses edge function with JWT
  async deletePost(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.deletePost(id)
    }

    // Use edge function for admin operations with JWT auth
    const headers = await getAdminHeaders()
    const response = await fetch(`${EDGE_FUNCTION_URL}/posts/${id}`, {
      method: 'DELETE',
      headers
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete post')
    }
  },

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.incrementViews(id)
    }

    const { error } = await supabase.rpc('increment_post_views', { post_id: id })
    if (error) console.error('Error incrementing views:', error)
  },

  // Like/unlike post (uses secure RPC functions)
  async toggleLike(postId: string, userIp: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.toggleLike(postId, userIp)
    }

    // Check if user already liked this post using secure RPC
    const { data: hasLiked } = await supabase.rpc('has_user_liked', { 
      p_post_id: postId, 
      p_user_ip: userIp 
    })

    if (hasLiked) {
      // Unlike using secure RPC
      await supabase.rpc('unlike_post', { 
        p_post_id: postId, 
        p_user_ip: userIp 
      })
      return false
    } else {
      // Like using secure RPC
      await supabase.rpc('like_post', { 
        p_post_id: postId, 
        p_user_ip: userIp 
      })
      return true
    }
  },

  // Check if user liked post (uses secure RPC - no IP exposure)
  async hasUserLiked(postId: string, userIp: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.hasUserLiked(postId, userIp)
    }

    const { data } = await supabase.rpc('has_user_liked', { 
      p_post_id: postId, 
      p_user_ip: userIp 
    })
    
    return !!data
  },

  // Get comments for a post
  async getComments(postId: string): Promise<BlogComment[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getComments(postId)
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching comments:', error)
      return []
    }
    return data || []
  },

  // Get ALL comments (admin)
  async getAllComments(): Promise<(BlogComment & { post_title?: string })[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getAllComments()
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .select('*, blog_posts(title)')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all comments:', error)
      return []
    }
    
    // Map the joined data to a flatter structure if needed, or just return as is
    return data?.map(item => ({
      ...item,
      post_title: item.blog_posts?.title
    })) || []
  },

  // Create a comment
  async createComment(postId: string, author: string, content: string): Promise<BlogComment | null> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.createComment(postId, author, content)
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .insert([{ post_id: postId, author, content }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating comment:', error)
      return null
    }
    return data
  },

  // Delete a comment (admin only)
  async deleteComment(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.deleteComment(id)
    }

    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get total comments count (for admin stats)
  async getTotalCommentsCount(): Promise<number> {
    if (!isSupabaseConfigured) {
        return mockBlogAPI.getTotalCommentsCount()
    }
    
    const { count, error } = await supabase
      .from('blog_comments')
      .select('*', { count: 'exact', head: true })
      
    if (error) return 0
    return count || 0
  }
}
