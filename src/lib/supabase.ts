import { createClient } from '@supabase/supabase-js'
import { mockBlogAPI } from './mockData'

// For now, we'll use placeholder values - you'll need to replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = supabaseUrl !== 'https://your-project.supabase.co' && supabaseAnonKey !== 'your-anon-key'

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  featured_image?: string
  tags: string[]
  published: boolean
  publish_at?: string
  created_at: string
  updated_at: string
  likes_count: number
  views_count: number
  comments_count?: number
  allow_comments: boolean
  author_name: string
  location?: string
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

export interface BlogStats {
  totalViews: number
  totalLikes: number
  postCount: number
  commentCount: number
}

// Blog API functions - will use mock data if Supabase is not configured
export const blogAPI = {
  // Get all published blog posts (public)
  async getPosts(): Promise<BlogPost[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getPosts()
    }

    try {
      const nowIso = new Date().toISOString()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .or(`publish_at.lte.${nowIso},publish_at.is.null`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  },

  // Get ALL posts (admin)
  async getAllPosts(): Promise<BlogPost[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getAllPosts()
    }

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_comments(count)')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(post => ({
        ...post,
        comments_count: post.blog_comments?.[0]?.count || 0,
        blog_comments: undefined // Remove the raw response
      })) || []
    } catch (error) {
      console.error('Error fetching all posts:', error)
      return []
    }
  },

  // Get single blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getPostBySlug(slug)
    }

    try {
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
    } catch (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }
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

    try {
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
    } catch (error) {
      console.error('Error toggling like:', error)
      return false
    }
  },

  // Check if user liked post
  async hasUserLiked(postId: string, userIp: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.hasUserLiked(postId, userIp)
    }

    try {
      const { data } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_ip', userIp)
        .single()

      return !!data
    } catch (error) {
      return false
    }
  },

  // Get comments for a post
  async getComments(postId: string): Promise<BlogComment[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getComments(postId)
    }

    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  },

  // Get ALL comments (admin)
  async getAllComments(): Promise<(BlogComment & { post_title?: string })[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getAllComments()
    }

    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*, blog_posts(title)')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(item => ({
        ...item,
        post_title: item.blog_posts?.title
      })) || []
    } catch (error) {
      console.error('Error fetching all comments:', error)
      return []
    }
  },

  // Create a comment
  async createComment(postId: string, author: string, content: string): Promise<BlogComment | null> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.createComment(postId, author, content)
    }

    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert([{ post_id: postId, author, content }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating comment:', error)
      return null
    }
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
    
    try {
      const { count, error } = await supabase
        .from('blog_comments')
        .select('*', { count: 'exact', head: true })

      if (error) return 0
      return count || 0
    } catch (error) {
      return 0
    }
  },

  // Get aggregated stats for dashboard
  async getStats(): Promise<BlogStats> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getStats()
    }

    try {
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('views_count, likes_count')

      if (postsError) throw postsError

      const totalViews = postsData?.reduce((acc, p) => acc + (p.views_count || 0), 0) || 0
      const totalLikes = postsData?.reduce((acc, p) => acc + (p.likes_count || 0), 0) || 0
      const postCount = postsData?.length || 0

      const commentCount = await this.getTotalCommentsCount()

      return {
        totalViews,
        totalLikes,
        postCount,
        commentCount
      }
    } catch (error) {
      console.error('Error fetching blog stats:', error)
      return { totalViews: 0, totalLikes: 0, postCount: 0, commentCount: 0 }
    }
  }
}
