import React, { useState, useEffect } from 'react'
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
  BarChart3,
  Search,
  Layout,
  FileText,
  MousePointer2,
  TrendingUp,
  History,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { BlogPost as BlogPostType, blogAPI, supabase } from '@/lib/supabase'
import { adminAuth } from '@/lib/auth'
import { parseMarkdown } from '@/lib/markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface AdminDashboardProps {
  onLogout: () => void
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [posts, setPosts] = useState<BlogPostType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null)
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
  const [activeTab, setActiveTab] = useState('command')
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

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

  const openEditor = (post?: BlogPostType) => {
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
    try {
      await blogAPI.deletePost(id)
      toast.success('Record purged from Genesis')
      setDeleteConfirmId(null)
      loadAllPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to purge record')
    }
  }

  const togglePublished = async (post: BlogPostType) => {
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
      <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-teal-950/20 -z-10" />

        {/* Editor Top Bar */}
        <div className="bg-black/60 border-b border-emerald-500/10 backdrop-blur-xl p-4 sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeEditor}
                className="text-emerald-400 hover:bg-emerald-500/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="hidden sm:block">
                <h2 className="text-xl font-black text-white tracking-widest uppercase italic">Genesis Writing Pad</h2>
                <p className="text-[10px] text-emerald-400/40 uppercase font-black tracking-widest">{editingPost ? 'Modifying Existence' : 'Initiating Creation'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-500/10 p-1 rounded-full border border-emerald-500/20">
              <Button
                size="sm"
                variant={editorMode === 'write' ? 'default' : 'ghost'}
                onClick={() => setEditorMode('write')}
                className={`rounded-full px-6 h-8 text-xs font-black uppercase tracking-widest ${editorMode === 'write' ? 'bg-emerald-500 text-black' : 'text-emerald-400'}`}
              >
                Write
              </Button>
              <Button
                size="sm"
                variant={editorMode === 'preview' ? 'default' : 'ghost'}
                onClick={() => setEditorMode('preview')}
                className={`rounded-full px-6 h-8 text-xs font-black uppercase tracking-widest ${editorMode === 'preview' ? 'bg-emerald-500 text-black' : 'text-emerald-400'}`}
              >
                Preview
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-3 mr-4 px-4 border-r border-emerald-500/10">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-emerald-400/40 font-black uppercase tracking-widest">Visibility Status</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${formData.published ? 'text-green-400' : 'text-orange-400'}`}>
                    {formData.published ? 'Public Node' : 'Encrypted Draft'}
                  </span>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest px-8 shadow-lg shadow-emerald-500/20">
                <Save className="w-4 h-4 mr-2" />
                Synchronize
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="max-w-[1800px] mx-auto h-full flex flex-col lg:flex-row">
            {/* Editor Pane */}
            <div className={`flex-1 h-full overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-8 ${editorMode === 'preview' ? 'hidden lg:block lg:border-r lg:border-emerald-500/10' : 'block'}`}>
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.3em] ml-1">Article Designation</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title..."
                    className="bg-transparent border-b-2 border-emerald-500/10 border-t-0 border-x-0 rounded-none text-4xl sm:text-5xl font-black text-white hover:border-emerald-500/30 focus:border-emerald-500/50 transition-all h-auto py-4 px-0 placeholder:text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.3em] ml-1">Digital Coordinates (Slug)</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="url-compatible-slug"
                      className="bg-emerald-500/5 border-emerald-500/10 text-emerald-400 font-mono text-sm focus:border-emerald-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.3em] ml-1">Neural Tags (Comma Separated)</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Genesis, Code, Art..."
                      className="bg-emerald-500/5 border-emerald-500/10 text-emerald-400 focus:border-emerald-500/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.3em] ml-1">Meta Summary (Excerpt)</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Provide a brief abstract of your thoughts..."
                    className="bg-emerald-500/5 border-emerald-500/10 text-white/70 min-h-[100px] focus:border-emerald-500/30 resize-none italic"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.3em] ml-1">Visual Anchor (Image URL)</label>
                  <Input
                    value={formData.featured_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="bg-emerald-500/5 border-emerald-500/10 text-white font-mono text-xs focus:border-emerald-500/30"
                  />
                </div>

                <div className="space-y-2 pt-4 border-t border-emerald-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.3em] ml-1">Substance (Markdown)</label>
                    <span className="text-[10px] text-emerald-400/20 font-black uppercase tracking-widest">Supports Full MD Architecture</span>
                  </div>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Unload your neural data here..."
                    className="bg-transparent border-emerald-500/10 text-white min-h-[600px] font-mono p-6 focus:border-emerald-500/50 leading-relaxed text-lg resize-y custom-scrollbar"
                  />
                </div>
              </div>
            </div>

            {/* Preview Pane */}
            <div className={`flex-1 h-full overflow-y-auto custom-scrollbar p-6 lg:p-10 bg-black/40 ${editorMode === 'write' ? 'hidden lg:block' : 'block'}`}>
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-8 opacity-40">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Live Holo-Preview</span>
                </div>

                {formData.featured_image && (
                  <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-10 border border-emerald-500/20 shadow-2xl">
                    <img src={formData.featured_image} className="w-full h-full object-cover" alt="Cover" />
                  </div>
                )}

                <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 uppercase italic tracking-tighter leading-[0.9]">
                  {formData.title || 'Untitled Genesis Record'}
                </h1>

                <div className="flex flex-wrap gap-2 mb-10">
                  {formData.tags.split(',').map((tag, i) => tag.trim() && (
                    <span key={i} className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
                </div>

                <div
                  className="prose prose-invert max-w-none text-gray-300 gap-6"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.content || '_No content initiated._') }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const totalViews = posts.reduce((acc, p) => acc + (p.views_count || 0), 0)
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes_count || 0), 0)

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-teal-950/20 -z-10" />
      <div className="max-w-[1400px] mx-auto p-4 sm:p-8">

        {/* Dashboard Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Layout className="text-black w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Genesis Dashboard</h1>
            </div>
            <p className="text-emerald-400/40 text-sm font-black uppercase tracking-widest ml-1">Administrative Neural Interface v4.2.0</p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/5 p-1.5 rounded-2xl border border-emerald-500/10">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('command')}
              className={`rounded-xl px-6 h-10 font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'command' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-emerald-400/60 hover:text-emerald-400'}`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Command Center
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('nexus')}
              className={`rounded-xl px-6 h-10 font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'nexus' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-emerald-400/60 hover:text-emerald-400'}`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Nexus Analytics
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2 bg-emerald-500/20" />
            <Button variant="ghost" onClick={handleLogout} className="rounded-xl px-6 h-10 font-black uppercase tracking-widest text-xs text-red-500/60 hover:text-red-500 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>

        {activeTab === 'command' ? (
          <div className="space-y-8">
            {/* Global Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Nodes', value: posts.length, icon: FileText, color: 'emerald' },
                { label: 'Active Signals', value: posts.filter(p => p.published).length, icon: TrendingUp, color: 'blue' },
                { label: 'Neural Reach', value: totalViews, icon: Eye, color: 'cyan' },
                { label: 'Session Likes', value: totalLikes, icon: BarChart3, color: 'teal' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black/40 border border-emerald-500/10 rounded-2xl p-6 backdrop-blur-xl group hover:border-emerald-500/30 transition-all"
                >
                  <p className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</h3>
                    <stat.icon className="w-6 h-6 text-emerald-400/40 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* List Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-y border-emerald-500/10">
              <div className="relative w-full sm:max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/40 group-focus-within:text-emerald-400 transition-colors" />
                <Input
                  placeholder="Query Genesis Database..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-emerald-500/5 border-emerald-500/10 pl-12 h-12 rounded-2xl text-emerald-400 focus:bg-emerald-500/10 transition-all placeholder:text-gray-700"
                />
              </div>
              <Button onClick={() => openEditor()} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest h-12 px-10 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                <Plus className="w-5 h-5 mr-3" />
                Initiate New Entry
              </Button>
            </div>

            {/* Content List */}
            <div className="space-y-4">
              {loading ? (
                <div className="py-32 flex flex-col items-center justify-center opacity-40">
                  <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.5em] text-emerald-400">Loading Neural Patterns...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/10 rounded-3xl opacity-40">
                  <History className="w-12 h-12 mb-4 text-emerald-400/20" />
                  <p className="text-sm font-black uppercase tracking-widest text-emerald-400">No signals detected in this range</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredPosts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-black/40 border border-emerald-500/10 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all"
                    >
                      <div className="p-1 pr-1 bg-gradient-to-r from-emerald-500/5 to-transparent h-full flex flex-col md:flex-row items-stretch">
                        {post.featured_image && (
                          <div className="w-full md:w-32 h-32 md:h-auto overflow-hidden opacity-50 contrast-125 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                            <img src={post.featured_image} className="w-full h-full object-cover" alt="Thumb" />
                          </div>
                        )}
                        <div className="flex-1 p-6 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={`rounded-md text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${post.published ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-400/20'}`}>
                              {post.published ? 'Active Signal' : 'Encrypted Draft'}
                            </Badge>
                            <span className="text-[10px] text-emerald-400/20 font-black uppercase tracking-[0.2em]">{formatDate(post.created_at)}</span>
                          </div>
                          <h3 className="text-xl font-black text-white truncate group-hover:text-emerald-400 transition-colors uppercase italic tracking-tighter mb-1">{post.title}</h3>
                          <div className="flex items-center gap-6 mt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                              <MousePointer2 className="w-3 h-3" /> {post.views_count} Reach
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                              ❤️ {post.likes_count} Resonance
                            </span>
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center justify-center gap-2 p-4 bg-emerald-500/5 border-l border-emerald-500/5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublished(post)}
                            className="w-10 h-10 rounded-xl hover:bg-emerald-500/20 text-emerald-400/40 hover:text-emerald-400"
                          >
                            {post.published ? <EyeOff size={18} /> : <Eye size={18} />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditor(post)}
                            className="w-10 h-10 rounded-xl hover:bg-emerald-500/20 text-emerald-400/40 hover:text-emerald-400"
                          >
                            <Edit size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirmId(post.id)}
                            className="w-10 h-10 rounded-xl hover:bg-red-500/20 text-red-500/40 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-black/40 border-emerald-500/10 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.3em]">Neural Resonance Peak</CardTitle>
                  <CardDescription className="text-white text-3xl font-black italic tracking-tighter">Most Viewed Transmission</CardDescription>
                </CardHeader>
                <CardContent>
                  {posts.length > 0 ? (
                    <div className="space-y-4">
                      {posts.sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 1).map(post => (
                        <div key={post.id}>
                          <p className="text-emerald-400 font-bold uppercase tracking-tight text-lg mb-1">{post.title}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-white">{post.views_count}</span>
                            <span className="text-[10px] text-emerald-400/40 uppercase font-black">Total Signal Intercepts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">No operational data detected.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-emerald-500/10 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.3em]">Global Interaction</CardTitle>
                  <CardDescription className="text-white text-3xl font-black italic tracking-tighter">Engagement Velocity</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="text-5xl font-black text-white mb-2">{totalLikes}</h3>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Total Collective resonance across all nodes</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-emerald-500/10 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <CardTitle className="text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.3em]">Network Density</CardTitle>
                  <CardDescription className="text-white text-3xl font-black italic tracking-tighter">Creation Timeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="text-5xl font-black text-white mb-2">{posts.filter(p => p.published).length} <span className="text-lg text-emerald-500/30">/ {posts.length}</span></h3>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Nodes broadcasted vs internal storage</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics Table */}
            <div className="bg-black/40 border border-emerald-500/10 rounded-3xl overflow-hidden backdrop-blur-xl">
              <div className="p-8 border-b border-emerald-500/10 bg-emerald-500/5">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Detailed Signal Metrics</h3>
                <p className="text-emerald-400/40 text-[10px] font-black uppercase tracking-widest mt-1">Granular analysis of individual neural nodes</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-emerald-500/5 text-[10px] font-black text-emerald-400/40 uppercase tracking-[0.2em]">
                      <th className="p-6">Node Identifier</th>
                      <th className="p-6">Interception Count</th>
                      <th className="p-6">Resonance Stability</th>
                      <th className="p-6">Launch Coordinate</th>
                      <th className="p-6">Efficiency Rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/5">
                    {posts.sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).map((post, i) => (
                      <tr key={post.id} className="hover:bg-emerald-500/5 transition-colors group">
                        <td className="p-6">
                          <p className="font-black text-white group-hover:text-emerald-400 transition-colors uppercase italic tracking-tighter">{post.title}</p>
                          <p className="text-[10px] text-emerald-400/20 font-black uppercase tracking-widest">{post.slug}</p>
                        </td>
                        <td className="p-6">
                          <span className="text-xl font-black text-white">{post.views_count}</span>
                        </td>
                        <td className="p-6">
                          <span className="text-xl font-black text-white">{post.likes_count}</span>
                        </td>
                        <td className="p-6">
                          <span className="text-xs font-black text-emerald-400/40 uppercase tracking-widest">{formatDate(post.created_at)}</span>
                        </td>
                        <td className="p-6 text-right">
                          <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black ${i === 0 ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                            {i === 0 ? 'PRIME NODE' : `COORD-0${i + 1}`}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modern High-End Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-black/90 border-2 border-red-500/20 rounded-[2.5rem] p-10 max-w-lg w-full shadow-[0_0_100px_rgba(239,68,68,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Trash2 className="w-40 h-40 text-red-500" />
            </div>

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              <h2 className="text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">Critical Override</h2>
              <p className="text-red-400/60 font-medium mb-10 leading-relaxed italic">
                You are about to permanently purge this neural node from existence. This action is irrevocable and will fracture the current Genesis timeline.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 h-14 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-95"
                >
                  Confirm Purge
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 h-14 border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                  Abort Action
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard