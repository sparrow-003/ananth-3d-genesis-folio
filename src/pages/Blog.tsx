import { useState, useEffect, Suspense, lazy, memo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

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

import { BlogPostSkeleton, BlogListSkeleton } from '@/components/skeletons/BlogSkeleton'

const Blog = memo(() => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null)

  // Fetch single post when slug is provided
  const {
    data: fetchedPost,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => blogAPI.getPostBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // Stay fresh for 5 minutes
    gcTime: 1000 * 60 * 15, // Cache for 15 minutes
    retry: 1,
    retryDelay: 1000
  })

  // Handle post data and view tracking
  useEffect(() => {
    if (slug && fetchedPost) {
      setSelectedPost(fetchedPost)
      blogAPI.incrementViews(fetchedPost.id).catch(console.error)
    } else if (!slug) {
      setSelectedPost(null)
    }
  }, [slug, fetchedPost])

  // Handle errors and not found cases
  useEffect(() => {
    if (isError && slug) {
      console.error('Error loading post:', error)
    }
    if (slug && !isLoading && !fetchedPost && !isError) {
      toast.error('Post not found')
      navigate('/blog')
    }
  }, [isError, slug, isLoading, fetchedPost, navigate, error])

  const handlePostSelect = useCallback((post: BlogPostType) => {
    setSelectedPost(post)
    navigate(`/blog/${post.slug}`)
  }, [navigate])

  const handleBackToBlog = useCallback(() => {
    setSelectedPost(null)
    navigate('/blog')
  }, [navigate])

  const handleRetry = useCallback(() => {
    if (slug) {
      refetch()
    } else {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  }, [slug, refetch, queryClient])

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
              key="loading-slug"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
              <BlogPostSkeleton />
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto px-4 py-12"
            >
              <Alert className="border-red-500/20 bg-red-500/5 text-red-500 backdrop-blur-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex flex-col gap-4">
                  <span className="font-medium text-lg">Failed to load the blog post.</span>
                  <span className="text-sm opacity-70">This might be due to a network issue or the post may not exist.</span>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      className="text-red-500 border-red-500/30 hover:bg-red-500/10 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/blog')}
                      className="text-red-500 border-red-500/30 hover:bg-red-500/10 transition-colors"
                    >
                      Back to Blog
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          ) : (
            <motion.div
              key={selectedPost ? `post-${selectedPost.id}` : 'list'}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1] // Custom easeOutExpo
              }}
            >
              <Suspense fallback={slug ? <BlogPostSkeleton /> : <BlogListSkeleton />}>
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
    </div>
  )
})

Blog.displayName = 'Blog'

export default Blog