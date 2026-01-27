import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, Tag, Sparkles } from 'lucide-react'
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

const BlogList = ({ onPostSelect }: BlogListProps) => {
  const [posts, setPosts] = useState<BlogPostType[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPostType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    filterAndSortPosts()
  }, [posts, searchTerm, selectedTag, sortBy])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await blogAPI.getPosts()
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortPosts = () => {
    let filtered = [...posts]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags && post.tags.includes(selectedTag)
      )
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'popular':
          return (b.likes_count + b.views_count) - (a.likes_count + a.views_count)
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredPosts(filtered)
  }

  const getAllTags = () => {
    const tagSet = new Set<string>()
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTag('')
    setSortBy('newest')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-xs">The Digital Frame</span>
          <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-gradient tracking-tighter uppercase italic">
          Blog
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Our blog is a place where we share our thoughts and ideas on a variety of topics.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-dark/50 border-emerald-500/20 text-light placeholder:text-gray-500 focus:border-emerald-500/50 transition-all"
            />
          </div>

          {/* Tag Filter */}
          <Select value={selectedTag || "all"} onValueChange={(value) => setSelectedTag(value === "all" ? "" : value)}>
            <SelectTrigger className="w-full md:w-48 bg-dark/50 border-emerald-500/20 text-light hover:border-emerald-500/40 transition-all">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent className="bg-black border-emerald-500/20 z-50">
              <SelectItem value="all">All tags</SelectItem>
              {getAllTags().map(tag => (
                <SelectItem key={tag} value={tag}>
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-emerald-400" />
                    {tag}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-48 bg-dark/50 border-emerald-500/20 text-light hover:border-emerald-500/40 transition-all">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-black border-emerald-500/20">
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
              className="border-emerald-500/20 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedTag) && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Search: "{searchTerm}"
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Tag className="w-3 h-3 mr-1" />
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
          <p className="text-gray-400 text-lg">
            {posts.length === 0
              ? "No blog posts yet. Check back soon!"
              : "No posts match your filters. Try adjusting your search criteria."
            }
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
}

export default BlogList