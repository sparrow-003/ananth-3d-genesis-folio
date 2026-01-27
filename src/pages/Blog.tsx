import { useState, useEffect, Suspense, lazy } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Lazy load components
const BlogList = lazy(() => import('@/components/BlogList'))
const BlogPost = lazy(() => import('@/components/BlogPost'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
    </div>
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
        // Increment view count when post is accessed
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
  }

  const handlePostSelect = (post: BlogPostType) => {
    setSelectedPost(post)
    navigate(`/blog/${post.slug}`)
  }

  const handleBackToBlog = () => {
    setSelectedPost(null)
    navigate('/blog')
  }

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Background gradients aligned with theme */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-teal-950/20 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)] -z-10" />

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
              transition={{ duration: 0.4, ease: "easeOut" }}
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
}

export default Blog