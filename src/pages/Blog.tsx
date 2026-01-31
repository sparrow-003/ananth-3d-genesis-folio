import { useState, useEffect, Suspense, lazy, memo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Lazy load ParticleBackground for performance
const ParticleBackground = lazy(() => import('@/components/ParticleBackground'))

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

  const { data: fetchedPost, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => blogAPI.getPostBySlug(slug!),
    enabled: !!slug,
    retry: 1
  })

  useEffect(() => {
    if (slug && fetchedPost) {
      setSelectedPost(fetchedPost)
      blogAPI.incrementViews(fetchedPost.id)
    } else if (!slug) {
      setSelectedPost(null)
    }
  }, [slug, fetchedPost])

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load post')
      navigate('/blog')
    }
    if (slug && !isLoading && !fetchedPost && !isError) {
       // Post not found
       // toast.error('Post not found') // Optional: might be double toast if isError also triggers
    }
  }, [isError, slug, isLoading, fetchedPost, navigate])


  const handlePostSelect = useCallback((post: BlogPostType) => {
    setSelectedPost(post)
    navigate(`/blog/${post.slug}`)
  }, [navigate])

  const handleBackToBlog = useCallback(() => {
    setSelectedPost(null)
    navigate('/blog')
  }, [navigate])

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      
      <Navbar />

      <main className="pt-24 pb-12 relative z-10 min-h-[80vh]">
        <AnimatePresence mode="wait">
          {isLoading ? (
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