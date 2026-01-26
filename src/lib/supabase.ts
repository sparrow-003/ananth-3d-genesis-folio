import { createClient } from '@supabase/supabase-js'
import { mockBlogAPI } from './mockData'

// For now, we'll use placeholder values - you'll need to replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl !== 'https://your-project.supabase.co' && supabaseAnonKey !== 'your-anon-key'

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  featured_image?: string
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
  likes_count: number
  views_count: number
}

export interface BlogLike {
  id: string
  post_id: string
  user_ip: string
  created_at: string
}

// Blog API functions - will use mock data if Supabase is not configured
export const blogAPI = {
  // Get all published blog posts
  async getPosts(): Promise<BlogPost[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getPosts()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Get single blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getPostBySlug(slug)
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    
    if (error) return null
    return data
  },

  // Create new blog post (admin only)
  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'views_count'>): Promise<BlogPost> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.createPost(post)
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...post,
        likes_count: 0,
        views_count: 0
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update blog post (admin only)
  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.updatePost(id, updates)
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete blog post (admin only)
  async deletePost(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.deletePost(id)
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.incrementViews(id)
    }

    const { error } = await supabase.rpc('increment_post_views', { post_id: id })
    if (error) console.error('Error incrementing views:', error)
  },

  // Like/unlike post
  async toggleLike(postId: string, userIp: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.toggleLike(postId, userIp)
    }

    // Check if user already liked this post
    const { data: existingLike } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_ip', userIp)
      .single()

    if (existingLike) {
      // Unlike
      await supabase
        .from('blog_likes')
        .delete()
        .eq('id', existingLike.id)
      
      await supabase.rpc('decrement_post_likes', { post_id: postId })
      return false
    } else {
      // Like
      await supabase
        .from('blog_likes')
        .insert([{ post_id: postId, user_ip: userIp }])
      
      await supabase.rpc('increment_post_likes', { post_id: postId })
      return true
    }
  },

  // Check if user liked post
  async hasUserLiked(postId: string, userIp: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.hasUserLiked(postId, userIp)
    }

    const { data } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_ip', userIp)
      .single()
    
    return !!data
  }
}