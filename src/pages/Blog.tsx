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
      // Track view asynchronously
      blogAPI.incrementViews(fetchedPost.id).catch(console.error)
    } else if (!slug) {
      setSelectedPost(null)
    }
  }, [slug, fetchedPost])

  // Handle errors and not found cases
  useEffect(() => {
    if (isError && slug) {
      console.error('Error loading post:', error)
      // Don't navigate away immediately, let user try to refresh
    }
    if (slug && !isLoading && !fetchedPost && !isError) {
      // Post not found after loading completed
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
      // Refresh the posts list
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
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSpinner />
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto px-4 py-12"
            >
              <Alert className="border-red-200 bg-red-50 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex flex-col gap-3">
                  <span>
                    Failed to load the blog post. This might be due to a network issue or the post may not exist.
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRetry}
                      className="text-red-800 border-red-300 hover:bg-red-100"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/blog')}
                      className="text-red-800 border-red-300 hover:bg-red-100"
                    >
                      Back to Blog
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
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