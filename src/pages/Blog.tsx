import { useState, useEffect, Suspense, lazy, memo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Lazy load components for better performance
const BlogList = lazy(() => import('@/components/BlogList'))
const BlogPost = lazy(() => import('@/components/BlogPost'))

const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-secondary/50 animate-reverse-spin" />
    </div>
  </div>
))

LoadingSpinner.displayName = 'LoadingSpinner'

const Blog = memo(() => {
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

  const loadPostBySlug = useCallback(async (postSlug: string) => {
    setLoading(true)
    try {
      const post = await blogAPI.getPostBySlug(postSlug)
      if (post) {
        setSelectedPost(post)
        blogAPI.incrementViews(post.id)
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
  }, [navigate])

  const handlePostSelect = useCallback((post: BlogPostType) => {
    setSelectedPost(post)
    navigate(`/blog/${post.slug}`)
  }, [navigate])

  const handleBackToBlog = useCallback(() => {
    setSelectedPost(null)
    navigate('/blog')
  }, [navigate])

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background gradient matching main site */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />
      
      <Navbar />

      <main className="pt-24 pb-12 relative z-10 min-h-[80vh]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSpinner />
            </motion.div>
          ) : (
            <motion.div
              key={selectedPost ? 'post' : 'list'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                {selectedPost ? (
                  <BlogPost post={selectedPost} onBack={handleBackToBlog} />
                ) : (
                  <BlogList onPostSelect={handlePostSelect} />
                )}
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
})

Blog.displayName = 'Blog'

export default Blog