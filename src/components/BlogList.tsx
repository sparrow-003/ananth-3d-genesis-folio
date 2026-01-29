import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, Tag } from 'lucide-react'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import BlogCard from './BlogCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  const [posts, setPosts] = useState<BlogPostType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true)
      const data = await blogAPI.getPosts()
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

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
        post.excerpt.toLowerCase().includes(term)
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
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 text-foreground tracking-tighter uppercase">
          Blog
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-serif px-4">
          Thoughts, ideas, and updates from the digital frontier.
        </p>
      </motion.div>

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
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {filteredPosts.map((post, index) => (
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
      )}
    </div>
  )
})

BlogList.displayName = 'BlogList'

export default BlogList