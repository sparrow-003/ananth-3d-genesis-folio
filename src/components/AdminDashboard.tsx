import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  LogOut, 
  Save,
  X,
  Image,
  Tag,
  Calendar,
  BarChart3
} from 'lucide-react'
import { BlogPost, blogAPI, supabase } from '@/lib/supabase'
import { adminAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface AdminDashboardProps {
  onLogout: () => void
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    featured_image: '',
    tags: '',
    published: false
  })

  useEffect(() => {
    loadAllPosts()
  }, [])

  const loadAllPosts = async () => {
    try {
      setLoading(true)
      // For now, use the same API as public posts since we're using mock data
      const data = await blogAPI.getPosts()
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    adminAuth.logout()
    onLogout()
    toast.success('Logged out successfully')
  }

  const openEditor = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post)
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        featured_image: post.featured_image || '',
        tags: post.tags ? post.tags.join(', ') : '',
        published: post.published
      })
    } else {
      setEditingPost(null)
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        slug: '',
        featured_image: '',
        tags: '',
        published: false
      })
    }
    setShowEditor(true)
  }

  const closeEditor = () => {
    setShowEditor(false)
    setEditingPost(null)
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      slug: '',
      featured_image: '',
      tags: '',
      published: false
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.content || !formData.excerpt) {
        toast.error('Please fill in all required fields')
        return
      }

      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        slug: formData.slug || generateSlug(formData.title)
      }

      if (editingPost) {
        await blogAPI.updatePost(editingPost.id, postData)
        toast.success('Post updated successfully!')
      } else {
        await blogAPI.createPost(postData)
        toast.success('Post created successfully!')
      }

      closeEditor()
      loadAllPosts()
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await blogAPI.deletePost(id)
      toast.success('Post deleted successfully!')
      loadAllPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const togglePublished = async (post: BlogPost) => {
    try {
      await blogAPI.updatePost(post.id, { published: !post.published })
      toast.success(`Post ${!post.published ? 'published' : 'unpublished'}!`)
      loadAllPosts()
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark/95 to-purple/10 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark/80 border border-purple/20 rounded-lg backdrop-blur-sm"
          >
            <div className="p-6 border-b border-purple/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-light">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <div className="flex items-center gap-2">
                  <Button onClick={handleSave} className="bg-purple hover:bg-purple/80">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={closeEditor}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-light">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                  className="bg-dark/50 border-purple/20 text-light"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-light">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-url-slug"
                  className="bg-dark/50 border-purple/20 text-light"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-light">Excerpt *</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post"
                  className="bg-dark/50 border-purple/20 text-light min-h-[80px]"
                />
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-light">Featured Image URL</label>
                <Input
                  value={formData.featured_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="bg-dark/50 border-purple/20 text-light"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-light">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="react, javascript, tutorial (comma separated)"
                  className="bg-dark/50 border-purple/20 text-light"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-light">Content * (Markdown supported)</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content in Markdown..."
                  className="bg-dark/50 border-purple/20 text-light min-h-[400px] font-mono"
                />
                <p className="text-xs text-gray-400">
                  Supports Markdown: **bold**, *italic*, `code`, ```code blocks```, # headings, [links](url), etc.
                </p>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <label className="text-sm font-medium text-light">
                  Publish immediately
                </label>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark/95 to-purple/10 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-light">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your blog posts</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => openEditor()} className="bg-purple hover:bg-purple/80">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-dark/50 border-purple/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Posts</p>
                  <p className="text-2xl font-bold text-light">{posts.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark/50 border-purple/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Published</p>
                  <p className="text-2xl font-bold text-light">
                    {posts.filter(p => p.published).length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark/50 border-purple/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Drafts</p>
                  <p className="text-2xl font-bold text-light">
                    {posts.filter(p => !p.published).length}
                  </p>
                </div>
                <EyeOff className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Posts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-dark/50 border-purple/20">
            <CardHeader>
              <CardTitle className="text-light">All Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No posts yet. Create your first post!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 bg-dark/30 rounded-lg border border-purple/10"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-light">{post.title}</h3>
                          <Badge
                            variant={post.published ? "default" : "secondary"}
                            className={post.published ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}
                          >
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views_count} views
                          </span>
                          <span className="flex items-center gap-1">
                            ❤️ {post.likes_count} likes
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublished(post)}
                          className="text-gray-400 hover:text-light"
                        >
                          {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditor(post)}
                          className="text-gray-400 hover:text-purple"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard