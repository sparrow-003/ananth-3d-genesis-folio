import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Eye, Share2, Calendar, Tag, Clock } from 'lucide-react'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import { getUserIP } from '@/lib/auth'
import { parseMarkdown } from '@/lib/markdown'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface BlogPostProps {
  post: BlogPostType
  onBack: () => void
}

const BlogPost = ({ post, onBack }: BlogPostProps) => {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Increment view count
    blogAPI.incrementViews(post.id)
    checkIfLiked()
    // Scroll to top when post loads
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [post.id])

  const checkIfLiked = async () => {
    try {
      const userIP = await getUserIP()
      const hasLiked = await blogAPI.hasUserLiked(post.id, userIP)
      setLiked(hasLiked)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const handleLike = async () => {
    if (loading) return

    setLoading(true)
    try {
      const userIP = await getUserIP()
      const isLiked = await blogAPI.toggleLike(post.id, userIP)
      setLiked(isLiked)
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1)
      toast.success(isLiked ? 'Post liked!' : 'Like removed')
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to update like')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: `${window.location.origin}/blog/${post.slug}`
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      // Fallback to manual copy
      const textArea = document.createElement('textarea')
      textArea.value = shareData.url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Link copied to clipboard!')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = (content || '').split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes || 1
  }

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 py-8 lg:py-12"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-8 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all rounded-full group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Blog list
      </Button>

      {/* Header */}
      <header className="mb-12">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-tighter text-[10px]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight text-gradient">
          {post.title}
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed font-medium italic border-l-4 border-emerald-500/30 pl-6">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-sm text-emerald-400/60 mb-8 pb-8 border-b border-emerald-500/10">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-gray-400">{formatDate(post.created_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-gray-400">{estimateReadingTime(post.content)} min read</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="text-gray-400">{post.views_count + 1} views</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="aspect-video overflow-hidden rounded-2xl mb-12 shadow-2xl shadow-emerald-500/10 border border-emerald-500/20">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert prose-emerald max-w-none mb-12">
        <div
          className="blog-content leading-relaxed text-lg text-gray-300"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-t border-emerald-500/20">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className={`flex items-center gap-2 rounded-full px-6 py-6 transition-all ${liked
              ? 'text-red-500 border-red-500/50 bg-red-500/5'
              : 'text-emerald-400 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5'
              }`}
            onClick={handleLike}
            disabled={loading}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-bold text-lg">{likesCount}</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-full px-6 py-6 transition-all"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            <span className="font-bold">Share Article</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onBack}
          className="text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all rounded-full group px-6 py-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Button>
      </div>
    </motion.article>
  )
}

export default BlogPost