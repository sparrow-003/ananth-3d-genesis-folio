import { useState, useEffect } from 'react'
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
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 text-gray-400 hover:text-purple"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Button>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="aspect-video overflow-hidden rounded-lg mb-8">
          <img 
            src={post.featured_image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-light mb-4 leading-tight">
          {post.title}
        </h1>
        
        <p className="text-xl text-gray-300 mb-6 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{estimateReadingTime(post.content)} min read</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{post.views_count + 1} views</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-purple/20 text-purple border-purple/30"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Separator className="bg-purple/20" />
      </header>

      {/* Content */}
      <div className="prose prose-invert prose-purple max-w-none mb-8">
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-purple/20">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 ${
              liked 
                ? 'text-red-500 border-red-500 hover:bg-red-500/10' 
                : 'text-gray-400 border-gray-600 hover:text-red-500 hover:border-red-500'
            }`}
            onClick={handleLike}
            disabled={loading}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-gray-400 border-gray-600 hover:text-purple hover:border-purple"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-400 hover:text-purple"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>
      </div>
    </motion.article>
  )
}

export default BlogPost