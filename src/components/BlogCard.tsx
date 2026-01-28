import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, Share2, Calendar, Tag } from 'lucide-react'
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

const BlogCard = ({ post, onClick }: BlogCardProps) => {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkIfLiked()
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

  const handleLike = async (e: React.MouseEvent) => {
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
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="h-full cursor-pointer bg-white border border-zinc-200 hover:border-orange-500 transition-all duration-300 group/card overflow-hidden rounded-none shadow-sm hover:shadow-md"
        onClick={onClick}
      >
        {post.featured_image && (
          <div className="aspect-video overflow-hidden">
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
          </div>
        )}

        <CardHeader className="pb-3 px-6 pt-6">
          <div className="flex flex-wrap items-center gap-4 text-xs text-orange-600 font-bold mb-3 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span>{post.author_name || 'Ananth'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.created_at)}</span>
            </div>

            {post.location && (
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-3 h-3" />
                <span>{post.location}</span>
              </div>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-2 leading-tight group-hover/card:text-orange-600 transition-colors duration-300">
            {post.title}
          </h3>

          <p className="text-zinc-500 line-clamp-2 text-sm leading-relaxed mb-4 font-serif">
            {post.excerpt}
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-0">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] py-0 px-2 uppercase tracking-wider rounded-none hover:bg-zinc-200"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs rounded-none border-zinc-200 text-zinc-500">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views_count}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 p-0 h-auto hover:bg-transparent ${liked ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'
                  }`}
                onClick={handleLike}
                disabled={loading}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-orange-600 p-0 h-auto hover:bg-transparent"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default BlogCard