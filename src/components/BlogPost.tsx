import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Eye, Share2, Calendar, Tag, Clock, Send, MessageSquare, X } from 'lucide-react'
import { BlogPost as BlogPostType, BlogComment, blogAPI } from '@/lib/supabase'
import { getUserIP } from '@/lib/auth'
import { parseMarkdown } from '@/lib/markdown'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'sonner'

interface BlogPostProps {
  post: BlogPostType
  onBack: () => void
}

const BlogPost = ({ post, onBack }: BlogPostProps) => {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [loading, setLoading] = useState(false)
  
  // Comment states
  const [comments, setComments] = useState<BlogComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  
  // Share state
  const [showShareDialog, setShowShareDialog] = useState(false)
  const shareUrl = `${window.location.origin}/blog/${post.slug}`
  const [shortUrl, setShortUrl] = useState('')

  useEffect(() => {
    // Increment view count
    blogAPI.incrementViews(post.id)
    checkIfLiked()
    loadComments()
    // Scroll to top when post loads
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Generate Short URL
    const generateShortUrl = async () => {
      try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(shareUrl)}`)
        if (response.ok) {
          const text = await response.text()
          setShortUrl(text)
        } else {
          setShortUrl(shareUrl)
        }
      } catch (e) {
        setShortUrl(shareUrl)
      }
    }
    generateShortUrl()
  }, [post.id, shareUrl])

  const loadComments = async () => {
    try {
      const data = await blogAPI.getComments(post.id)
      setComments(data)
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }

  const checkIfLiked = async () => {
    try {
      // First check local storage for immediate feedback
      const localLiked = localStorage.getItem(`liked_${post.id}`) === 'true'
      if (localLiked) {
        setLiked(true)
      }
      
      const userIP = await getUserIP()
      const hasLiked = await blogAPI.hasUserLiked(post.id, userIP)
      
      // Sync local storage with server truth
      if (hasLiked !== localLiked) {
        setLiked(hasLiked)
        localStorage.setItem(`liked_${post.id}`, String(hasLiked))
      }
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const handleLike = async () => {
    if (loading) return

    setLoading(true)
    try {
      const userIP = await getUserIP()
      
      // Optimistic update
      const newLikedState = !liked
      setLiked(newLikedState)
      setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)
      localStorage.setItem(`liked_${post.id}`, String(newLikedState))

      const isLiked = await blogAPI.toggleLike(post.id, userIP)
      
      // Revert if server response differs (though toggleLike returns the new state)
      if (isLiked !== newLikedState) {
        setLiked(isLiked)
        setLikesCount(prev => isLiked ? prev + 1 : prev - 1)
        localStorage.setItem(`liked_${post.id}`, String(isLiked))
      }

      toast.success(newLikedState ? 'Post liked!' : 'Like removed')
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to update like')
      // Revert optimistic update
      setLiked(!liked)
      setLikesCount(prev => !liked ? prev + 1 : prev - 1)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return

    // Check comment limit (5 per user per post)
    const userCommentsKey = `user_comments_count_${post.id}`
    const userCommentCount = parseInt(localStorage.getItem(userCommentsKey) || '0')
    
    if (userCommentCount >= 5) {
      toast.error('You have reached the limit of 5 comments per post.')
      return
    }

    try {
      const createdComment = await blogAPI.createComment(
        post.id,
        commentAuthor || 'Anonymous',
        newComment
      )

      if (createdComment) {
        setComments([createdComment, ...comments])
        
        // Update user count
        localStorage.setItem(userCommentsKey, (userCommentCount + 1).toString())
        
        setNewComment('')
        toast.success('Comment posted!')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('Failed to post comment')
    }
  }

  const handleShare = () => {
    setShowShareDialog(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link')
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
      className="max-w-4xl mx-auto px-4 py-8 lg:py-12 font-sans"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-8 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-all rounded-none group"
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
                className="bg-zinc-100 text-zinc-600 border-zinc-200 uppercase tracking-widest text-[10px] rounded-none px-2 py-1 font-bold"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 mb-6 leading-[1.1] tracking-tight">
          {post.title}
        </h1>

        <p className="text-xl md:text-2xl text-zinc-500 mb-8 leading-relaxed font-serif italic border-l-2 border-orange-500 pl-6">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-8 pb-8 border-b border-zinc-100 uppercase tracking-widest font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.created_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{estimateReadingTime(post.content)} MIN READ</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{post.views_count + 1} VIEWS</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="aspect-video overflow-hidden mb-12 shadow-sm border border-zinc-100">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg prose-zinc max-w-none mb-12 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-img:rounded-none">
        <div
          className="blog-content leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-t border-zinc-200">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className={`flex items-center gap-2 rounded-none px-6 py-6 transition-all border-2 ${liked
              ? 'text-red-600 border-red-600 bg-red-50'
              : 'text-zinc-500 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'
              }`}
            onClick={handleLike}
            disabled={loading}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-bold text-lg">{likesCount}</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 text-zinc-500 border-zinc-200 border-2 hover:border-zinc-900 hover:text-zinc-900 rounded-none px-6 py-6 transition-all"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-xs">Share</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onBack}
          className="text-zinc-500 hover:text-black hover:bg-zinc-100 transition-all rounded-none group px-6 py-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Button>
      </div>

      {/* Comments Section */}
      {post.allow_comments && (
        <div className="mt-12 pt-12 border-t border-zinc-200">
          <h3 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            Comments ({comments.length})
          </h3>

          <form onSubmit={handleCommentSubmit} className="mb-12 space-y-4 bg-zinc-50 p-8 border border-zinc-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Your Name (Optional)"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:ring-0 rounded-none"
              />
            </div>
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 min-h-[100px] focus:border-orange-500 focus:ring-0 rounded-none"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 rounded-none uppercase tracking-widest text-xs h-12"
                disabled={!newComment.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </form>

          <div className="space-y-6">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-l-2 border-zinc-200 p-6 hover:border-orange-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-sm">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm uppercase tracking-wide">{comment.author}</h4>
                      <span className="text-xs text-zinc-400">{formatDate(comment.created_at)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed font-serif">{comment.content}</p>
              </motion.div>
            ))}
            
            {comments.length === 0 && (
              <div className="text-center py-12 text-zinc-400 italic font-serif">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-white border border-zinc-200 text-zinc-900 sm:max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-zinc-900">Share this post</DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Scan the QR code or copy the link below
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            <div className="bg-white p-4 border border-zinc-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=000000&bgcolor=ffffff`} 
                alt="QR Code" 
                className="w-48 h-48"
              />
            </div>
            
            <div className="w-full space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Short Link</label>
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value={shortUrl || shareUrl} 
                  className="bg-zinc-50 border-zinc-200 text-zinc-600 font-mono text-xs rounded-none"
                />
                <Button onClick={() => {
                  navigator.clipboard.writeText(shortUrl || shareUrl)
                  toast.success('Link copied!')
                }} size="icon" className="shrink-0 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-200 rounded-none">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.article>
  )
}

export default BlogPost