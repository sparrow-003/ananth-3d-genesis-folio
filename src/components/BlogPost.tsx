import React, { useState, useEffect, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Eye, Share2, Calendar, Clock, Send, MessageSquare } from 'lucide-react'
import { BlogPost as BlogPostType, BlogComment, blogAPI } from '@/lib/supabase'
import { getUserIP } from '@/lib/auth'
import { parseMarkdown } from '@/lib/markdown'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

const BlogPost = memo(({ post, onBack }: BlogPostProps) => {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState<BlogComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const [showShareDialog, setShowShareDialog] = useState(false)
  
  const shareUrl = `${window.location.origin}/blog/${post.slug}`
  const [shortUrl, setShortUrl] = useState(shareUrl)

  useEffect(() => {
    blogAPI.incrementViews(post.id)
    checkIfLiked()
    loadComments()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Generate short URL
    fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(shareUrl)}`)
      .then(res => res.ok ? res.text() : shareUrl)
      .then(setShortUrl)
      .catch(() => setShortUrl(shareUrl))
  }, [post.id, shareUrl])

  const loadComments = useCallback(async () => {
    try {
      const data = await blogAPI.getComments(post.id)
      setComments(data)
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }, [post.id])

  const checkIfLiked = useCallback(async () => {
    try {
      const localLiked = localStorage.getItem(`liked_${post.id}`) === 'true'
      if (localLiked) setLiked(true)
      
      const userIP = await getUserIP()
      const hasLiked = await blogAPI.hasUserLiked(post.id, userIP)
      
      if (hasLiked !== localLiked) {
        setLiked(hasLiked)
        localStorage.setItem(`liked_${post.id}`, String(hasLiked))
      }
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }, [post.id])

  const handleLike = useCallback(async () => {
    if (loading) return
    setLoading(true)
    
    const newLikedState = !liked
    setLiked(newLikedState)
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)
    localStorage.setItem(`liked_${post.id}`, String(newLikedState))

    try {
      const userIP = await getUserIP()
      const isLiked = await blogAPI.toggleLike(post.id, userIP)
      
      if (isLiked !== newLikedState) {
        setLiked(isLiked)
        setLikesCount(prev => isLiked ? prev + 1 : prev - 1)
        localStorage.setItem(`liked_${post.id}`, String(isLiked))
      }
      toast.success(newLikedState ? 'Post liked!' : 'Like removed')
    } catch (error) {
      setLiked(!newLikedState)
      setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1)
      toast.error('Failed to update like')
    } finally {
      setLoading(false)
    }
  }, [loading, liked, post.id])

  const handleCommentSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const userCommentsKey = `user_comments_count_${post.id}`
    const userCommentCount = parseInt(localStorage.getItem(userCommentsKey) || '0')
    
    if (userCommentCount >= 5) {
      toast.error('You have reached the limit of 5 comments per post.')
      return
    }

    try {
      const createdComment = await blogAPI.createComment(post.id, commentAuthor || 'Anonymous', newComment)
      if (createdComment) {
        setComments(prev => [createdComment, ...prev])
        localStorage.setItem(userCommentsKey, (userCommentCount + 1).toString())
        setNewComment('')
        toast.success('Comment posted!')
      }
    } catch (error) {
      toast.error('Failed to post comment')
    }
  }, [newComment, commentAuthor, post.id])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  const estimateReadingTime = useCallback((content: string) => {
    const wordCount = (content || '').split(/\s+/).length
    return Math.ceil(wordCount / 200) || 1
  }, [])

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12 font-sans"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 sm:mb-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-all rounded-none group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Button>

      {/* Header */}
      <header className="mb-8 sm:mb-12">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-muted text-muted-foreground border-border uppercase tracking-widest text-[10px] rounded-none px-2 py-1 font-bold"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight tracking-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed font-serif italic border-l-2 border-primary pl-4 sm:pl-6">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border uppercase tracking-widest font-medium">
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
        <div className="aspect-video overflow-hidden mb-8 sm:mb-12 border border-border bg-muted">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg prose-invert max-w-none mb-8 sm:mb-12 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-none prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-primary prose-pre:bg-card prose-pre:border prose-pre:border-border">
        <div
          className="blog-content leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 py-6 sm:py-10 border-t border-border">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-none px-4 sm:px-6 py-5 sm:py-6 transition-all border-2 ${
              liked
                ? 'text-red-500 border-red-500 bg-red-500/10'
                : 'text-muted-foreground border-border hover:border-foreground hover:text-foreground'
            }`}
            onClick={handleLike}
            disabled={loading}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-bold text-lg">{likesCount}</span>
          </Button>

          <Button
            variant="outline"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-muted-foreground border-border border-2 hover:border-foreground hover:text-foreground rounded-none px-4 sm:px-6 py-5 sm:py-6 transition-all"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-xs">Share</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground hover:bg-muted transition-all rounded-none group px-4 sm:px-6 py-5 sm:py-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Button>
      </div>

      {/* Comments Section */}
      {post.allow_comments && (
        <div className="mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-border">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Comments ({comments.length})
          </h3>

          <form onSubmit={handleCommentSubmit} className="mb-8 sm:mb-12 space-y-4 bg-card p-4 sm:p-8 border border-border">
            <Input
              placeholder="Your Name (Optional)"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-0 rounded-none"
            />
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[100px] focus:border-primary focus:ring-0 rounded-none"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 sm:px-8 rounded-none uppercase tracking-widest text-xs h-11 sm:h-12"
                disabled={!newComment.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </form>

          <div className="space-y-4 sm:space-y-6">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border-l-2 border-border p-4 sm:p-6 hover:border-primary transition-colors"
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">{comment.author}</h4>
                      <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed font-serif">{comment.content}</p>
              </motion.div>
            ))}
            
            {comments.length === 0 && (
              <div className="text-center py-8 sm:py-12 text-muted-foreground italic font-serif">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-card border border-border text-foreground sm:max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-foreground">Share this post</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Scan the QR code or copy the link below
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="bg-white p-3 sm:p-4 border border-border">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=10B981&bgcolor=ffffff`} 
                alt="QR Code" 
                className="w-40 h-40 sm:w-48 sm:h-48"
                loading="lazy"
              />
            </div>
            
            <div className="w-full space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Short Link</label>
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value={shortUrl} 
                  className="bg-muted border-border text-muted-foreground font-mono text-xs rounded-none"
                />
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl)
                    toast.success('Link copied!')
                  }} 
                  size="icon" 
                  className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-none"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.article>
  )
})

BlogPost.displayName = 'BlogPost'

export default BlogPost