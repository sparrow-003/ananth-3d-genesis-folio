import React, { useState, useEffect, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, Share2, Calendar, User, MapPin, MessageSquare } from 'lucide-react'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import { getUserIP } from '@/lib/auth'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BlogCardProps {
  post: BlogPostType
  onClick: () => void
}

const BlogCard = memo(({ post, onClick }: BlogCardProps) => {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkIfLiked()
  }, [post.id])

  const checkIfLiked = useCallback(async () => {
    try {
      const userIP = await getUserIP()
      const hasLiked = await blogAPI.hasUserLiked(post.id, userIP)
      setLiked(hasLiked)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }, [post.id])

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
      month: 'short',
      day: 'numeric'
    })
  }, [])

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="h-full cursor-pointer bg-card border border-border hover:border-primary/50 transition-all duration-300 group/card overflow-hidden rounded-none shadow-lg hover:shadow-primary/10"
        onClick={onClick}
      >
        {post.featured_image && (
          <div className="aspect-video overflow-hidden bg-muted">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
        )}

        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-primary font-bold mb-2 sm:mb-3 uppercase tracking-wider">
            <div className="flex items-center gap-1 sm:gap-2">
              <User className="w-3 h-3" />
              <span>{post.author_name || 'Ananth'}</span>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.created_at)}</span>
            </div>

            {post.location && (
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="hidden sm:inline">{post.location}</span>
              </div>
            )}
          </div>

          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight group-hover/card:text-primary transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mb-3 sm:mb-4 font-serif">
            {post.excerpt}
          </p>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-muted text-muted-foreground border border-border text-[9px] sm:text-[10px] py-0 px-1.5 sm:px-2 uppercase tracking-wider rounded-none hover:bg-primary/10 hover:text-primary"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-[9px] sm:text-xs rounded-none border-border text-muted-foreground">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{post.views_count}</span>
              </div>

              <div className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{post.comments_count || 0}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 p-0 h-auto hover:bg-transparent ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                onClick={handleLike}
                disabled={loading}
              >
                <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${liked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary p-0 h-auto hover:bg-transparent"
              onClick={handleShare}
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
})

BlogCard.displayName = 'BlogCard'

export default BlogCard