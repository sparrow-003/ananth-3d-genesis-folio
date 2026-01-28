import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Eye, Share2, Calendar, Tag, Clock, Send, MessageSquare, X } from 'lucide-react'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
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

interface Comment {
  id: string
  text: string
  date: string
  author: string
}

interface BlogPostProps {
  post: BlogPostType
  onBack: () => void
}

const BlogPost = ({ post, onBack }: BlogPostProps) => {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [loading, setLoading] = useState(false)
  
  // Comment states
  const [comments, setComments] = useState<Comment[]>([])
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

  const loadComments = () => {
    const storedComments = localStorage.getItem(`comments_${post.id}`)
    if (storedComments) {
      setComments(JSON.parse(storedComments))
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return

    // Check comment limit (5 per user per post)
    const userCommentsKey = `user_comments_count_${post.id}`
    const userCommentCount = parseInt(localStorage.getItem(userCommentsKey) || '0')
    
    if (userCommentCount >= 5) {
      toast.error('You have reached the limit of 5 comments per post.')
      return
    }

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      text: newComment,
      date: new Date().toISOString(),
      author: commentAuthor || 'Anonymous'
    }

    const updatedComments = [newCommentObj, ...comments]
    setComments(updatedComments)
    localStorage.setItem(`comments_${post.id}`, JSON.stringify(updatedComments))
    
    // Update user count
    localStorage.setItem(userCommentsKey, (userCommentCount + 1).toString())
    
    setNewComment('')
    toast.success('Comment posted!')
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
      className="max-w-4xl mx-auto px-4 py-8 lg:py-12"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-8 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all rounded-full group"
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
                className="bg-zinc-800 text-zinc-300 border-zinc-700 uppercase tracking-tighter text-[10px]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
          {post.title}
        </h1>

        <p className="text-xl md:text-2xl text-zinc-400 mb-8 leading-relaxed font-medium italic border-l-4 border-indigo-500/50 pl-6">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 mb-8 pb-8 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-zinc-400">{formatDate(post.created_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-zinc-400">{estimateReadingTime(post.content)} min read</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="text-zinc-400">{post.views_count + 1} views</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="aspect-video overflow-hidden rounded-2xl mb-12 shadow-2xl shadow-black/50 border border-zinc-800">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert max-w-none mb-12 prose-headings:text-white prose-p:text-zinc-300 prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-strong:text-white">
        <div
          className="blog-content leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-t border-zinc-800">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className={`flex items-center gap-2 rounded-full px-6 py-6 transition-all ${liked
              ? 'text-red-500 border-red-500/50 bg-red-500/10'
              : 'text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800'
              }`}
            onClick={handleLike}
            disabled={loading}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-bold text-lg">{likesCount}</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 rounded-full px-6 py-6 transition-all"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            <span className="font-bold">Share Article</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onBack}
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all rounded-full group px-6 py-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Button>
      </div>

      {/* Comments Section */}
      <div className="mt-12 pt-12 border-t border-zinc-800">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-indigo-500" />
          Comments ({comments.length})
        </h3>

        <form onSubmit={handleCommentSubmit} className="mb-12 space-y-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Your Name (Optional)"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="bg-black border-zinc-800 text-white placeholder:text-zinc-600 focus:border-indigo-500/50"
            />
          </div>
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-black border-zinc-800 text-white placeholder:text-zinc-600 min-h-[100px] focus:border-indigo-500/50"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8"
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
              className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{comment.author}</h4>
                    <span className="text-xs text-zinc-500">{formatDate(comment.date)}</span>
                  </div>
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{comment.text}</p>
            </motion.div>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center py-12 text-zinc-600 italic">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-zinc-950 border border-zinc-800 text-zinc-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white">Share this post</DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Scan the QR code or copy the link below
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            <div className="bg-white p-4 rounded-xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=000000&bgcolor=ffffff`} 
                alt="QR Code" 
                className="w-48 h-48"
              />
            </div>
            
            <div className="w-full space-y-2">
              <label className="text-xs font-bold text-zinc-500/50 uppercase tracking-wider ml-1">Short Link</label>
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value={shortUrl || shareUrl} 
                  className="bg-zinc-900/20 border-zinc-500/20 text-zinc-300 font-mono text-xs"
                />
                <Button onClick={() => {
                  navigator.clipboard.writeText(shortUrl || shareUrl)
                  toast.success('Link copied!')
                }} size="icon" className="shrink-0 bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 border border-zinc-500/20">
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