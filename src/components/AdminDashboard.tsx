import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Search,
  ChevronLeft,
  Eye,
  Save,
  Send,
  Calendar as CalendarIcon,
  Clock,
  Terminal,
  Check,
  Trash2,
  TrendingUp,
  Layers,
  Globe,
  Download
} from 'lucide-react'
import { BlogPost as BlogPostType, BlogComment, blogAPI, isSupabaseConfigured, BlogStats } from '@/lib/supabase'
import { adminAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils'

interface AdminDashboardProps {
  onLogout: () => void
}

import { PostEditor } from './admin/PostEditor'

type DashboardView = 'stats' | 'posts' | 'comments' | 'settings'
type StatusFilter = 'all' | 'published' | 'draft' | 'scheduled'

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeView, setActiveView] = useState<DashboardView>('posts')
  const [posts, setPosts] = useState<BlogPostType[]>([])
  const [comments, setComments] = useState<(BlogComment & { post_title?: string })[]>([])
  const [stats, setStats] = useState<BlogStats>({ totalViews: 0, totalLikes: 0, postCount: 0, commentCount: 0 })
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [cliMode, setCliMode] = useState(false)
  
  // Settings State
  const [nodeSettings, setNodeSettings] = useState({
    title: localStorage.getItem('genesis_node_title') || 'Genesis Blog v4.2',
    visibility: localStorage.getItem('genesis_node_visibility') !== 'false'
  })

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'post' | 'comment';
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'post',
    id: '',
    title: '',
  })

  // Editor State
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null)
  
  // CLI State
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['> Genesis System v4.2.0 initialized...', '> Type "help" for available commands.'])
  const [terminalInput, setTerminalInput] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadAllPosts()
    if (activeView === 'comments') {
      loadAllComments()
    }
    if (activeView === 'stats') {
      loadStats()
    }
  }, [activeView])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput, cliMode])

  const loadAllPosts = async () => {
    try {
      setLoading(true)
      const data = await blogAPI.getAllPosts()
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const loadAllComments = async () => {
    try {
      const data = await blogAPI.getAllComments()
      setComments(data)
    } catch (error) {
      console.error('Error loading comments:', error)
      toast.error('Failed to load comments')
    }
  }

  const loadStats = async () => {
    try {
      const data = await blogAPI.getStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // --- CLI Logic ---
  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = terminalInput.trim().toLowerCase()
    if (!cmd) return

    if (cmd === 'clear') {
      setTerminalOutput([])
      setTerminalInput('')
      return
    }

    const addOutput = (lines: string | string[]) => {
      setTerminalOutput(prev => [...prev, ...(Array.isArray(lines) ? lines : [lines])])
    }

    addOutput(`$ ${terminalInput}`)
    setTerminalInput('')
    
    const args = cmd.split(' ')
    const command = args[0]

    switch (command) {
      case 'help':
        addOutput([
          '> Available commands:',
          '  list               - List all blog posts',
          '  stats              - Show analytics summary',
          '  status             - Show system status',
          '  edit <id>          - Open post in editor',
          '  publish <id>       - Publish a post',
          '  unpublish <id>     - Unpublish a post',
          '  set <id> <k> <v>   - Quick edit (title/slug/excerpt/tags)',
          '  delete <id>        - Delete a post',
          '  clear              - Clear terminal',
          '  gui                - Switch to Graphical Interface',
          '  exit               - Exit CLI mode'
        ])
        break
      case 'list':
        if (posts.length === 0) addOutput('> No posts found.')
        else {
          addOutput(['> ID | TITLE | STATUS | VIEWS', '> --------------------------------'])
          posts.forEach(p => addOutput(`  ${p.id.substring(0, 8)}... | ${p.title.substring(0, 15)}... | ${p.published ? 'LIVE' : 'DRAFT'} | ${p.views_count}`))
        }
        break
      case 'stats':
         addOutput([
           '> System Statistics:',
           `  Total Posts: ${posts.length}`,
           `  Total Views: ${posts.reduce((acc, p) => acc + p.views_count, 0)}`
         ])
         break
      case 'status':
         addOutput([`> System: Genesis v4.2.0`, `> Connection: ${isSupabaseConfigured ? 'Supabase' : 'Mock Mode'}`])
         break
      case 'gui':
      case 'exit':
        setCliMode(false)
        addOutput('> Switching to GUI...')
        break
      case 'new':
        openEditor()
        addOutput('> Opening editor for new post...')
        break
      case 'edit':
        if (args[1]) {
           const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
           if (post) {
             openEditor(post)
             addOutput(`> Opening editor for "${post.title}"...`)
           } else addOutput(`> Error: Post "${args[1]}" not found.`)
        } else addOutput('> Usage: edit <id>')
        break
      case 'publish':
        if (args[1]) {
           const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
           if (post) {
             if (!post.published) {
               addOutput(`> Publishing "${post.title}"...`)
               await blogAPI.updatePost(post.id, { published: true })
               addOutput(`> Success: Post is now LIVE.`)
               loadAllPosts()
             } else addOutput(`> Post is already published.`)
           } else addOutput(`> Error: Post "${args[1]}" not found.`)
        } else addOutput('> Usage: publish <id>')
        break
      case 'unpublish':
        if (args[1]) {
           const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
           if (post) {
             if (post.published) {
               addOutput(`> Unpublishing "${post.title}"...`)
               await blogAPI.updatePost(post.id, { published: false })
               addOutput(`> Success: Post reverted to DRAFT.`)
               loadAllPosts()
             } else addOutput(`> Post is already a draft.`)
           } else addOutput(`> Error: Post "${args[1]}" not found.`)
        } else addOutput('> Usage: unpublish <id>')
        break
      case 'delete':
        if (args[1]) {
           const post = posts.find(p => p.id.startsWith(args[1]) || p.id === args[1])
           if (post) {
             if (args[2] === '--force') {
                addOutput(`> Deleting "${post.title}"...`)
                await blogAPI.deletePost(post.id)
                addOutput(`> Success: Post deleted.`)
                loadAllPosts()
             } else {
                addOutput(`> WARNING: This will permanently delete "${post.title}".`)
                addOutput(`> Type "delete ${args[1]} --force" to confirm.`)
             }
           } else addOutput(`> Error: Post "${args[1]}" not found.`)
        } else addOutput('> Usage: delete <id>')
        break
      case 'set':
        if (args.length >= 4) {
          const [_, id, field, ...valParts] = args
          const val = valParts.join(' ').replace(/^["']|["']$/g, '')
          const post = posts.find(p => p.id.startsWith(id) || p.id === id)
          
          if (post) {
            const allowedFields = ['title', 'slug', 'excerpt', 'tags']
            if (allowedFields.includes(field)) {
               try {
                 addOutput(`> Updating ${field} to "${val}"...`)
                 // Handle tags specially
                 const updateData = field === 'tags' 
                   ? { tags: val.split(',').map(t => t.trim()) }
                   : { [field]: val }
                 
                 await blogAPI.updatePost(post.id, updateData)
                 addOutput(`> Success: Updated.`)
                 loadAllPosts()
               } catch(e) {
                 addOutput(`> Error: Update failed.`)
               }
            } else {
               addOutput(`> Error: Field "${field}" not editable via CLI. Allowed: ${allowedFields.join(', ')}`)
            }
          } else addOutput(`> Error: Post "${id}" not found.`)
        } else addOutput('> Usage: set <id> <field> <value>')
        break
      default:
        addOutput(`> Command not found: ${command}`)
    }
  }

  // --- Editor Logic ---
  const openEditor = (post?: BlogPostType) => {
    setEditingPost(post || null)
    setShowEditor(true)
  }

  const closeEditor = () => {
    setShowEditor(false)
    setEditingPost(null)
  }

  const handleSave = async (data: Partial<BlogPostType>, shouldPublish: boolean) => {
    try {
      const isScheduled = shouldPublish && data.publish_at && new Date(data.publish_at) > new Date()
      
      if (editingPost) {
        await blogAPI.updatePost(editingPost.id, { ...data, published: shouldPublish })
        toast.success(isScheduled ? 'Post scheduled!' : (shouldPublish ? 'Post updated!' : 'Draft saved'))
      } else {
        const createData = {
          title: data.title || 'Untitled',
          content: data.content || '',
          excerpt: data.excerpt || '',
          slug: data.slug || Date.now().toString(),
          tags: data.tags || [],
          published: shouldPublish,
          publish_at: data.publish_at,
          allow_comments: data.allow_comments ?? true,
          author_name: data.author_name || 'Ananth',
          featured_image: data.featured_image,
          location: data.location
        }
        await blogAPI.createPost(createData)
        toast.success(isScheduled ? 'Post scheduled!' : (shouldPublish ? 'Post created!' : 'Draft saved'))
      }

      closeEditor()
      loadAllPosts()
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Failed to save')
    }
  }

  const handleDeleteRequest = (type: 'post' | 'comment', id: string, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      type,
      id,
      title
    })
  }

  const confirmDelete = async () => {
    try {
      if (deleteConfirm.type === 'post') {
        await blogAPI.deletePost(deleteConfirm.id)
        toast.success('Post purged from mainframe')
        loadAllPosts()
      } else {
        await blogAPI.deleteComment(deleteConfirm.id)
        toast.success('Signal interference neutralized')
        loadAllComments()
      }
    } catch (error) {
      toast.error('Failed to complete purge operation')
    } finally {
      setDeleteConfirm(prev => ({ ...prev, isOpen: false }))
    }
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify({ posts, comments, stats }, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `genesis_node_export_${format(new Date(), 'yyyyMMdd_HHmm')}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    toast.success('Mainframe data exported successfully')
  }

  const updateNodeSettings = (updates: Partial<typeof nodeSettings>) => {
    const newSettings = { ...nodeSettings, ...updates }
    setNodeSettings(newSettings)
    if (updates.title !== undefined) localStorage.setItem('genesis_node_title', updates.title)
    if (updates.visibility !== undefined) localStorage.setItem('genesis_node_visibility', String(updates.visibility))
    toast.success('Node parameters updated')
  }

  // --- Filtered Posts ---
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())

      const now = new Date()
      const isScheduled = post.published && post.publish_at && new Date(post.publish_at) > now
      const isPublished = post.published && (!post.publish_at || new Date(post.publish_at) <= now)
      const isDraft = !post.published

      if (statusFilter === 'published') return matchesSearch && isPublished
      if (statusFilter === 'draft') return matchesSearch && isDraft
      if (statusFilter === 'scheduled') return matchesSearch && isScheduled

      return matchesSearch
    })
  }, [posts, searchTerm, statusFilter])

  // --- Views ---

  if (cliMode) {
    return (
      <div className="min-h-screen bg-black text-emerald-500 font-mono p-4 flex flex-col" onClick={() => document.getElementById('cli-input')?.focus()}>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pb-4" ref={terminalRef}>
          {terminalOutput.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">{line}</div>
          ))}
        </div>
        <form onSubmit={handleCommand} className="flex gap-2 border-t border-emerald-900/50 pt-2">
          <span className="text-emerald-500 font-bold">{'>'}</span>
          <input
            id="cli-input"
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-emerald-500 focus:ring-0"
            autoFocus
            autoComplete="off"
          />
        </form>
      </div>
    )
  }

  if (showEditor) {
    return (
      <PostEditor 
        post={editingPost}
        onSave={handleSave}
        onClose={closeEditor}
        onDelete={(id) => handleDeleteRequest('post', id, editingPost?.title || 'Signal')}
      />
    )
  }

  const sidebarItems: { id: DashboardView, icon: React.ElementType, label: string }[] = [
    { id: 'stats', icon: BarChart2, label: 'Overview' },
    { id: 'posts', icon: FileText, label: 'Posts' },
    { id: 'comments', icon: MessageSquare, label: 'Comments' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  // --- Main Dashboard Layout ---
  return (
    <div className="min-h-screen bg-zinc-950 flex font-sans text-zinc-200">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900/50 border-r border-zinc-800/50 backdrop-blur-xl flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center px-6 border-b border-zinc-800/50">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 font-black text-xl mr-3 shadow-lg shadow-emerald-500/20">
            G
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tighter text-white leading-none uppercase">{nodeSettings.title.split(' ')[0]}</span>
            <span className="text-[10px] text-emerald-500 font-bold tracking-[0.2em] uppercase mt-1">Control Node</span>
          </div>
        </div>

        <div className="p-4 mt-2">
          <Button 
             onClick={() => openEditor()} 
             className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl h-12 shadow-lg shadow-emerald-500/10 flex items-center gap-2 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> New Broadcast
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-xl relative group",
                activeView === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", activeView === item.id ? "text-emerald-400" : "text-zinc-500")} />
              {item.label}
              {activeView === item.id && (
                <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-zinc-800/50">
          <Button
            variant="ghost"
            onClick={() => setCliMode(true)}
            className="w-full justify-start text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/5 px-4 rounded-xl mb-2 font-bold"
          >
            <Terminal className="w-4 h-4 mr-3" /> CLI Mode
          </Button>
          <Button
            variant="ghost"
            onClick={() => { adminAuth.logout(); onLogout() }}
            className="w-full justify-start text-zinc-500 hover:text-red-400 hover:bg-red-400/5 px-4 rounded-xl font-bold"
          >
            <LogOut className="w-4 h-4 mr-3" /> Terminate
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen relative overflow-x-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        
        <main className="p-8 max-w-7xl mx-auto w-full relative z-10">

          <AnimatePresence mode="wait">
            {/* Posts View */}
            {activeView === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Broadcasts</h1>
                    <p className="text-zinc-500 font-medium mt-1">Manage and monitor your digital signals.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                      <Input
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full md:w-64 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-0 rounded-xl transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
                  {/* Status Filters */}
                  <div className="flex items-center gap-6 p-4 border-b border-zinc-800/50 text-sm font-bold bg-zinc-900/30 overflow-x-auto no-scrollbar">
                    {(['all', 'published', 'draft', 'scheduled'] as StatusFilter[]).map(fid => {
                      const labels: Record<StatusFilter, string> = {
                        all: 'All Signals',
                        published: 'Live',
                        draft: 'Drafts',
                        scheduled: 'Scheduled'
                      }
                      const count = fid === 'all' ? posts.length :
                                    fid === 'published' ? posts.filter(p => p.published && (!p.publish_at || new Date(p.publish_at) <= new Date())).length :
                                    fid === 'draft' ? posts.filter(p => !p.published).length :
                                    posts.filter(p => p.published && p.publish_at && new Date(p.publish_at) > new Date()).length

                      return (
                        <button
                          key={fid}
                          onClick={() => setStatusFilter(fid)}
                          className={cn(
                            "whitespace-nowrap pb-4 -mb-4 px-1 transition-all relative",
                            statusFilter === fid ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                          )}
                        >
                          {labels[fid]} <span className="ml-1 opacity-40 text-[10px]">{count}</span>
                          {statusFilter === fid && (
                            <motion.div layoutId="filterUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Post List */}
                  <div className="divide-y divide-zinc-800/30">
                    {loading ? (
                      <div className="p-20 text-center">
                        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Scanning Frequencies...</p>
                      </div>
                    ) : filteredPosts.length === 0 ? (
                      <div className="p-20 text-center flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-zinc-800/50 rounded-3xl flex items-center justify-center border border-zinc-700/50">
                          <FileText className="w-10 h-10 text-zinc-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-white font-black text-xl tracking-tight">No signals detected</p>
                          <p className="text-zinc-500 max-w-xs mx-auto">Try adjusting your filters or initiate a new broadcast session.</p>
                        </div>
                        <Button onClick={() => openEditor()} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl">Create Post</Button>
                      </div>
                    ) : (
                      filteredPosts.map(post => (
                        <div
                          key={post.id}
                          className="group flex items-center gap-6 p-5 hover:bg-emerald-500/5 transition-all cursor-pointer relative"
                          onClick={() => openEditor(post)}
                        >
                           <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-zinc-600 text-xl border border-zinc-700/30 group-hover:border-emerald-500/30 transition-all overflow-hidden relative">
                             {post.featured_image ? (
                               <img src={post.featured_image} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                             ) : (
                               post.title.charAt(0)
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                           </div>

                           <div className="flex-1 min-w-0">
                             <h3 className="font-bold text-white text-lg truncate group-hover:text-emerald-400 transition-colors tracking-tight">{post.title}</h3>
                             <div className="flex items-center gap-4 text-[10px] text-zinc-500 mt-2 font-bold uppercase tracking-wider">
                                {post.published ? (
                                  post.publish_at && new Date(post.publish_at) > new Date() ? (
                                    <span className="text-blue-400 flex items-center gap-1.5 bg-blue-400/10 px-2 py-0.5 rounded-md border border-blue-400/20"><Clock className="w-3 h-3" /> Scheduled</span>
                                  ) : (
                                    <span className="text-emerald-400 flex items-center gap-1.5 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20"><Check className="w-3 h-3" /> Active</span>
                                  )
                                ) : (
                                  <span className="text-zinc-400 flex items-center gap-1.5 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700"><FileText className="w-3 h-3" /> Offline</span>
                                )}
                                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {post.views_count}</span>
                                <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {post.comments_count || 0}</span>
                                <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                             </div>
                           </div>

                           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                             <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                              onClick={(e) => { e.stopPropagation(); handleDeleteRequest('post', post.id, post.title) }}
                             >
                               <Trash2 className="w-5 h-5" />
                             </Button>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats View */}
            {activeView === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Analytics</h1>
                    <p className="text-zinc-500 font-medium mt-1">Real-time signal data monitoring.</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/5 rounded-xl gap-2 font-bold"
                  >
                    <Download className="w-4 h-4" /> Export Mainframe
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Signal Reach', value: stats.totalViews, icon: Eye, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: 'Network Resonance', value: stats.totalLikes, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { label: 'Broadcast Count', value: stats.postCount, icon: Layers, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    { label: 'User Feedback', value: stats.commentCount, icon: MessageSquare, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-zinc-900/50 p-6 border border-zinc-800/50 rounded-2xl shadow-xl backdrop-blur-sm group hover:border-emerald-500/20 transition-all"
                    >
                       <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300", stat.bg)}>
                          <stat.icon className={cn("w-6 h-6", stat.color)} />
                       </div>
                       <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</h3>
                       <p className="text-3xl font-black text-white tracking-tighter">{stat.value.toLocaleString()}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-zinc-900/50 p-6 border border-zinc-800/50 rounded-2xl shadow-xl backdrop-blur-sm">
                    <h3 className="font-black text-white text-lg mb-8 tracking-tight">Signal Distribution</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={posts.slice(0, 10).reverse().map(p => ({ name: p.title.substring(0, 10), views: p.views_count }))}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                          <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#10b981' }}
                          />
                          <Area type="monotone" dataKey="views" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 p-6 border border-zinc-800/50 rounded-2xl shadow-xl backdrop-blur-sm">
                    <h3 className="font-black text-white text-lg mb-8 tracking-tight">Post Engagement</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={posts.slice(0, 8).map(p => ({ name: p.title.substring(0, 10), engagement: (p.likes_count || 0) + (p.comments_count || 0) }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                          <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip
                             contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }}
                          />
                          <Bar dataKey="engagement" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                            {posts.slice(0, 8).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Comments View */}
            {activeView === 'comments' && (
              <motion.div
                key="comments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-black text-white tracking-tighter">Feedback Loop</h1>
                  <p className="text-zinc-500 font-medium mt-1">Direct communication from the network.</p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden">
                  <div className="divide-y divide-zinc-800/50">
                    {comments.length === 0 ? (
                      <div className="p-20 text-center flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-zinc-800/50 rounded-3xl flex items-center justify-center border border-zinc-700/50">
                          <MessageSquare className="w-10 h-10 text-zinc-600" />
                        </div>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No feedback signals received</p>
                      </div>
                    ) : (
                      comments.map(comment => (
                        <div key={comment.id} className="group p-6 hover:bg-emerald-500/5 transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 font-black text-sm border border-emerald-500/20">
                                {comment.author.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-black text-white block text-sm tracking-tight">{comment.author}</span>
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                  Signal: <span className="text-emerald-500">{comment.post_title || 'Unknown Source'}</span>
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest bg-zinc-800/50 px-2 py-1 rounded-md">
                              {format(new Date(comment.created_at), 'MMM d, HH:mm')}
                            </span>
                          </div>

                          <p className="text-zinc-400 text-sm pl-14 mb-6 leading-relaxed">{comment.content}</p>

                          <div className="pl-14 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 px-4 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl font-bold gap-2"
                              onClick={() => handleDeleteRequest('comment', comment.id, `Comment by ${comment.author}`)}
                            >
                              <Trash2 className="w-4 h-4" /> Purge Signal
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings View */}
            {activeView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-black text-white tracking-tighter">Core Config</h1>
                  <p className="text-zinc-500 font-medium mt-1">Adjust Genesis Node parameters.</p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl shadow-xl backdrop-blur-sm p-8 space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" /> System Identity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2 py-2 border-b border-zinc-800/30">
                        <label className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Node Identity (Title)</label>
                        <Input
                          value={nodeSettings.title}
                          onChange={(e) => updateNodeSettings({ title: e.target.value })}
                          className="bg-zinc-900 border-zinc-800 text-white font-black tracking-tight rounded-xl focus:border-emerald-500/50"
                        />
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/30">
                        <span className="text-zinc-500 font-bold text-sm uppercase tracking-wider">Protocol</span>
                        <span className="text-emerald-500 font-bold font-mono text-xs">HTTPS / SECURE</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-zinc-500 font-bold text-sm uppercase tracking-wider">Status</span>
                        <span className="text-emerald-400 flex items-center gap-2 font-black text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> OPTIMAL
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" /> Encryption & Privacy
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                       <div className="space-y-1">
                         <div className="text-white font-black text-sm tracking-tight">Public Visibility</div>
                         <div className="text-zinc-500 text-xs">Broadcast signal to global search engines.</div>
                       </div>
                       <Switch
                        checked={nodeSettings.visibility}
                        onCheckedChange={(c) => updateNodeSettings({ visibility: c })}
                        className="data-[state=checked]:bg-emerald-500"
                       />
                    </div>
                  </div>

                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <p className="text-emerald-400 text-xs font-bold leading-relaxed text-center italic">
                      "Control is an illusion, but settings are real. Configure with absolute intent."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(open) => setDeleteConfirm(prev => ({ ...prev, isOpen: open }))}>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-3xl shadow-2xl backdrop-blur-xl max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black tracking-tighter flex items-center gap-3 text-red-500">
                  <Trash2 className="w-6 h-6" /> TERMINATE?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400 font-medium py-2 leading-relaxed">
                  Are you sure you want to purge <span className="text-white font-bold">"{deleteConfirm.title}"</span>? This action is irreversible and the neural data will be lost from the mainframe.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 flex gap-2">
                <AlertDialogCancel className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white rounded-xl font-bold h-12 transition-all">
                  Hold Position
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-400 text-white font-black rounded-xl h-12 shadow-lg shadow-red-500/20 transition-all"
                >
                  Confirm Purge
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </main>
      </div>
    </div>
  )
}

export default AdminDashboard