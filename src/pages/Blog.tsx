import { useState, useEffect, Suspense, lazy } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import { toast } from 'sonner'

// Lazy load components for better performance
const BlogList = lazy(() => import('@/components/BlogList'))
const BlogPost = lazy(() => import('@/components/BlogPost'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
  </div>
)

const Blog = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (slug) {
      loadPostBySlug(slug)
    } else {
      setSelectedPost(null)
    }
  }, [slug])

  const loadPostBySlug = async (postSlug: string) => {
    setLoading(true)
    try {
      const post = await blogAPI.getPostBySlug(postSlug)
      if (post) {
        setSelectedPost(post)
      } else {
        toast.error('Post not found')
        navigate('/blog')
      }
    } catch (error) {
      console.error('Error loading post:', error)
      toast.error('Failed to load post')
      navigate('/blog')
    } finally {
      setLoading(false)
    }
  }

  const handlePostSelect = (post: BlogPostType) => {
    setSelectedPost(post)
    navigate(`/blog/${post.slug}`)
  }

  const handleBackToBlog = () => {
    setSelectedPost(null)
    navigate('/blog')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark/95 to-purple/10">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-dark via-dark/95 to-purple/10"
    >
      <Suspense fallback={<LoadingSpinner />}>
        {selectedPost ? (
          <BlogPost post={selectedPost} onBack={handleBackToBlog} />
        ) : (
          <BlogList onPostSelect={handlePostSelect} />
        )}
      </Suspense>
    </motion.div>
  )
}

export default Blog