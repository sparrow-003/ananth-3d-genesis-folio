import React, { useState, useMemo, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, Calendar, Tag, RefreshCw, AlertCircle } from 'lucide-react'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import BlogCard from './BlogCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BlogListProps {
  onPostSelect: (post: BlogPostType) => void
}

const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
    </div>
  </div>
))

LoadingSpinner.displayName = 'LoadingSpinner'

const BlogList = memo(({ onPostSelect }: BlogListProps) => {
  const { 
    data: posts = [], 
    isLoading: loading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['posts'],
    queryFn: blogAPI.getPosts,
    refetchInterval: 60000, // Refetch every minute for new posts
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    let filtered = [...posts]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
      )
    }

    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags && post.tags.includes(selectedTag)
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'popular':
          return (b.likes_count + b.views_count) - (a.likes_count + a.views_count)
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [posts, searchTerm, selectedTag, sortBy])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedTag('')
    setSortBy('newest')
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleTagChange = useCallback((value: string) => {
    setSelectedTag(value === "all" ? "" : value)
  }, [])

  const handleSortChange = useCallback((value: 'newest' | 'oldest' | 'popular') => {
    setSortBy(value)
  }, [])

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 md:mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs">The Journal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 text-foreground tracking-tighter uppercase">
          Blog
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-serif px-4">
          Thoughts, ideas, and updates from the digital frontier.
        </p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-8 border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load blog posts. Please try refreshing the page.
            <Button variant="link" className="p-0 h-auto ml-2 text-red-800" onClick={handleRefresh}>
              Refresh
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-none focus:ring-0 transition-all h-11"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Tag Filter */}
            <Select value={selectedTag || "all"} onValueChange={handleTagChange}>
              <SelectTrigger className="w-full sm:w-44 bg-card border-border text-foreground hover:border-primary rounded-none transition-all focus:ring-0 h-11">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50 rounded-none">
                <SelectItem value="all">All tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-primary" />
                      {tag}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-44 bg-card border-border text-foreground hover:border-primary rounded-none transition-all focus:ring-0 h-11">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border rounded-none">
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Newest first
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Oldest first
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    Most popular
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="border-border text-muted-foreground hover:text-primary hover:border-primary rounded-none hover:bg-primary/10 h-11 w-11"
              title="Refresh posts"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            {/* Clear Filters */}
            {(searchTerm || selectedTag || sortBy !== 'newest') && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-border text-muted-foreground hover:text-primary hover:border-primary rounded-none hover:bg-primary/10 h-11 w-full sm:w-auto"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedTag) && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="bg-card text-foreground border border-border rounded-none">
                Search: "{searchTerm}"
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="bg-card text-foreground border border-border rounded-none">
                <Tag className="w-3 h-3 mr-1 text-primary" />
                {selectedTag}
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        {posts.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {filteredPosts.length === posts.length 
              ? `Showing all ${posts.length} posts`
              : `Showing ${filteredPosts.length} of ${posts.length} posts`
            }
          </div>
        )}
      </motion.div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg font-serif italic">
            {posts.length === 0
              ? "No blog posts yet. Check back soon!"
              : "No posts match your filters."
            }
          </p>
          {posts.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="mt-4"
            >
              Clear filters
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-12">
          {/* Featured Post Section */}
          {!searchTerm && !selectedTag && sortBy === 'newest' && filteredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                 <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary glow-text">Featured Story</span>
                 <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              </div>
              
              <BlogCard
                post={filteredPosts[0]}
                onClick={() => onPostSelect(filteredPosts[0])}
                featured={true}
              />
            </motion.div>
          )}

          {/* Regular Posts Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {(!searchTerm && !selectedTag && sortBy === 'newest' ? filteredPosts.slice(1) : filteredPosts).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
              >
                <BlogCard
                  post={post}
                  onClick={() => onPostSelect(post)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
})

BlogList.displayName = 'BlogList'

export default BlogList