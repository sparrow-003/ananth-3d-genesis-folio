import React, { useState, useEffect, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, Share2, Calendar, User, MapPin, MessageSquare, ArrowRight, Clock } from 'lucide-react'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import { getUserIP } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface BlogCardProps {
  post: BlogPostType
  onClick: () => void
  featured?: boolean
}

const BlogCard = memo(({ post, onClick, featured = false }: BlogCardProps) => {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [loading, setLoading] = useState(false)
  const [hasCheckedLike, setHasCheckedLike] = useState(false)

  // Lazy check like status only when user interacts or card is visible for a while
  const checkIfLiked = useCallback(async () => {
    if (hasCheckedLike) return
    try {
      const userIP = await getUserIP()
      const hasLiked = await blogAPI.hasUserLiked(post.id, userIP)
      setLiked(hasLiked)
      setHasCheckedLike(true)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }, [post.id, hasCheckedLike])

  // Defer like check to after initial render for performance
  useEffect(() => {
    const timer = setTimeout(checkIfLiked, 500)
    return () => clearTimeout(timer)
  }, [checkIfLiked])

  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
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
  }, [loading, post.id])

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/blog/${post.slug}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard!')
      } catch {
        toast.error('Failed to share')
      }
    }
  }, [post.slug, post.title, post.excerpt])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  const readTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1000)) + ' min read'

  return (
    <motion.div
      // Scale instead of translate to avoid “jumping/moving” feel on hover.
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      style={{ willChange: 'transform' }}
      className={cn(
        "group/card relative overflow-hidden glass-card cursor-pointer border border-white/10 hover:border-primary/50",
        featured ? "md:grid md:grid-cols-2 gap-0" : "flex flex-col h-full"
      )}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden bg-muted",
        featured ? "h-64 md:h-full min-h-[300px]" : "aspect-[16/9]"
      )}>
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-4xl">✨</span>
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
        
        {/* Category Badge over Image */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-md border-none px-3 py-1 shadow-lg shadow-primary/20">
              {post.tags[0]}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={cn(
        "relative flex flex-col p-6 z-10",
        featured ? "justify-center md:p-8 lg:p-12 bg-background/30 backdrop-blur-sm" : "flex-1 bg-transparent"
      )}>
        {/* Meta Header */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-primary/50" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className={cn(
          "font-bold text-foreground mb-3 leading-tight group-hover/card:text-primary transition-colors duration-300",
          featured ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl line-clamp-2"
        )}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className={cn(
          "text-muted-foreground font-serif leading-relaxed mb-6",
          featured ? "text-base sm:text-lg line-clamp-3 md:line-clamp-4" : "text-sm line-clamp-3 flex-1"
        )}>
          {post.excerpt}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2 gap-1.5 hover:bg-primary/10 transition-colors",
                liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              )}
              onClick={handleLike}
              disabled={loading}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-current")} />
              <span className="text-xs font-medium">{likesCount}</span>
            </Button>

            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
              <Eye className="w-4 h-4" />
              <span>{post.views_count}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary rounded-full"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <span className={cn(
              "flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary group-hover/card:translate-x-1 transition-transform duration-300",
              featured ? "text-sm" : ""
            )}>
              Read Post <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

BlogCard.displayName = 'BlogCard'

export default BlogCard